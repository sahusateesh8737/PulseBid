import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';
import { AppLayout } from '../components/layout/AppLayout';

import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

import { DashboardOverviewPage } from '../pages/DashboardOverviewPage';
import { AuctionListPage } from '../pages/AuctionListPage';
import { AuctionRoomPage } from '../pages/AuctionRoomPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { MyBidsPage } from '../pages/MyBidsPage';
import { MyWinsPage } from '../pages/MyWinsPage';
import { ProfilePage } from '../pages/ProfilePage';

import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { CreateAuctionPage } from '../pages/CreateAuctionPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { TenantSettingsPage } from '../pages/TenantSettingsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />

      {/* Authenticated Routes wrapped in AppLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardOverviewPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auctions"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AuctionListPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/auctions/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AuctionRoomPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <AppLayout>
              <InventoryPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory/:id"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProductDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bids"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyBidsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-wins"
        element={
          <ProtectedRoute>
            <AppLayout>
              <MyWinsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/auctions"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/create"
        element={
          <AdminRoute>
            <AppLayout>
              <CreateAuctionPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AppLayout>
              <AdminUsersPage />
            </AppLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TenantSettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
