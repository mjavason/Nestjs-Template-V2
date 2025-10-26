export enum USER_PERMISSIONS {
  REGISTER_USER = 'user:register_user',
  VIEW_USER = 'user:view_user',
  EDIT_USER = 'user:edit_user',
  DELETE_USER = 'user:delete_user',
  ASSIGN_ROLE = 'user:assign_role',
  ASSIGN_PERMISSIONS = 'user:assign_permissions',
  YOU_NO_GO_PASS = 'user:you_no_go_pass',
}

export enum ADMIN_PERMISSIONS {
  VIEW_IDENTITY_DOCUMENTS = 'admin:view_identity_documents',
  UPDATE_SYSTEM_SETTINGS = 'admin:update_system_settings',
}
