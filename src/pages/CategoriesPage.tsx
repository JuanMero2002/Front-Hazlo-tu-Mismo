// src/pages/CategoriesPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import apiClient from '../api/axios';
import type { Category } from '../types';

interface CategoryWithStats extends Category {
  questions_count?: number;
}

export const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiClient.get('/public/categories');
        setCategories(response.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Categorías</h1>
          <p className="text-gray-600">Explora las preguntas por categoría</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <Link 
                to={`/search?category=${category.id}`}
                className="block"
              >
                <h3 className="text-lg font-bold text-blue-600 mb-2 hover:underline">
                  {category.nombre}
                </h3>
                {category.descripcion && (
                  <p className="text-gray-600 text-sm mb-3">
                    {category.descripcion}
                  </p>
                )}
                <div className="text-sm text-gray-500">
                  {category.questions_count || 0} preguntas
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {categories.length === 0 && (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500">No hay categorías disponibles</p>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
