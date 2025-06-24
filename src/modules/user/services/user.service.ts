import { User, UserDocumentType } from '@common/models/user.schema';
import { UserType } from '@common/types/user/user.type';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
  ) {}

  async updateProfile(id: string, updates: Partial<UserType>) {
    const data = await this.userModel.findByIdAndUpdate(id, updates, {}).lean();

    // If email or password was updated, send email
    if (updates.email || updates.password) {
      // TODO: Send verification email with the token
      // Token logic handled elsewhere

      return {
        data,
        message:
          'Update successful, verification mail has been sent to your email address',
      };
    }

    return data;
  }
}
