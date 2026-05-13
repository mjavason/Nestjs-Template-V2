export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum UserAuthMethodEnum {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  APPLE = 'apple',
  PHONE = 'phone',
}

export enum UserKycStatusEnum {
  NULL = 'null',
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
}

export enum UserTypeEnum {
  USER = 'user',
  ADMIN = 'admin',
  SUPER = 'super',
}
