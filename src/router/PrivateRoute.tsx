import { Navigate } from "react-router";
import { isAuthenticated } from "../utils/auth";
import { usePermission } from "../permissions/usePermission";

interface Props {
  children: React.ReactNode;
  module?: string;
  action?: "view" | "create" | "edit" | "delete";
}

export default function PrivateRoute({
  children,
  module,
  action = "view",
}: Props) {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const permissions = auth?.user?.role;

  const { can } = usePermission(permissions);

  if (!isAuthenticated()) {
    return <Navigate to="/signin" replace />;
  }

  if (module && !can(module, action)) {
    return <Navigate to="/NotFound" replace />;
  }

  return <>{children}</>;
}
