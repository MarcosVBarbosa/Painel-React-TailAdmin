import { Navigate } from "react-router";
import { isAuthenticated } from "../utils/auth";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
}
