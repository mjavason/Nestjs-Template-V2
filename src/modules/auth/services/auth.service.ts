import { ConfirmEmailDto } from '@/modules/auth/dtos/confirm-email-address.dto';
import { ForgotPasswordDto } from '@/modules/auth/dtos/forgot-email.dto';
import { RequestEmailVerificationDto } from '@/modules/auth/dtos/request-email-verification.dto';
import { ResetPasswordDto } from '@/modules/auth/dtos/reset-password.dto';
import { LoginDto } from '@/modules/auth/dtos/sign-in.dto';
import { SignUpInputType } from '@/modules/auth/dtos/sign-up.dto';
import { SocialSignUpDto } from '@/modules/auth/dtos/social-signup.dto';
import { transformAuthSignup } from '@/modules/auth/transformers/auth-signup.transformer';
import { AuthSignupOutput } from '@/modules/auth/types/auth-outputs.types';
import { MailService } from '@/modules/mail/services/mail.service';
import { Token, TokenDocumentType } from '@common/models/user/token.schema';
import { User, UserDocumentType } from '@common/models/user/user.schema';
import { TOKEN_TYPE } from '@common/types/token/token.enum';
import { generateRandomAvatar } from '@common/utils/dicebar.util';
import configuration from '@configs/configuration';
import { APP_NAME } from '@configs/constants/constants';
import log from '@configs/logger/logger.config';
import {
  BadRequestException,
  Injectable,
  NotImplementedException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { convertMinuteToUTC } from '@utils/date.util';
import { extractEmailUsername } from '@utils/extract-email-username.util';
import { generateRandomDigits } from '@utils/random_token.util';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as firebaseAdmin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocumentType>,
    private readonly mailService: MailService,
  ) {}

  async verifyIdToken(data: SocialSignUpDto) {
    if (data.provider === 'google.com') {
      return await this.verifyGoogleToken(data.token);
    }

    throw new NotImplementedException('Provider unavailable');
  }

  async verifyGoogleToken(token: string): Promise<{
    firstName: string;
    lastName: string;
    picture: string;
    email: string;
  }> {
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
      const [firstName, lastName] = decodedToken.name.split(' ');
      log.info({
        context: `${AuthService.name}#${this.verifyGoogleToken.name}`,
        message: 'Google token verified successfully',
        email: decodedToken.email,
      });
      return {
        firstName,
        lastName,
        picture: decodedToken.picture,
        email: decodedToken.email.toLowerCase(),
      };
    } catch (err) {
      log.error({
        context: `${AuthService.name}#${this.verifyGoogleToken.name}`,
        message: '[Google] Failed to decode/verify id token',
        err,
      });
      throw new BadRequestException('Failed to complete google signup');
    }
  }

  async socialAuth(data: SocialSignUpDto): Promise<AuthSignupOutput> {
    const decoded = await this.verifyIdToken(data);

    const email = decoded.email.toLowerCase();
    const userName = extractEmailUsername(email);
    let user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      user = await this.userModel.create({
        email,
        userName,
        pictureUrl: decoded.picture,
        isEmailVerified: true,
        authMethod: data.provider,
      });
    } else {
      log.info({
        context: `${AuthService.name}#${this.socialAuth.name}`,
        message: 'User already exists and is logged in via social',
        email,
      });
    }

    const token = this.generateAuthToken({
      id: user.id,
      email: user.email,
    });

    log.info({
      context: `${AuthService.name}#${this.socialAuth.name}`,
      message: 'Social signup completed',
      email,
    });

    return transformAuthSignup(user.toObject(), token);
  }

  async signUpUser(data: SignUpInputType): Promise<AuthSignupOutput> {
    try {
      const userName = extractEmailUsername(data.email);
      const password = data.password;

      const existingUser = await this.userModel.findOne(
        { email: data.email.toLowerCase() },
        { _id: 1, email: 1, userName: 1 },
      );
      if (existingUser) {
        log.error({
          context: `${AuthService.name}#${this.signUpUser.name}`,
          message: 'User already exists and tried to sign up again',
          data,
        });
        throw new BadRequestException('User already exists');
      }

      const user = await this.userModel.create({
        email: data.email.toLowerCase(),
        userName: userName.toLowerCase(),
        pictureUrl: generateRandomAvatar(data.email.toLowerCase()),
        isEmailVerified: false,
        password,
        authMethod: 'default',
      });

      await this.sendEmailVerification(user);

      const token = this.generateAuthToken({
        id: user.id,
        email: user.email,
      });

      log.info({
        context: `${AuthService.name}#${this.signUpUser.name}`,
        message: 'New User Signup',
        data,
      });
      return transformAuthSignup(user.toObject(), token);
    } catch (err) {
      log.error({
        context: `${AuthService.name}#${this.signUpUser.name}`,
        message: 'Failed to sign up user',
        err,
        data,
      });
      throw err;
    }
  }

  async confirmEmail(dto: ConfirmEmailDto) {
    const errorMessage = 'Invalid or expired token';
    const user = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (!user) throw new BadRequestException(errorMessage);
    if (user.isEmailVerified) return { message: 'Email verified successfully' };

    const token = await this.tokenModel.findOne({
      userId: user.id,
      token: dto.token,
      type: TOKEN_TYPE.EMAIL_CONFIRM,
    });
    if (!token) throw new BadRequestException(errorMessage);
    if (Date.now() > token.expiresAt)
      throw new BadRequestException(errorMessage);

    user.isEmailVerified = true;
    await user.save();
    await token.deleteOne();

    log.info({
      context: `${AuthService.name}#${this.confirmEmail.name}`,
      message: 'Email verified successfully',
      email: user.email,
    });

    return { message: 'Email verified successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne(
      { email: dto.email.toLowerCase() },
      {
        password: 1,
        email: 1,
        firstName: 1,
        is2FAEnabled: 1,
        isEmailVerified: 1,
        userName: 1,
      },
    );

    if (!user || !user?.password)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // If 2FA is enabled, generate code and send email
    if (user.is2FAEnabled) {
      const code = generateRandomDigits(5);

      await this.tokenModel.create({
        userId: user.id,
        token: code,
        type: TOKEN_TYPE.TWO_FACTOR,
        expiresAt: new Date(Date.now() + convertMinuteToUTC(10)),
      });

      await this.mailService.sendSimpleMail({
        recipientFirstName: user.userName,
        recipientEmail: user.email,
        mailHtmlBody: `Your 2FA code is: ${code}`,
        mailSubject: 'Your Two-Factor Authentication Code',
      });

      log.info({
        context: `${AuthService.name}#${this.login.name}`,
        message: '2FA code sent via email',
        userId: user.id,
        email: user.email,
      });

      return { message: '2FA code sent to email' };
    }

    // If no 2FA, issue token directly
    const token = this.generateAuthToken({
      id: user.id,
      email: user.email,
    });

    log.info({
      context: `${AuthService.name}#${this.login.name}`,
      message: 'Login successful',
      userId: user.id,
      email: user.email,
    });

    return transformAuthSignup(user.toObject(), token);
  }

  async verifyTwoFactor(email: string, code: string) {
    const user = await this.userModel.findOne({ email: email.toLowerCase() });
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.is2FAEnabled)
      throw new BadRequestException('2FA is not enabled for this user');

    const tokenDoc = await this.tokenModel.findOne({
      userId: user.id,
      token: code,
      type: TOKEN_TYPE.TWO_FACTOR,
    });
    if (!tokenDoc) throw new UnauthorizedException('Invalid or expired code');
    if (Date.now() > tokenDoc.expiresAt)
      throw new UnauthorizedException('Invalid or expired code');

    await this.tokenModel.deleteMany({
      userId: user.id,
      type: TOKEN_TYPE.TWO_FACTOR,
    });

    const token = this.generateAuthToken({ id: user.id, email: user.email });

    log.info({
      context: `${AuthService.name}#${this.verifyTwoFactor.name}`,
      message: '2FA verified, login successful',
      userId: user.id,
      email: user.email,
    });

    return transformAuthSignup(user.toObject(), token);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    log.info({
      context: `${AuthService.name}#${this.forgotPassword.name}`,
      message: 'Password reset requested',
      email: dto.email.toLowerCase(),
    });

    const user = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (!user) throw new BadRequestException('User not found');

    const code = generateRandomDigits(5);
    await this.tokenModel.create({
      userId: user.id,
      token: code,
      type: TOKEN_TYPE.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + convertMinuteToUTC(15)),
    });

    await this.mailService.sendSimpleMail({
      recipientFirstName: user.userName,
      recipientEmail: user.email,
      mailHtmlBody: code,
      mailSubject: 'Password reset code',
    });

    log.info({
      context: `${AuthService.name}#${this.forgotPassword.name}`,
      message: 'Password reset code sent via email',
      email: user.email,
    });

    return { message: 'Password reset code sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.userModel.findOne({
      email: dto.email.toLowerCase(),
    });
    if (!user) throw new BadRequestException('User not found');

    const tokenDoc = await this.tokenModel.findOne({
      userId: user.id,
      token: dto.token,
      type: TOKEN_TYPE.PASSWORD_RESET,
    });
    if (!tokenDoc) throw new BadRequestException('Invalid or expired token');
    if (Date.now() > tokenDoc.expiresAt)
      throw new BadRequestException('Invalid or expired token');

    user.password = dto.password;
    await user.save();

    await this.tokenModel.deleteMany({
      userId: user.id,
      type: TOKEN_TYPE.PASSWORD_RESET,
    });

    log.info({
      context: `${AuthService.name}#${this.resetPassword.name}`,
      message: 'Password reset successfully',
      userId: user.id,
      email: user.email,
    });

    return { message: 'Password reset successfully' };
  }

  private generateAuthToken(data: { id: string; email: string }): string {
    return jwt.sign(
      {
        expires: configuration().JWT_EXPIRY,
        issuer: APP_NAME,
        sub: data.id,
        iat: Math.floor(Date.now() / 1000),
        jti: randomUUID(),
      },
      configuration().JWT_SECRET,
    );
  }

  async sendEmailVerification(user: UserDocumentType) {
    log.info({
      context: `${AuthService.name}#${this.sendEmailVerification.name}`,
      message: 'User created',
      userId: user.id,
      email: user.email,
    });

    const code = generateRandomDigits(5);
    void this.tokenModel.create({
      userId: user.id,
      type: TOKEN_TYPE.EMAIL_CONFIRM,
      token: code,
      expiresAt: new Date(Date.now() + convertMinuteToUTC(5)),
    });

    void this.mailService.sendSimpleMail({
      recipientFirstName: user.userName,
      recipientEmail: user.email,
      mailHtmlBody: `Email verification code: ${code}`,
      mailSubject: 'Verify your email',
    });

    log.info({
      context: `${AuthService.name}#${this.sendEmailVerification.name}`,
      message: 'Email confirmation code sent',
      email: user.email,
    });
  }

  async requestEmailVerification(data: RequestEmailVerificationDto) {
    const message = { message: 'Verification email sent successfully' };

    const user = await this.userModel.findOne({
      email: data.email.toLowerCase(),
    });
    if (!user) return message;

    await this.sendEmailVerification(user);
    return message;
  }

  async isUserNameAvailable(userName: string) {
    const isDuplicate = await this.userModel.exists({
      userName: userName.toLowerCase(),
    });
    if (isDuplicate) throw new BadRequestException('This username is taken');

    return { message: 'Username available' };
  }
}
