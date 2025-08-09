// src/hooks/useQuestions.ts
import { useState, useCallback } from 'react';
import apiClient from '../api/axios';
import type { Question } from '../types';

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async (filters: any = {}) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/public/questions', { params: filters });
      setQuestions(data.data); // Asumiendo paginación de Laravel
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuestionById = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/public/questions/${id}`);
      setQuestion(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createQuestion = useCallback(async (questionData: { titulo: string; contenido: string; category_id: number; tags: number[] }) => {
    setLoading(true);
    try {
      const { data } = await apiClient.post('/questions', questionData);
      // Podrías redirigir al usuario o actualizar la lista de preguntas
      return data.question;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al crear la pregunta');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aquí podrías añadir updateQuestion, deleteQuestion, addToFavorites, etc.

  return { questions, question, loading, error, fetchQuestions, fetchQuestionById, createQuestion };
};