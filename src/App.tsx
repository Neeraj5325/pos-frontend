import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { POS } from './pages/pos/POS';
import { Login } from './pages/login/Login';
import { useAuthStore } from './store/authStore';

import { StoreProfile } from './pages/settings/store-profile/StoreProfile';
import { ProductGroupList } from './pages/settings/masters/product-group/ProductGroupList';
import { ProductGroupForm } from './pages/settings/masters/product-group/ProductGroupForm';
import { CategoryList } from './pages/settings/masters/category/CategoryList';
import { CategoryForm } from './pages/settings/masters/category/CategoryForm';
import { ProductList } from './pages/settings/masters/product/ProductList';
import { ProductForm } from './pages/settings/masters/product/ProductForm';
import { UpdateStock } from './pages/inventory/update-stock/UpdateStock';
import { SupplierList } from './pages/settings/masters/supplier/SupplierList';
import { SupplierForm } from './pages/settings/masters/supplier/SupplierForm';
import { TaxList } from './pages/settings/masters/tax/TaxList';
import { TaxForm } from './pages/settings/masters/tax/TaxForm';
import { UserList } from './pages/settings/user-security/users/UserList';
import { UserForm } from './pages/settings/user-security/users/UserForm';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (token) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<POS />} />
          <Route path="settings/store-profile" element={<StoreProfile />} />

          <Route path="settings/masters/product-group" element={<ProductGroupList />} />
          <Route path="settings/masters/product-group/new" element={<ProductGroupForm />} />
          <Route path="settings/masters/product-group/:id" element={<ProductGroupForm />} />

          <Route path="inventory/update-stock" element={<UpdateStock />} />

          <Route path="settings/masters/category" element={<CategoryList />} />
          <Route path="settings/masters/category/new" element={<CategoryForm />} />
          <Route path="settings/masters/category/:id" element={<CategoryForm />} />

          <Route path="settings/masters/product" element={<ProductList />} />
          <Route path="settings/masters/product/new" element={<ProductForm />} />
          <Route path="settings/masters/product/:id" element={<ProductForm />} />


          <Route path="settings/masters/supplier" element={<SupplierList />} />
          <Route path="settings/masters/supplier/new" element={<SupplierForm />} />
          <Route path="settings/masters/supplier/:id" element={<SupplierForm />} />

          <Route path="settings/masters/tax" element={<TaxList />} />
          <Route path="settings/masters/tax/new" element={<TaxForm />} />
          <Route path="settings/masters/tax/:id" element={<TaxForm />} />

          <Route path="settings/user-security/users" element={<UserList />} />
          <Route path="settings/user-security/users/new" element={<UserForm />} />
          <Route path="settings/user-security/users/:id" element={<UserForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
