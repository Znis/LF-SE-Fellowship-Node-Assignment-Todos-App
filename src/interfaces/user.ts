export interface Iuser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface getUserByEmailQuery extends Iuser {}
export interface getAssignedPermissionsForRoleQuery {
  permissions: string[];
}
export interface getRoleIdQuery {
  roleId: string;
}
