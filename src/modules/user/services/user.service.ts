import { paginate } from '@/helpers/pagination.helper';
import { UpdateProfileDto } from '@/modules/user/dtos/update-profile.dto';
import { User, UserDocumentType } from '@common/models/user/user.schema';
import { UserStatusEnum } from '@common/types/user/user.enum';
import { grafanaLogger } from '@configs/logger/logger.config';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { UpdateProfileAdminDto } from '../dtos/update-profile-admin.dto';
import { transformUserProfile } from '../transformers/user-profile.transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
  ) {}

  // async updateProfile(id: string, updates: Partial<UserType>) {
  //   const data = await this.userModel.findByIdAndUpdate(id, updates, {}).lean();

  //   // If email or password was updated, send email
  //   if (updates.email || updates.password) {
  //     // TODO: Send verification email with the token
  //     // Token logic handled elsewhere

  //     return {
  //       data,
  //       message:
  //         'Update successful, verification mail has been sent to your email address',
  //     };
  //   }

  //   return data;
  // }

  buildQueryFromFilterDto(filter: FilterUserDto) {
    const query: any = {};

    if (filter.authMethod) {
      query.authMethod = filter.authMethod;
    }

    if (filter.email) {
      query.email = { $regex: filter.email, $options: 'i' };
    }

    if (filter.firstName) {
      query.firstName = { $regex: filter.firstName, $options: 'i' };
    }

    if (filter.lastName) {
      query.lastName = { $regex: filter.lastName, $options: 'i' };
    }

    if (filter.userName) {
      query.userName = { $regex: filter.userName, $options: 'i' };
    }

    if (filter.isEmailVerified !== undefined) {
      query.isEmailVerified = filter.isEmailVerified;
    }

    if (filter.isPhoneNumberVerified !== undefined) {
      query.isPhoneNumberVerified = filter.isPhoneNumberVerified;
    }

    if (filter.phoneNumber) {
      query.phoneNumber = { $regex: filter.phoneNumber, $options: 'i' };
    }

    if (filter.status) {
      query.status = filter.status;
    }

    if (filter.isSuper !== undefined) {
      query.isSuper = filter.isSuper;
    }

    if (filter.is2FAEnabled !== undefined) {
      query.is2FAEnabled = filter.is2FAEnabled;
    }

    if (filter.hasActiveSubscription !== undefined) {
      query.hasActiveSubscription = filter.hasActiveSubscription;
    }

    if (filter.isAutoSubscriptionEnabled !== undefined) {
      query.isAutoSubscriptionEnabled = filter.isAutoSubscriptionEnabled;
    }

    return query;
  }

  async filterUsers(
    filter: FilterUserDto,
    page: number = 1,
    limit: number = 10,
  ) {
    const query = this.buildQueryFromFilterDto(filter);
    const users = await paginate<UserDocumentType>(
      this.userModel,
      query,
      { createdAt: -1 },
      page,
      limit,
    );

    return {
      data: {
        items: users.data.map(transformUserProfile),
        pagination: users.pagination,
      },
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto | UpdateProfileAdminDto,
  ) {
    grafanaLogger.info({
      context: `${UserService.name}#${this.updateProfile.name}`,
      message: 'Updating user profile',
      userId,
      updateFields: Object.keys(dto),
    });

    try {
      await this.userModel.findByIdAndUpdate(userId, dto);

      grafanaLogger.info({
        context: `${UserService.name}#${this.updateProfile.name}`,
        message: 'User profile updated successfully',
        userId,
      });

      return { success: true, message: 'Profile updated' };
    } catch (error: any) {
      grafanaLogger.error({
        context: `${UserService.name}#${this.updateProfile.name}`,
        message: 'Error updating user profile',
        userId,
        error: error.message,
      });

      throw new BadRequestException(
        `Failed to update profile: ${error.message}`,
      );
    }
  }

  async blockOrUnblockUserAccount(userId: string) {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) throw new NotFoundException('User not found');

    user.status =
      user.status === UserStatusEnum.ACTIVE
        ? UserStatusEnum.INACTIVE
        : UserStatusEnum.ACTIVE;

    await user.save();
  }

  async getUserProfileById(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) throw new NotFoundException('User not found');

    return transformUserProfile(user);
  }
}
