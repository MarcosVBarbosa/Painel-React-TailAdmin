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
        {/* 🔓 PUBLIC */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        {/* 🔐 LAYOUT PROTEGIDO (apenas login) */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          {/* 🔥 AGORA CADA ROTA TEM PERMISSÃO */}

          <Route
            path="/"
            element={
              <PrivateRoute module="dashboard">
                <Home />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute module="users">
                <Users />
              </PrivateRoute>
            }
          />

          <Route
            path="/permissionsusers"
            element={
              <PrivateRoute module="permissionsusers">
                <PermissionsUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute module="Notifications">
                <Notifications />
              </PrivateRoute>
            }
          />
        </Route>

        {/* ❌ NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
