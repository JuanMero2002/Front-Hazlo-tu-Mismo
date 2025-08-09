// src/pages/FavoritesPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { QuestionCard } from '../components/common/QuestionCard';
import { Spinner } from '../components/ui/Spinner';
import apiClient from '../api/axios';
import type { Favorite } from '../types';

export const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await apiClient.get('/favorites');
      setFavorites(response.data);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al cargar favoritos');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (questionId: number) => {
    try {
      await apiClient.delete(`/favorites/${questionId}`);
      setFavorites(prev => prev.filter(fav => fav.question_id !== questionId));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center">
          <p>Debes iniciar sesión para ver tus favoritos</p>
        </div>
      </MainLayout>
    );
  }

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
          <h1 className="text-3xl font-bold mb-2">Mis Favoritos</h1>
          <p className="text-gray-600">
            {favorites.length} pregunta(s) guardada(s) como favorita(s)
          </p>
        </div>

        {favorites.length > 0 ? (
          <div>
            {favorites.map(favorite => (
              <div key={favorite.id} className="relative">
                {favorite.question && (
                  <>
                    <QuestionCard question={favorite.question} />
                    <button
                      onClick={() => removeFavorite(favorite.question_id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                      title="Eliminar de favoritos"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p className="text-gray-500 mb-4">No tienes preguntas favoritas aún</p>
              <a href="/" className="text-blue-600 hover:underline">
                Explora preguntas para añadir a favoritos
              </a>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};
