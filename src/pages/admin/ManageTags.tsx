// src/pages/admin/ManageTags.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../api/axios';
import type { Tag } from '../../types';

export const ManageTags: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    nombre: ''
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await apiClient.get('/admin/tags');
      setTags(response.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingTag) {
        // Actualizar etiqueta existente
        const response = await apiClient.put(`/admin/tags/${editingTag.id}`, formData);
        setTags(prev => prev.map(tag => 
          tag.id === editingTag.id ? response.data : tag
        ));
      } else {
        // Crear nueva etiqueta
        const response = await apiClient.post('/admin/tags', formData);
        setTags(prev => [...prev, response.data]);
      }
      
      // Resetear formulario
      setFormData({ nombre: '' });
      setIsCreating(false);
      setEditingTag(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar etiqueta');
    }
  };

  const deleteTag = async (tagId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) return;
    
    try {
      await apiClient.delete(`/admin/tags/${tagId}`);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar etiqueta');
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      nombre: tag.nombre
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingTag(null);
    setFormData({ nombre: '' });
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
        <h2 className="text-2xl font-bold">Gestión de Etiquetas</h2>
        
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            Nueva Etiqueta
          </Button>
        )}
      </div>

      {error && (
        <Card className="mb-4">
          <p className="text-red-500 text-center">{error}</p>
        </Card>
      )}

      {/* Formulario para crear/editar */}
      {isCreating && (
        <Card className="mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                id="nombre"
                required
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                {editingTag ? 'Actualizar' : 'Crear'}
              </Button>
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de etiquetas */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map(tag => (
            <div key={tag.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{tag.nombre}</h4>
                  <p className="text-sm text-gray-500">ID: {tag.id}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    onClick={() => startEdit(tag)}
                    className="text-xs px-2 py-1"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => deleteTag(tag.id)}
                    className="text-red-600 hover:text-red-800 text-xs px-2 py-1"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tags.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay etiquetas creadas</p>
          </div>
        )}
      </Card>
    </div>
  );
};
