import { Navigate } from "react-router";
import { isAuthenticated } from "../utils/auth";

interface Props {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  return isAuthenticated() ? children : <Navigate to="/signin" replace />;
}
