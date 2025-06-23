import {
  AuthSignupOutput,
  authSignupOutputSchema,
} from '@/modules/auth/types/auth-outputs.types';
import { SignUpSchema } from '@/modules/auth/validation/sign-up.validation';
import { Role, RoleDocumentType } from '@common/models/user/role.schema';
import { User, UserDocumentType } from '@common/models/user/user.schema';
import { generateRandomAvatar } from '@common/utils/dicebar.util';
import { stripToSchema } from '@common/utils/strip-to-schema.util';
import configuration from '@configs/configuration';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as firebaseAdmin from 'firebase-admin';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
    @InjectModel(Role.name) private readonly roleModel: Model<RoleDocumentType>,
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
      return {
        firstName,
        lastName,
        picture: decodedToken.picture,
        email: decodedToken.email.toLowerCase(),
      };
    } catch (err) {
      log.error({ message: '[Google] Failed to decode/verify id token', err });
      throw new BadRequestException('Failed to complete google signup');
    }
  }

  async socialSignup(data: {
    token: string;
    provider: string;
  }): Promise<AuthSignupOutput> {
    const signupData = await this.verifyIdToken(data);
    return this.signUpUser(signupData);
  }

  async signUpUser(data: SignUpSchema): Promise<AuthSignupOutput> {
    let user = await this.userModel.findOne(
      {
        email: data.email.toLowerCase(),
      },
      { _id: 1, email: 1 },
    );

    if (!user) {
      const role = await this.roleModel.exists({ _id: data.role });
      if (!role) throw new BadRequestException('Invalid role');

      user = await this.userModel.create({
        email: data.email.toLowerCase(),
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        pictureUrl:
          data.pictureUrl ?? generateRandomAvatar(data.email.toLowerCase()),
      });
    }

    const token = this.generateAuthToken({
      id: user._id.toString(),
      email: user.email,
    });

    log.info({ message: 'New User Signup', data });
    return stripToSchema(authSignupOutputSchema, { ...user.toObject(), token });
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
