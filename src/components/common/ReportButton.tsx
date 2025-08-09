// src/components/common/ReportButton.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useReports } from '../../hooks/useReports';
import { useToastContext } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ReportButtonProps {
  reportableType: string;
  reportableId: number;
}

export const ReportButton: React.FC<ReportButtonProps> = ({ 
  reportableType, 
  reportableId 
}) => {
  const { user } = useAuth();
  const { reportContent, loading } = useReports();
  const { showSuccess, showError } = useToastContext();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    motivo: '',
    descripcion: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await reportContent({
        reportable_type: reportableType,
        reportable_id: reportableId,
        motivo: formData.motivo,
        descripcion: formData.descripcion || undefined
      });

      if (success) {
        setShowModal(false);
        setFormData({ motivo: '', descripcion: '' });
        showSuccess('Reporte enviado correctamente. Será revisado por los moderadores.');
      }
    } catch (error: any) {
      // El interceptor ya maneja errores 422
      if (error.response?.status !== 422) {
        showError('Error al enviar el reporte. Inténtalo de nuevo.');
      }
    }
  };

  if (!user) return null;

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => setShowModal(true)}
        className="text-red-600 hover:text-red-800 text-sm"
      >
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        Reportar
      </Button>

      {/* Modal de reporte */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <Card>
              <h3 className="text-lg font-bold mb-4">Reportar Contenido</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo del reporte *
                  </label>
                  <select
                    id="motivo"
                    required
                    value={formData.motivo}
                    onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="spam">Spam</option>
                    <option value="contenido_ofensivo">Contenido ofensivo</option>
                    <option value="informacion_incorrecta">Información incorrecta</option>
                    <option value="contenido_inapropiado">Contenido inapropiado</option>
                    <option value="violacion_reglas">Violación de reglas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción adicional
                  </label>
                  <textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Explica con más detalle el problema..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={loading}
                  >
                    {loading ? 'Enviando...' : 'Enviar Reporte'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};
