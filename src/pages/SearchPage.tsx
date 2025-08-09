// src/pages/SearchPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionCard } from '../components/common/QuestionCard';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { MainLayout } from '../components/layout/MainLayout';

export const SearchPage: React.FC = () => {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'created_at' | 'votos'>('created_at');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const categories = [
    { id: 'all', name: 'Todas las categorías', icon: '🎯' },
    { id: 'matematicas', name: 'Matemáticas', icon: '🔢' },
    { id: 'ciencias', name: 'Ciencias', icon: '🔬' },
    { id: 'historia', name: 'Historia', icon: '📜' },
    { id: 'literatura', name: 'Literatura', icon: '📖' },
    { id: 'idiomas', name: 'Idiomas', icon: '🗣️' },
    { id: 'tecnologia', name: 'Tecnología', icon: '💻' },
    { id: 'arte', name: 'Arte', icon: '🎨' },
    { id: 'musica', name: 'Música', icon: '🎵' },
    { id: 'deportes', name: 'Deportes', icon: '⚽' }
  ];

  // Obtener tags únicos de todas las preguntas de forma segura
  const allTags = React.useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach(question => {
      if (Array.isArray(question.tags)) {
        question.tags.forEach(tag => tagSet.add(tag.nombre));
      }
    });
    return Array.from(tagSet);
  }, [questions]);

  const handleSearch = () => {
    setHasSearched(true);
  };

  const filteredQuestions = React.useMemo(() => {
    let filtered = questions;

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(q => 
        q.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.contenido.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category?.nombre?.toLowerCase() === selectedCategory);
    }

    // Filtrar por tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(q => {
        if (!Array.isArray(q.tags)) return false;
        return selectedTags.some(tag => q.tags.some(t => t.nombre === tag));
      });
    }

    // Ordenar
    filtered.sort((a, b) => {
      if (sortBy === 'votos') {
        return (b.votos || 0) - (a.votos || 0);
      }
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });

    return filtered;
  }, [questions, searchTerm, selectedCategory, selectedTags, sortBy]);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setSortBy('created_at');
    setHasSearched(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white shadow-2xl">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 flex items-center">
              🔍 Buscar Preguntas
            </h1>
            <p className="text-xl opacity-90 mb-6">
              Encuentra exactamente lo que necesitas en nuestra base de conocimiento
            </p>
            
            {/* Barra de búsqueda principal */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="¿Qué estás buscando? Ej: integrales, guerra mundial, verbos irregulares..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  className="bg-white text-gray-900 border-0 shadow-lg text-lg py-4 pl-12"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<span>🔍</span>}
                />
              </div>
              <Button 
                onClick={handleSearch}
                variant="secondary"
                className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg px-8 py-4"
              >
                Buscar
              </Button>
            </div>
          </div>
          
          {/* Elementos decorativos */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white opacity-5 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de filtros */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">🎛️ Filtros</h2>
                {(selectedCategory !== 'all' || selectedTags.length > 0 || searchTerm) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Limpiar
                  </Button>
                )}
              </div>

              {/* Categorías */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">📚 Categoría</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                        selectedCategory === category.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category.icon}</span>
                      <span className="text-sm">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags populares */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">🏷️ Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map(tag => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-full transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags seleccionados */}
              {selectedTags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-700 mb-3">✅ Tags Seleccionados</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
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
                </div>
              )}

              {/* Ordenar */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">📊 Ordenar por</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSortBy('created_at')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      sortBy === 'created_at'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    📅 Más recientes
                  </button>
                  <button
                    onClick={() => setSortBy('votos')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      sortBy === 'votos'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    👍 Más votadas
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {/* Header de resultados */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {hasSearched || searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
                    ? `Resultados de búsqueda`
                    : 'Todas las preguntas'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {loading ? 'Buscando...' : `${filteredQuestions.length} pregunta${filteredQuestions.length !== 1 ? 's' : ''} encontrada${filteredQuestions.length !== 1 ? 's' : ''}`}
                </p>
              </div>
              
              {!loading && filteredQuestions.length > 0 && (
                <div className="text-sm text-gray-500">
                  Ordenado por: {sortBy === 'created_at' ? 'Fecha' : 'Votos'}
                </div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <div className="text-center">
                  <Spinner size="lg" color="blue" />
                  <p className="mt-4 text-gray-600">Buscando preguntas...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <Card className="bg-red-50 border-red-200">
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">❌</div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar preguntas</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={() => fetchQuestions()} variant="danger">
                    Reintentar
                  </Button>
                </div>
              </Card>
            )}

            {/* Resultados */}
            {!loading && !error && (
              <>
                {filteredQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredQuestions.map(question => (
                      <QuestionCard key={question.id} question={question} />
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-50">
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🤔</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No encontramos resultados
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        {hasSearched || searchTerm
                          ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
                          : 'Aún no hay preguntas en esta categoría'}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={clearFilters} variant="secondary">
                          🔄 Limpiar filtros
                        </Button>
                        <Link to="/ask">
                          <Button variant="primary">
                            ✏️ Hacer la primera pregunta
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>          </div>
        </div>
      </div>
    </MainLayout>
  );
};
