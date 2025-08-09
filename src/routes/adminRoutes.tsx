// src/routes/adminRoutes.tsx
import { Route } from 'react-router-dom';

// Componentes
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Páginas de admin
import { AdminDashboard } from '../pages/admin/AdminDashboard';

export const adminRoutes = [
  <Route 
    key="admin" 
    path="/admin/*" 
    element={
      <ProtectedRoute roles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    } 
  />,
];
