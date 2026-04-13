import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Home from "./pages/Dashboard/Home";
import Users from "./pages/Dashboard/Users";
import NotFound from "./pages/OtherPage/NotFound";

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import PermissionsUsers from "./pages/Dashboard/RolesUsers";
import Notifications from "./pages/Dashboard/Notifications";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* 🔓 ROTAS PÚBLICAS */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        {/* 🔐 ROTAS PROTEGIDAS */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/permissionsusers" element={<PermissionsUsers />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* ❌ NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
