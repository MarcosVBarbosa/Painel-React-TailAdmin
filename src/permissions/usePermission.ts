import { RolePermissions, Action } from "./types";

export const usePermission = (permissions?: RolePermissions) => {
  const can = (module?: string, action: Action = "view") => {
    // 🔥 se não tiver módulo, libera
    if (!module) return true;

    // 🔥 proteção extra
    if (!permissions) return false;

    return permissions[module]?.[action] ?? false;
  };

  return { can };
};
