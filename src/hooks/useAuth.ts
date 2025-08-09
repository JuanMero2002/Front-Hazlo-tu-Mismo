// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import type { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const response = await apiClient.get('/auth/me');
      setUser(response.data.user);
    } catch (e: any) {
      console.error('Error al verificar usuario:', e.response?.status);
      
      // Solo eliminar token si es realmente un error de autenticación
      if (e.response?.status === 401 || e.response?.status === 403) {
        localStorage.removeItem('authToken');
        setUser(null);
      } else {
        // Para otros errores (500, red, etc.), mantener el estado pero no hacer nada
        console.log('Error temporal de red, manteniendo estado actual');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      return true;
    } catch (e: any) {
      setError(e.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      setUser(user);
      return true;
    } catch (e: any) {
      // Manejar errores de validación del backend
      if (e.response?.data?.errors) {
        const backendErrors = e.response.data.errors;
        const errorMessages = Object.values(backendErrors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(e.response?.data?.message || 'Error al registrarse');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error("Error en el logout del backend, pero se procederá con el logout local.");
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  return { user, loading, error, login, register, logout };
};