import { UpdateProfileDto } from '@/modules/user/dtos/update-profile.dto';
import { User, UserDocumentType } from '@common/models/user/user.schema';
import log from '@configs/logger/logger.config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocumentType>,
  ) {}

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    log.info({
      context: `${UserService.name}#${this.updateProfile.name}`,
      message: 'Updating user profile',
      userId,
      updateFields: Object.keys(dto),
    });

    if (dto.userName) {
      const isDuplicateUserName = await this.userModel.exists({
        userName: dto.userName,
        _id: { $ne: userId },
      });
      if (isDuplicateUserName) {
        log.warn({
          context: `${UserService.name}#${this.updateProfile.name}`,
          message: 'Duplicate username detected',
          userId,
          attemptedUserName: dto.userName,
        });
        throw new BadRequestException('Username already taken');
      }
    }

    try {
      await this.userModel.findByIdAndUpdate(userId, dto);

      log.info({
        context: `${UserService.name}#${this.updateProfile.name}`,
        message: 'User profile updated successfully',
        userId,
      });

      return { success: true, message: 'Profile updated' };
    } catch (error) {
      log.error({
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
}
