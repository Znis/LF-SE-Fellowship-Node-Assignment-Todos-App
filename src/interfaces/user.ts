export interface Iuser {
  id?: string;
  name: string;
  email: string;
  password: string;
}

export interface getUserByEmailQuery extends Iuser {}

export interface createUserQuery extends Iuser {}

export interface assignRoleQuery {
  userId: string;
  roleId: string;
}
export interface getAssignedPermissionsForRoleQuery {
  permissions: string[];
}
export interface getRoleIdQuery {
  roleId: string;
}
