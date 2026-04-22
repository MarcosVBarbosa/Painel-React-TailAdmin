export type Permission = {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
};

export type RolePermissions = Record<string, Permission>;

export type Action = keyof Permission;
