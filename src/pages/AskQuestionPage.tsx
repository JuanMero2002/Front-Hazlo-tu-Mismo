// src/pages/AskQuestionPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import apiClient from '../api/axios';

interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
}

export const AskQuestionPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim()) && tags.length < 5) {
        setTags([...tags, currentTag.trim()]);
        setCurrentTag('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (title.trim().length < 10) {
      newErrors.title = 'El título debe tener al menos 10 caracteres';
    } else if (title.trim().length > 255) {
      newErrors.title = 'El título no puede exceder 255 caracteres';
    }
    
    if (!content.trim()) {
      newErrors.content = 'El contenido es requerido';
    } else if (content.trim().length < 30) {
      newErrors.content = 'El contenido debe tener al menos 30 caracteres';
    }
    
    if (!selectedCategory) {
      newErrors.category = 'Selecciona una categoría';
    }
    
    if (tags.length === 0) {
      newErrors.tags = 'Agrega al menos un tag';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const questionData = {
        titulo: title.trim(),
        contenido: content.trim(),
        category_id: selectedCategory,
        tags: tags
      };
      
      const response = await apiClient.post('/questions', questionData);
      
      // Redirigir a la pregunta creada
      navigate(`/questions/${response.data.id}`);
    } catch (error: any) {
      setErrors({
        general: error.response?.data?.message || 'Error al crear la pregunta. Inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'matematicas': return '🔢';
      case 'ciencias': return '🔬';
      case 'historia': return '📜';
      case 'literatura': return '📖';
      case 'idiomas': return '🗣️';
      case 'tecnologia': return '💻';
      case 'arte': return '🎨';
      case 'musica': return '🎵';
      case 'deportes': return '⚽';
      default: return '📚';
    }
  };

  if (!user) {
    return null; // El useEffect ya redirige al login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mb-4">
            <span className="text-white text-2xl">✏️</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hacer una Pregunta
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comparte tu duda con la comunidad y obtén respuestas de otros estudiantes. 
            Sé específico y proporciona toda la información necesaria.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-2">⚠️</span>
                      <p className="text-red-700 text-sm">{errors.general}</p>
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <Input
                    label="Título de tu pregunta"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: ¿Cómo resolver una ecuación cuadrática?"
                    error={errors.title}
                    required
                    fullWidth
                    icon={<span>📝</span>}
                    disabled={isLoading}
                    helperText={`${title.length}/255 caracteres`}
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detalla tu pregunta *
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Explica tu pregunta en detalle. Incluye lo que has intentado, qué no entiendes, y cualquier información relevante..."
                    rows={8}
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      errors.content 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                  <div className="flex justify-between mt-1">
                    {errors.content && (
                      <p className="text-sm text-red-600">{errors.content}</p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {content.length} caracteres
                    </p>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Categoría *
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner size="sm" />
                      <span className="ml-2 text-gray-500">Cargando categorías...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(category => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => setSelectedCategory(category.id)}
                          className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                            selectedCategory === category.id
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          disabled={isLoading}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getCategoryIcon(category.nombre)}</span>
                            <span className="font-medium text-sm">{category.nombre}</span>
                          </div>
                          {category.descripcion && (
                            <p className="text-xs text-gray-500 mt-1">{category.descripcion}</p>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600">{errors.category}</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags *
                  </label>
                  <Input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Escribe un tag y presiona Enter (máximo 5)"
                    disabled={isLoading || tags.length >= 5}
                    icon={<span>🏷️</span>}
                    helperText="Presiona Enter para agregar cada tag"
                  />
                  
                  {/* Tags display */}
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <Badge
                          key={tag}
                          variant="primary"
                          removable
                          onRemove={() => removeTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {errors.tags && (
                    <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="flex-1 py-3 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Spinner size="sm" color="white" className="mr-2" />
                        Publicando pregunta...
                      </div>
                    ) : (
                      '🚀 Publicar Pregunta'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/')}
                    disabled={isLoading}
                    className="px-6"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Sidebar with tips */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              {/* Tips */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Consejos para una buena pregunta
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5">✓</span>
                    Usa un título claro y específico
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5">✓</span>
                    Explica el contexto de tu problema
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5">✓</span>
                    Menciona qué has intentado hacer
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5">✓</span>
                    Incluye ejemplos si es posible
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 mt-0.5">✓</span>
                    Usa tags relevantes para tu tema
                  </li>
                </ul>
              </Card>

              {/* Preview */}
              <Card>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">👀</span>
                  Vista previa
                </h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="font-medium">Título:</span>
                    <p className="text-gray-600 mt-1">
                      {title || 'Tu título aparecerá aquí...'}
                    </p>
                  </div>
                  
                  {selectedCategory && (
                    <div>
                      <span className="font-medium">Categoría:</span>
                      <div className="mt-1">
                        <Badge variant="secondary" size="sm">
                          {categories.find(c => c.id === selectedCategory)?.nombre}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  {tags.length > 0 && (
                    <div>
                      <span className="font-medium">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tags.map(tag => (
                          <Badge key={tag} variant="primary" size="sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* User info */}
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">👤</span>
                  Tu perfil
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {user.reputacion} puntos de reputación
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
