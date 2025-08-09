// src/components/common/FavoriteButton.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../hooks/useFavorites';
import { Button } from '../ui/Button';

interface FavoriteButtonProps {
  questionId: number;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ questionId }) => {
  const { user } = useAuth();
  const { addToFavorites, removeFromFavorites, checkIfFavorite, loading } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user) {
      const checkStatus = async () => {
        const status = await checkIfFavorite(questionId);
        setIsFavorite(status);
      };
      checkStatus();
    }
  }, [user, questionId, checkIfFavorite]);

  const handleToggleFavorite = async () => {
    if (!user) return;

    const success = isFavorite 
      ? await removeFromFavorites(questionId)
      : await addToFavorites(questionId);

    if (success) {
      setIsFavorite(!isFavorite);
    }
  };

  if (!user) return null;

  return (
    <Button
      variant="secondary"
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`text-sm ${isFavorite ? 'text-red-600 hover:text-red-800' : 'text-gray-600'}`}
    >
      {loading ? (
        'Cargando...'
      ) : (
        <>
          <svg className="w-4 h-4 inline mr-1" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        </>
      )}
    </Button>
  );
};
