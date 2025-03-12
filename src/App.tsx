import React, { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LandingPage from "./components/landing";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-password";
import AuthCallback from "./pages/auth/callback";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { RoleProvider } from "./context/RoleContext";
import { Toaster } from "./components/ui/toaster";
import routes from "tempo-routes";

const TeamPage = React.lazy(() => import("./pages/team"));
const EmailTemplatesPage = React.lazy(
  () => import("./pages/admin/email-templates"),
);
const EmailLogsPage = React.lazy(() => import("./pages/admin/email-logs"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthProvider>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route
              path="/auth/forgot-password"
              element={<ForgotPasswordPage />}
            />
            <Route
              path="/auth/reset-password"
              element={<ResetPasswordPage />}
            />
            <Route path="/auth/set-password" element={<ResetPasswordPage />} />
            <Route
              path="/auth/invitation"
              element={
                <Suspense fallback={<p>Loading...</p>}>
                  {React.createElement(
                    React.lazy(() => import("./pages/auth/invitation")),
                  )}
                </Suspense>
              }
            />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/team" element={<TeamPage />} />
              <Route
                path="/admin/email-templates"
                element={<EmailTemplatesPage />}
              />
              <Route path="/admin/email-logs" element={<EmailLogsPage />} />
            </Route>
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
          <Toaster />
        </RoleProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
