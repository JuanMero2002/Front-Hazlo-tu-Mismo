// src/hooks/useVoting.ts
import { useState } from 'react';
import apiClient from '../api/axios';

type VotableType = 'App\\Models\\Question' | 'App\\Models\\Answer';

export const useVoting = () => {
  const [loading, setLoading] = useState(false);

  const handleVote = async (votableType: VotableType, votableId: number, value: 1 | -1) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post('/votes', {
        votable_type: votableType,
        votable_id: votableId,
        valor: value,
      });
      return data; // Contiene la acción (created, updated, removed)
    } catch (error) {
      console.error('Error al registrar el voto:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleVote };
};