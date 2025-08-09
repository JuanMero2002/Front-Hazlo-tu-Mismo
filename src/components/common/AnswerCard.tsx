// src/components/common/AnswerCard.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAnswers } from '../../hooks/useAnswers';
import { useToastContext } from '../../contexts/ToastContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { VoteButtons } from './VoteButtons';
import { ReportButton } from './ReportButton';

interface Answer {
  id: number;
  contenido: string;
  contenido_markdown?: string;
  es_mejor_respuesta?: boolean;
  votos?: number;
  user?: {
    id: number;
    name: string;
  };
}

interface AnswerCardProps {
  answer: Answer;
  questionAuthorId?: number; // ID del autor de la pregunta para permitir marcar como mejor
  questionClosed?: boolean; // Nuevo prop para saber si la pregunta está cerrada
  onAnswerMarkedAsBest?: (answerId: number) => void; // Callback para actualizar el estado padre
}

export const AnswerCard: React.FC<AnswerCardProps> = ({ 
  answer, 
  questionAuthorId,
  questionClosed = false,
  onAnswerMarkedAsBest
}) => {
  const { user } = useAuth();
  const { markAsBest, loading } = useAnswers();
  const { showSuccess, showError } = useToastContext();
  const [isMarkedAsBest, setIsMarkedAsBest] = useState(answer.es_mejor_respuesta || false);

  const handleMarkAsBest = async () => {
    if (!user || user.id !== questionAuthorId) return;
    
    try {
      const result = await markAsBest(answer.id);
      if (result) {
        setIsMarkedAsBest(true);
        showSuccess('Respuesta marcada como la mejor. La pregunta ha sido cerrada.');
        // Notificar al componente padre para actualizar el estado
        if (onAnswerMarkedAsBest) {
          onAnswerMarkedAsBest(answer.id);
        }
      }
    } catch (error: any) {
      // El interceptor ya maneja errores 422
      if (error.response?.status !== 422) {
        showError('Error al marcar como mejor respuesta. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <Card className={`mb-4 ${(isMarkedAsBest || answer.es_mejor_respuesta) ? 'border-green-500 border-2 bg-green-50' : ''}`}>
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <VoteButtons 
            votableType="App\Models\Answer"
            votableId={answer.id}
            initialScore={answer.votos || 0}
          />
        </div>
        
        <div className="flex-grow">
          {(isMarkedAsBest || answer.es_mejor_respuesta) && (
            <div className="mb-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 text-sm rounded font-medium">
                ✓ Mejor Respuesta
              </span>
            </div>
          )}
          
          <div className="prose max-w-none mb-4">
            {answer.contenido_markdown ? (
              <MarkdownRenderer 
                content={answer.contenido_markdown} 
                className="text-gray-700"
              />
            ) : (
              <p className="whitespace-pre-wrap">{answer.contenido}</p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <p>Respondido por <strong>{answer.user?.name || 'Usuario'}</strong></p>
            </div>
            
            <div className="flex space-x-2">
              {/* Solo el autor de la pregunta puede marcar como mejor respuesta */}
              {user && user.id === questionAuthorId && !isMarkedAsBest && !answer.es_mejor_respuesta && !questionClosed && (
                <Button 
                  onClick={handleMarkAsBest}
                  variant="secondary"
                  disabled={loading}
                  className="text-sm hover:bg-green-500 hover:text-white transition-colors"
                >
                  {loading ? 'Marcando...' : '🏆 Marcar como mejor'}
                </Button>
              )}
              
              <ReportButton 
                reportableType="App\Models\Answer"
                reportableId={answer.id}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
