// src/pages/CreateQuestionPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../contexts/ToastContext';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MarkdownEditor } from '../components/ui/MarkdownEditor';
import apiClient from '../api/axios';
import type { Category, Tag } from '../types';

export const CreateQuestionPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading } = useQuestions();
  const { user, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToastContext();
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [uploadInfo, setUploadInfo] = useState<any>({
    allowed_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
    max_file_size: 5 * 1024 * 1024, // 5MB
    max_files: 5
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    contenido: '',
    contenido_markdown: '',
    category_id: '',
    tags: [] as number[]
  });

  useEffect(() => {
    // Cargar categorías, etiquetas y información de upload
    const loadData = async () => {
      try {
        setLoadingData(true);
        
        // Cargar categorías y tags (públicos)
        const [categoriesRes, tagsRes] = await Promise.all([
          apiClient.get('/public/categories'),
          apiClient.get('/public/tags')
        ]);
        
        const categoriesData = Array.isArray(categoriesRes.data) ? categoriesRes.data : categoriesRes.data.data || [];
        const tagsData = Array.isArray(tagsRes.data) ? tagsRes.data : tagsRes.data.data || [];
        
        setCategories(categoriesData);
        setTags(tagsData);
        
        // Intentar cargar información de upload (requiere autenticación)
        try {
          const uploadInfoRes = await apiClient.get('/attachments/info');
          setUploadInfo(uploadInfoRes.data);
        } catch (uploadError) {
          console.warn('No se pudo cargar información de upload:', uploadError);
          // Configuración por defecto si no está autenticado
          setUploadInfo({
            allowed_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
            max_file_size: 5 * 1024 * 1024, // 5MB
            max_files: 5
          });
        }
        
      } catch (error) {
        console.error('Error cargando datos:', error);
        setCategories([]);
        setTags([]);
        // Configuración por defecto para upload
        setUploadInfo({
          allowed_types: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'],
          max_file_size: 5 * 1024 * 1024, // 5MB
          max_files: 5
        });
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagToggle = (tagId: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    // Validar archivos
    const validFiles = fileArray.filter(file => {
      if (uploadInfo) {
        const isValidType = uploadInfo.allowed_types?.includes(file.type) || file.type.startsWith('image/');
        const isValidSize = file.size <= (uploadInfo.max_file_size || 5 * 1024 * 1024);
        
        if (!isValidType) {
          showError(`Archivo ${file.name}: Tipo no permitido. Tipos permitidos: imágenes, PDF, texto`);
          return false;
        }
        
        if (!isValidSize) {
          const maxSizeMB = Math.round((uploadInfo.max_file_size || 5 * 1024 * 1024) / 1024 / 1024);
          showError(`Archivo ${file.name}: Tamaño máximo ${maxSizeMB}MB`);
          return false;
        }
      }
      return true;
    });

    // Verificar límite total de archivos
    const maxFiles = uploadInfo?.max_files || 5;
    if (attachments.length + validFiles.length > maxFiles) {
      showError(`Máximo ${maxFiles} archivos permitidos`);
      return;
    }

    if (validFiles.length > 0) {
      setAttachments(prev => [...prev, ...validFiles]);
      showSuccess(`${validFiles.length} archivo(s) agregado(s) exitosamente`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const insertMarkdownImage = (imageName: string) => {
    const markdownImage = `![${imageName}](imagen:${imageName})`;
    setFormData(prev => ({
      ...prev,
      contenido_markdown: prev.contenido_markdown + '\n' + markdownImage
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo.trim() || (!formData.contenido.trim() && !formData.contenido_markdown.trim())) {
      showError('Por favor completa el título y contenido del post');
      return;
    }

    if (!formData.category_id) {
      showError('Por favor selecciona una categoría');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('contenido', formData.contenido_markdown || formData.contenido);
      if (formData.contenido_markdown) {
        formDataToSend.append('contenido_markdown', formData.contenido_markdown);
      }
      formDataToSend.append('category_id', formData.category_id);
      formData.tags.forEach(tagId => {
        formDataToSend.append('tags[]', tagId.toString());
      });

      // Agregar archivos adjuntos
      attachments.forEach(file => {
        formDataToSend.append('attachments[]', file);
      });

      const response = await apiClient.post('/questions', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess('Post creado exitosamente');
      navigate(`/questions/${response.data.id}`);
    } catch (error: any) {
      console.error('Error creating question:', error);
      // El interceptor maneja errores 422 automáticamente
      if (error.response?.status !== 422) {
        showError('Error al crear el post. Inténtalo de nuevo.');
      }
    }
  };

  if (authLoading || loadingData) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando datos...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Iniciar Sesión Requerido</h2>
              <p className="text-gray-600 mb-6">Necesitas iniciar sesión para crear un post.</p>
              <div className="space-x-4">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                >
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (loadingData) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Cargando datos...</p>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Crear Nuevo Post</h1>
          <p className="text-gray-600">Comparte tu conocimiento con la comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <Card>
            <div className="space-y-4">
              <div>
                <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Post *
                </label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe un título claro y descriptivo..."
                  required
                />
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Contenido con Markdown */}
          <Card>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Contenido del Post *
              </label>

              <MarkdownEditor
                value={formData.contenido_markdown}
                onChange={(value) => setFormData(prev => ({ ...prev, contenido_markdown: value }))}
                placeholder="Escribe tu post usando Markdown...

Ejemplos:
**negrita** o *cursiva*
`código` o ```bloque de código```
[enlace](URL)
- lista
> cita

¡Puedes agregar imágenes usando los archivos adjuntos!"
                rows={12}
              />

              {/* Fallback para contenido simple */}
              {!formData.contenido_markdown && (
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    O escribe contenido simple:
                  </label>
                  <textarea
                    name="contenido"
                    value={formData.contenido}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                    placeholder="Contenido sin formato..."
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Archivos Adjuntos */}
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-gray-700">
                  Archivos Adjuntos {uploadInfo && `(máx. ${uploadInfo.max_files} archivos)`}
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📎 Agregar Archivos
                </Button>
              </div>

              {/* Área de drag & drop */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="space-y-2">
                  <div className="text-3xl">
                    {dragActive ? '📂' : '📁'}
                  </div>
                  <p className="text-base font-medium">
                    {dragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos aquí o haz clic para seleccionar'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Soporta imágenes, PDF y archivos de texto
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={uploadInfo?.allowed_types?.join(',') || 'image/*,.pdf,.txt'}
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadInfo && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Tipos permitidos: {uploadInfo.allowed_types?.join(', ') || 'imágenes, PDF, texto'} | 
                  Tamaño máximo: {Math.round((uploadInfo.max_file_size || 5 * 1024 * 1024) / 1024 / 1024)}MB por archivo
                </div>
              )}

              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Archivos seleccionados ({attachments.length}/{uploadInfo?.max_files || 5}):
                  </h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">
                          {file.type.startsWith('image/') ? '🖼️' : 
                           file.type === 'application/pdf' ? '📄' : 
                           file.type.startsWith('text/') ? '📝' : '📎'}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB - {file.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {file.type.startsWith('image/') && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => insertMarkdownImage(file.name)}
                          >
                            📝 Insertar
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          ❌
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Tags */}
          <Card>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Etiquetas
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag.id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.nombre}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Botones de acción */}
          <Card>
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                icon={loading ? <span>⏳</span> : <span>📝</span>}
              >
                {loading ? 'Creando Post...' : 'Crear Post'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </MainLayout>
  );
};
