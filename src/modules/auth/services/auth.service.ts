import { ConfirmEmailDto } from '@/modules/auth/dtos/confirm-email-address.dto';
import { ConfirmPhoneNumberDto } from '@/modules/auth/dtos/confirm-phone-number.dto';
import { SignUpInputType } from '@/modules/auth/dtos/sign-up.dto';
import {
  AuthSignupOutput,
  authSignupOutputSchema,
} from '@/modules/auth/types/auth-outputs.types';
import { MailService } from '@/modules/mail/services/mail.service';
import { Role, RoleDocumentType } from '@common/models/role.schema';
import { Token, TokenDocumentType } from '@common/models/token.schema';
import { User, UserDocumentType } from '@common/models/user.schema';
import { TOKEN_TYPE } from '@common/types/token/token.enum';
import { generateRandomAvatar } from '@common/utils/dicebar.util';
import { stripToSchema } from '@common/utils/strip-to-schema.util';
import configuration from '@configs/configuration';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { convertMinuteToUTC } from '@utils/date.util';
import { generateRandomDigits } from '@utils/random_token.util';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import * as firebaseAdmin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { ForgotPasswordDto } from '../dtos/forgot-email.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { SetPasswordDto } from '../dtos/set-password.dto';
import { LoginDto } from '../dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocumentType>,
    @InjectModel(Token.name)
    private readonly tokenModel: Model<TokenDocumentType>,
    private readonly mailService: MailService,
  ) {}

  async verifyIdToken(data: { provider?: string; token: string }) {
    if (data.provider === 'google') {
      return await this.verifyGoogleToken(data.token);
    }
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

  async socialSignup(data: {
    token: string;
    provider: string;
  }): Promise<AuthSignupOutput> {
    const signupData = await this.verifyIdToken(data);
    const result = await this.signUpUser(signupData);
    log.info({
      context: `${AuthService.name}#${this.socialSignup.name}`,
      message: 'Social signup completed',
      email: signupData.email,
    });
    return result;
  }

  async signUpUser(data: SignUpInputType): Promise<AuthSignupOutput> {
    let user = await this.userModel.findOne(
      {
        email: data.email.toLowerCase(),
      },
      { _id: 1, email: 1 },
    );
    if (user) {
      log.error({
        context: `${AuthService.name}#${this.signUpUser.name}`,
        message: 'User with email already exists and tried to sign up again',
        data,
      });
      throw new BadRequestException('User with email already exists');
    }

    // TODO: I am worried about this role check here
    const role = await this.roleModel.exists({ _id: data.role });
    if (!role) {
      log.error({
        context: `${AuthService.name}#${this.signUpUser.name}`,
        message: 'Invalid role provided during signup',
        roleId: data.role,
      });
      throw new BadRequestException('Invalid role');
    }

    user = await this.userModel.create({
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      pictureUrl:
        data.pictureUrl ?? generateRandomAvatar(data.email.toLowerCase()),
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    log.info({
      context: `${AuthService.name}#${this.signUpUser.name}`,
      message: 'User created',
      userId: user.id,
      email: user.email,
    });

    const code = generateRandomDigits(6);
    await this.tokenModel.create({
      userId: user.id,
      type: TOKEN_TYPE.EMAIL_CONFIRM,
      token: code,
      expiresAt: new Date(Date.now() + convertMinuteToUTC(5)),
    });

    await this.mailService.sendSimpleMail({
      recipientFirstName: data.firstName,
      recipientEmail: data.email,
      mailHtmlBody: code,
      mailSubject: 'Verify your email',
    });

    log.info({
      context: `${AuthService.name}#${this.signUpUser.name}`,
      message: 'Email confirmation code sent',
      email: data.email,
    });

    const token = this.generateAuthToken({
      id: user.id,
      email: user.email,
    });

    log.info({
      context: `${AuthService.name}#${this.signUpUser.name}`,
      message: 'New User Signup',
      data,
    });
    return stripToSchema(authSignupOutputSchema, { ...user.toObject(), token });
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

  async createPassword(dto: SetPasswordDto, userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    user.password = dto.password;
    await user.save();

    log.info({
      context: `${AuthService.name}#${this.createPassword.name}`,
      message: 'Password created successfully',
      userId,
    });

    return { message: 'Password created successfully' };
  }

  async confirmPhoneNumber(dto: ConfirmPhoneNumberDto) {
    const errorMessage = 'Invalid or expired token';

    const user = await this.userModel.findOne({ phoneNumber: dto.phoneNumber });
    if (!user) throw new BadRequestException(errorMessage);
    if (user.isPhoneNumberVerified)
      return { message: 'Phone verified successfully' };

    const token = await this.tokenModel.findOne({
      userId: user.id,
      token: dto.token,
      type: TOKEN_TYPE.EMAIL_CONFIRM, // TODO: Implement SMS service
    });
    if (!token) throw new BadRequestException(errorMessage);
    if (Date.now() > token.expiresAt)
      throw new BadRequestException(errorMessage);

    user.isPhoneNumberVerified = true;
    await user.save();
    await token.deleteOne();

    log.info({
      context: `${AuthService.name}#${this.confirmPhoneNumber.name}`,
      message: 'Phone number verified successfully',
      phoneNumber: dto.phoneNumber,
    });

    return { message: 'Phone verified successfully' };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne(
      {
        email: dto.email.toLowerCase(),
      },
      { password: 1, email: 1 },
    );
    if (!user || !user?.password)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

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
    return stripToSchema(authSignupOutputSchema, { ...user.toObject(), token });
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

    const code = generateRandomDigits(6);
    await this.tokenModel.create({
      userId: user.id,
      token: code,
      type: TOKEN_TYPE.PASSWORD_RESET,
      expiresAt: new Date(Date.now() + convertMinuteToUTC(15)),
    });

    await this.mailService.sendSimpleMail({
      recipientFirstName: user.firstName,
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
        issuer: 'startup-api',
        sub: data.id,
        iat: Math.floor(Date.now() / 1000),
        jti: randomUUID(),
      },
      configuration().JWT_SECRET,
    );
  }
}
