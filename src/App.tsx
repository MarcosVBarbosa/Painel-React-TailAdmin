import { BrowserRouter as Router, Routes, Route } from "react-router";

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";

import Home from "./pages/Dashboard/Home";
import Users from "./pages/Dashboard/users";
import NotFound from "./pages/OtherPage/NotFound";

import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
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
        </Route>

        {/* 🔓 ROTAS PÚBLICAS */}
        <Route
          path="/signin"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />

        {/* ❌ NOT FOUND */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
