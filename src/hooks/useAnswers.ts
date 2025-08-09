// src/hooks/useAnswers.ts
import { useState } from 'react';
import apiClient from '../api/axios';

export const useAnswers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAnswer = async (answerData: { 
    contenido: string; 
    contenido_markdown?: string;
    question_id: number 
  }) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/answers', answerData);
      return response.data;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al enviar la respuesta');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const markAsBest = async (answerId: number) => {
    setLoading(true);
    try {
      await apiClient.post(`/answers/${answerId}/mark-as-best`);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al marcar la respuesta');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Aquí irían updateAnswer y deleteAnswer

  return { loading, error, createAnswer, markAsBest };
};