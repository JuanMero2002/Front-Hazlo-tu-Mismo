// src/pages/admin/ManageReports.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../api/axios';
import type { Report } from '../../types';

export const ManageReports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('pendiente');

  useEffect(() => {
    fetchReports();
  }, [filterStatus]);

  const fetchReports = async () => {
    try {
      const params = filterStatus ? { estado: filterStatus } : {};
      const response = await apiClient.get('/admin/reports', { params });
      setReports(response.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: number, newStatus: string) => {
    try {
      await apiClient.put(`/admin/reports/${reportId}`, { estado: newStatus });
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, estado: newStatus as any } : report
      ));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al actualizar reporte');
    }
  };

  const deleteReport = async (reportId: number) => {
    if (!confirm('¿Estás seguro de eliminar este reporte?')) return;
    
    try {
      await apiClient.delete(`/admin/reports/${reportId}`);
      setReports(prev => prev.filter(report => report.id !== reportId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar reporte');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'revisado': return 'bg-green-100 text-green-800';
      case 'descartado': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Reportes</h2>
        
        <div className="flex space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="revisado">Revisados</option>
            <option value="descartado">Descartados</option>
          </select>
        </div>
      </div>

      {error && (
        <Card className="mb-4">
          <p className="text-red-500 text-center">{error}</p>
        </Card>
      )}

      <div className="space-y-4">
        {reports.map(report => (
          <Card key={report.id}>
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(report.estado)}`}>
                    {report.estado.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Reportado por {report.user.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="font-bold mb-2">Motivo: {report.motivo}</h4>
                {report.descripcion && (
                  <p className="text-gray-700 mb-3">{report.descripcion}</p>
                )}
                
                <div className="text-sm text-gray-500">
                  <p>Contenido reportado: {report.reportable_type} (ID: {report.reportable_id})</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                {report.estado === 'pendiente' && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => updateReportStatus(report.id, 'revisado')}
                      className="text-sm"
                    >
                      Marcar como Revisado
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => updateReportStatus(report.id, 'descartado')}
                      className="text-sm"
                    >
                      Descartar
                    </Button>
                  </>
                )}
                
                <Button
                  variant="secondary"
                  onClick={() => deleteReport(report.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {filterStatus 
                ? `No hay reportes con estado "${filterStatus}"`
                : 'No hay reportes registrados'
              }
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
