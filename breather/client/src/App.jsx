import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoadingScreen from './components/common/LoadingScreen';

// ── Lazy-loaded Pages ──
const LandingPage        = lazy(() => import('./pages/LandingPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/RegisterPage'));
const ExperiencePage     = lazy(() => import('./pages/ExperiencePage'));
const DashboardPage      = lazy(() => import('./pages/DashboardPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const DigitalGardenPage  = lazy(() => import('./pages/DigitalGardenPage'));
const CreativeStudioPage = lazy(() => import('./pages/CreativeStudioPage'));
const EscapeRoomPage     = lazy(() => import('./pages/EscapeRoomPage'));
const PlayZonePage       = lazy(() => import('./pages/PlayZonePage'));
const SoundscapePage     = lazy(() => import('./pages/SoundscapePage'));
const DreamRoomPage      = lazy(() => import('./pages/DreamRoomPage'));
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'));

// ── Protected Route Guard ──
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ── Public Route (redirect if logged in) ──
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/experiences" element={<ProtectedRoute><ExperiencePage /></ProtectedRoute>} />
        <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Modules */}
        <Route path="/garden"     element={<ProtectedRoute><DigitalGardenPage /></ProtectedRoute>} />
        <Route path="/studio"     element={<ProtectedRoute><CreativeStudioPage /></ProtectedRoute>} />
        <Route path="/escape"     element={<ProtectedRoute><EscapeRoomPage /></ProtectedRoute>} />
        <Route path="/playzone"   element={<ProtectedRoute><PlayZonePage /></ProtectedRoute>} />
        <Route path="/soundscape" element={<ProtectedRoute><SoundscapePage /></ProtectedRoute>} />
        <Route path="/dreamroom"  element={<ProtectedRoute><DreamRoomPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  </AnimatePresence>
);

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
