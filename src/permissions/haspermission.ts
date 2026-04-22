import { RolePermissions, Action } from "./types";

export const hasPermission = (
  permissions: RolePermissions,
  module: string,
  action: Action = "view",
) => {
  return permissions[module]?.[action] ?? false;
};
