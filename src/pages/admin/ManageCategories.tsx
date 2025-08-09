// src/pages/admin/ManageCategories.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../api/axios';
import type { Category } from '../../types';

export const ManageCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/admin/categories');
      setCategories(response.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Actualizar categoría existente
        const response = await apiClient.put(`/admin/categories/${editingCategory.id}`, formData);
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id ? response.data : cat
        ));
      } else {
        // Crear nueva categoría
        const response = await apiClient.post('/admin/categories', formData);
        setCategories(prev => [...prev, response.data]);
      }
      
      // Resetear formulario
      setFormData({ nombre: '', descripcion: '' });
      setIsCreating(false);
      setEditingCategory(null);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al guardar categoría');
    }
  };

  const deleteCategory = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;
    
    try {
      await apiClient.delete(`/admin/categories/${categoryId}`);
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar categoría');
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || ''
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingCategory(null);
    setFormData({ nombre: '', descripcion: '' });
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
        <h2 className="text-2xl font-bold">Gestión de Categorías</h2>
        
        {!isCreating && (
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            Nueva Categoría
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
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
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

            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                {editingCategory ? 'Actualizar' : 'Crear'}
              </Button>
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Lista de categorías */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Descripción</th>
                <th className="text-left py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{category.id}</td>
                  <td className="py-3 px-4 font-medium">{category.nombre}</td>
                  <td className="py-3 px-4">{category.descripcion || 'Sin descripción'}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="secondary"
                        onClick={() => startEdit(category)}
                        className="text-sm"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay categorías creadas</p>
          </div>
        )}
      </Card>
    </div>
  );
};
