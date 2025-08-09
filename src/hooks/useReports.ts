// src/hooks/useReports.ts
import { useState } from 'react';
import apiClient from '../api/axios';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportContent = async (data: {
    reportable_type: string;
    reportable_id: number;
    motivo: string;
    descripcion?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/reports', data);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al enviar reporte');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    reportContent
  };
};
