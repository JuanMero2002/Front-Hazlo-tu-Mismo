// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';
import apiClient from '../api/axios';

export const useFetch = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(url);
        setData(response.data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Ejemplo de uso en un componente:
// const { data: categories, loading } = useFetch<Category[]>('/public/categories');