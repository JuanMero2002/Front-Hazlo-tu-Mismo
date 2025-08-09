// src/components/common/AttachmentsList.tsx
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { API_CONFIG, buildFileUrl } from '../../config/api';

interface Attachment {
  id: number;
  question_id?: number;
  original_name: string;
  file_name: string;
  file_path: string;
  mime_type?: string;
  file_size: number;
  file_type?: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

interface AttachmentsListProps {
  attachments: Attachment[];
  className?: string;
}

// Componente para manejar imágenes con fallback
const AttachmentImage: React.FC<{ attachment: Attachment; onClick: () => void }> = ({ attachment, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
  
  const possibleUrls = [
    buildFileUrl(attachment.file_path),
    `${API_CONFIG.BASE_URL}/${attachment.file_path}`,
    `${API_CONFIG.BASE_URL}/api/files/${attachment.file_name}`,
    `${API_CONFIG.BASE_URL}/uploads/${attachment.file_name}`
  ];

  const handleImageError = () => {
    console.log(`Error cargando imagen desde: ${possibleUrls[currentUrlIndex]}`);
    if (currentUrlIndex < possibleUrls.length - 1) {
      setCurrentUrlIndex(currentUrlIndex + 1);
      console.log(`Intentando con: ${possibleUrls[currentUrlIndex + 1]}`);
    } else {
      setImageError(true);
      console.log('Todas las URLs fallaron para:', attachment.original_name);
    }
  };

  if (imageError) {
    return (
      <div 
        className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
        onClick={onClick}
      >
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="text-sm">Error cargando imagen</div>
          <div className="text-xs mt-1">{attachment.original_name}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={possibleUrls[currentUrlIndex]}
      alt={attachment.original_name}
      className="w-full h-48 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
      onError={handleImageError}
    />
  );
};

interface AttachmentsListProps {
  attachments: Attachment[];
  className?: string;
}

export const AttachmentsList: React.FC<AttachmentsListProps> = ({ attachments, className = '' }) => {
  // Debug: log attachments para ver qué datos llegan
  React.useEffect(() => {
    console.log('AttachmentsList - Datos recibidos:', attachments);
  }, [attachments]);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getFileIcon = (mimeType: string | undefined) => {
    if (!mimeType) return '📎'; // Fallback si no hay tipo MIME
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.startsWith('text/')) return '📝';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.startsWith('video/')) return '🎥';
    return '📎';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAttachmentUrl = (attachment: Attachment): string => {
    // Si tiene URL personalizada, usarla
    if (attachment.url) return attachment.url;
    
    // Usar la función helper para construir la URL
    const primaryUrl = buildFileUrl(attachment.file_path);
    console.log('getAttachmentUrl - archivo:', attachment.original_name, 'URL:', primaryUrl);
    return primaryUrl;
  };

  const downloadFile = (attachment: Attachment) => {
    const url = getAttachmentUrl(attachment);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.original_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
        📎 Archivos Adjuntos ({attachments.length})
      </h4>
      
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {getFileIcon(attachment.mime_type)}
              </span>
              <div>
                <div className="font-medium text-gray-900">
                  {attachment.original_name}
                </div>
                <div className="text-sm text-gray-500">
                  {formatFileSize(attachment.file_size)} • {attachment.mime_type || 'Tipo desconocido'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {attachment.mime_type?.startsWith('image/') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = getAttachmentUrl(attachment);
                    window.open(url, '_blank');
                  }}
                >
                  👁️ Ver
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadFile(attachment)}
              >
                ⬇️ Descargar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Galería de imágenes */}
      {attachments.some(att => att.mime_type?.startsWith('image/')) && (
        <div className="mt-4">
          <h5 className="text-md font-medium text-gray-800 mb-3">Imágenes:</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {attachments
              .filter(att => att.mime_type?.startsWith('image/'))
              .map((attachment) => (
                <div key={attachment.id} className="relative group">
                  <AttachmentImage
                    attachment={attachment}
                    onClick={() => {
                      const url = getAttachmentUrl(attachment);
                      window.open(url, '_blank');
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {attachment.original_name}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
