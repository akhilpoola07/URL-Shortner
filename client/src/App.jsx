import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardPage from './pages/DashboardPage';
import CreateUrlPage from './pages/CreateUrlPage';
import MyLinksPage from './pages/MyLinksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        
        {/* Unauthenticated Only Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Protected Dashboard Shell */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="links" element={<MyLinksPage />} />
          <Route path="create" element={<CreateUrlPage />} />
          <Route path="analytics/:id" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
