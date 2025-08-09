// src/config/api.ts
export const API_CONFIG = {
  // URL base del backend (sin /api)
  BASE_URL: 'https://localhost:8443',
  
  // URL de la API (con /api)
  API_URL: 'https://localhost:8443/api',
  
  // Endpoints específicos
  ENDPOINTS: {
    STORAGE: '/storage',
    UPLOADS: '/uploads',
    API_FILES: '/api/files',
    API_ATTACHMENTS: '/api/attachments'
  }
} as const;

// Función helper para construir URLs de archivos
export const buildFileUrl = (filePath: string, baseUrl: string = API_CONFIG.BASE_URL): string => {
  return `${baseUrl}/storage/${filePath}`;
};

// Función helper para construir URLs de attachments
export const buildAttachmentUrl = (attachmentId: number, baseUrl: string = API_CONFIG.BASE_URL): string => {
  return `${baseUrl}/api/attachments/${attachmentId}/download`;
};
