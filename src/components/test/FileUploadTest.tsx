// src/components/test/FileUploadTest.tsx
import React, { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export const FileUploadTest: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    console.log('Archivos seleccionados:', fileArray);
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-4">Test de Subida de Archivos</h2>
      
      {/* Área de drag & drop */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-lg font-medium">
            {dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic'}
          </p>
          <p className="text-sm text-gray-500">
            Soporta múltiples archivos
          </p>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,application/pdf,.txt"
      />

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          📎 Seleccionar Archivos
        </Button>
        {selectedFiles.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAll}
          >
            🗑️ Limpiar Todo
          </Button>
        )}
      </div>

      {/* Lista de archivos seleccionados */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Archivos seleccionados ({selectedFiles.length}):</h3>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {file.type.startsWith('image/') ? '🖼️' : 
                   file.type === 'application/pdf' ? '📄' : 
                   file.type.startsWith('text/') ? '📝' : '📎'}
                </span>
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB - {file.type}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                ❌
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Información de depuración */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug Info:</strong>
        <br />
        Archivos seleccionados: {selectedFiles.length}
        <br />
        Drag activo: {dragActive ? 'Sí' : 'No'}
      </div>
    </Card>
  );
};
