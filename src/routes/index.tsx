// src/routes/index.tsx
import { Routes } from 'react-router-dom';

// Rutas organizadas por módulos
import { publicRoutes } from './publicRoutes';
import { protectedRoutes } from './protectedRoutes';
import { adminRoutes } from './adminRoutes';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      {publicRoutes}
      
      {/* Rutas protegidas (requieren autenticación) */}
      {protectedRoutes}
      
      {/* Rutas de administrador */}
      {adminRoutes}
    </Routes>
  );
};
