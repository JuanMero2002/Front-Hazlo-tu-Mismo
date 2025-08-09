// src/components/common/VoteButtons.tsx
import React, { useState } from 'react';
import { useVoting } from '../../hooks/useVoting';
import { useToastContext } from '../../contexts/ToastContext';
import { Button } from '../ui/Button';

type VotableType = 'App\\Models\\Question' | 'App\\Models\\Answer';

interface VoteButtonsProps {
  votableType: VotableType;
  votableId: number;
  initialScore: number;
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({ votableType, votableId, initialScore }) => {
  const { handleVote, loading } = useVoting();
  const { showSuccess, showError } = useToastContext();
  const [score, setScore] = useState(initialScore);

  const onVote = async (value: 1 | -1) => {
    try {
      const result = await handleVote(votableType, votableId, value);
      if (result.success) {
        // Actualizar score localmente
        setScore(prev => prev + value);
        showSuccess(`Voto ${value === 1 ? 'positivo' : 'negativo'} registrado correctamente`);
      }
    } catch (error: any) {
      // El interceptor de axios ya maneja los errores 422
      // Aquí solo manejamos otros tipos de errores si es necesario
      if (error.response?.status !== 422) {
        showError('No puedes votar por tu propia publicación.');
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Button 
        onClick={() => onVote(1)} 
        disabled={loading}
        className="hover:bg-green-500 hover:text-white transition-colors"
        size="sm"
      >
        👍 +1
      </Button>
      <span className="font-bold text-lg px-3 py-1 bg-gray-100 rounded-md min-w-[3rem] text-center">
        {score}
      </span>
      <Button 
        onClick={() => onVote(-1)} 
        disabled={loading} 
        variant="secondary"
        className="hover:bg-red-500 hover:text-white transition-colors"
        size="sm"
      >
        👎 -1
      </Button>
    </div>
  );
};