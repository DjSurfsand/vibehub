import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import FeedPage from "./pages/FeedPage";
import NewsPage from "./pages/NewsPage";
import CreatePage from "./pages/CreatePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Auth pages (no layout) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />

          {/* ── Public pages (layout) ── */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<FeedPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>

          {/* ── Protected pages (auth required) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/create" element={<CreatePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* ── 404 catch-all ── */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-bg-deep flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h1 className="text-h1 text-neon-magenta">404</h1>
                  <p className="text-body-lg text-text-secondary">
                    Lost in the vibe
                  </p>
                  <a href="/" className="btn-primary inline-block">
                    Back to Feed
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}