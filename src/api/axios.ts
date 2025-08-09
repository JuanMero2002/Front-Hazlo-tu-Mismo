// src/api/axios.ts
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const apiClient = axios.create({
  baseURL: API_CONFIG.API_URL, // Usar la configuración centralizada
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para añadir el token JWT a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('Error de API:', error.response?.status, error.response?.data);
    
    // Manejar errores 422 (validación) globalmente
    if (error.response?.status === 422) {
      const message = error.response?.data?.message || 'Error de validación';
      
      // Emitir evento personalizado para mostrar toast
      const toastEvent = new CustomEvent('show-toast', {
        detail: { message, type: 'error' }
      });
      window.dispatchEvent(toastEvent);
    }
    
    // Solo redirigir al login en casos específicos de autenticación
    if (error.response?.status === 401 && error.response?.data?.message?.includes('Unauthenticated')) {
      console.log('Usuario no autenticado, token inválido');
      localStorage.removeItem('authToken');
      // Solo redirigir si estamos en una página protegida
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;