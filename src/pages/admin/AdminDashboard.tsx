// src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { AdminStats } from './AdminStats';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || user.rol !== 'admin') {
    return (
      <MainLayout>
        <div className="text-center">
          <Card>
            <p className="text-red-500">No tienes permisos para acceder a esta página</p>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Estadísticas y métricas del sistema</p>
        </div>

        {/* Mensaje informativo sobre funcionalidades en desarrollo */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <div className="text-blue-800">
            <h2 className="font-semibold mb-2">🚧 Funcionalidades en Desarrollo</h2>
            <p className="text-sm">
              Actualmente solo están disponibles las estadísticas del sistema. 
              Las funciones de gestión de usuarios, categorías, etiquetas y reportes 
              estarán disponibles próximamente cuando se implementen las rutas correspondientes en el backend.
            </p>
          </div>
        </Card>

        {/* Estadísticas del Admin */}
        <AdminStats />
      </div>
    </MainLayout>
  );
};
