// src/hooks/useFavorites.ts
import { useState } from 'react';
import apiClient from '../api/axios';

export const useFavorites = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToFavorites = async (questionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('/favorites', { question_id: questionId });
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al añadir a favoritos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (questionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/favorites/${questionId}`);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al quitar de favoritos');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async (questionId: number) => {
    try {
      const response = await apiClient.get(`/favorites/check/${questionId}`);
      return response.data.is_favorite;
    } catch (e: any) {
      return false;
    }
  };

  return {
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    checkIfFavorite
  };
};
