// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAuth } from '../hooks/useAuth';
import { QuestionCard } from '../components/common/QuestionCard';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MainLayout } from '../components/layout/MainLayout';

export const HomePage: React.FC = () => {
  const { questions, loading, error, fetchQuestions } = useQuestions();
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('recent');

  useEffect(() => {
    const sortOptions = {
      recent: { sort: 'created_at', direction: 'desc' },
      popular: { sort: 'votes', direction: 'desc' },
      answered: { sort: 'answers_count', direction: 'desc' }
    };
    
    fetchQuestions(sortOptions[activeFilter as keyof typeof sortOptions]);
  }, [activeFilter, fetchQuestions]);

  const filters = [
    { key: 'recent', label: 'Recientes', icon: '⏰' },
    { key: 'popular', label: 'Populares', icon: '🔥' },
    { key: 'answered', label: 'Respondidas', icon: '✅' }
  ];

  const stats = [
    { label: 'Posts', value: '1,234', icon: '📝', color: 'text-blue-600' },
    { label: 'Respuestas', value: '3,456', icon: '💬', color: 'text-green-600' },
    { label: 'Usuarios', value: '789', icon: '👥', color: 'text-purple-600' },
    { label: 'Categorías', value: '24', icon: '📚', color: 'text-orange-600' }
  ];

  return (
    <MainLayout background="gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Hazlo tu mismo
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              La comunidad académica donde estudiantes y profesores comparten conocimiento. 
              Haz posts, obtén respuestas y construye tu reputación.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {user ? (
                <Link to="/ask">
                  <Button 
                    variant="primary" 
                    size="lg"
                    icon={<span className="text-lg">✏️</span>}
                    className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
                  >
                    Crear Post
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl"
                    >
                      Únete Gratis
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-blue-600 shadow-2xl"
                    >
                      Iniciar Sesión
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/4 -left-8 w-16 h-16 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <Card key={index} hover gradient className="text-center">
            <div className={`text-3xl mb-2 ${stat.color}`}>{stat.icon}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Contenido Principal */}
        <div className="lg:col-span-3">
          {/* Filtros */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Posts de la Comunidad</h2>
                <p className="text-gray-600">Explora los últimos posts y respuestas de estudiantes</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeFilter === filter.key
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Lista de Preguntas */}
          {loading ? (
            <Card className="text-center py-12">
              <Spinner size="lg" />
              <p className="mt-4 text-gray-600">Cargando posts...</p>
            </Card>
          ) : error ? (
            <Card className="text-center py-12">
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => fetchQuestions()}
                icon={<span>🔄</span>}
              >
                Reintentar
              </Button>
            </Card>
          ) : questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionCard key={question.id} question={question} />
              ))}
              
              {/* Load More */}
              <Card className="text-center py-8">
                <Button variant="outline" size="lg" fullWidth>
                  Ver Más Posts
                </Button>
              </Card>
            </div>
          ) : (
            <Card className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🤔</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay posts aún</h3>
              <p className="text-gray-600 mb-6">
                ¡Sé el primero en crear un post en la comunidad!
              </p>
              {user ? (
                <Link to="/ask">
                  <Button variant="primary" icon={<span>✏️</span>}>
                    Crear el Primer Post
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button variant="primary">
                    Únete para Participar
                  </Button>
                </Link>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-24">
            {/* Bienvenida para usuarios nuevos */}
            {!user && (
              <Card gradient className="bg-gradient-to-br from-blue-50 to-indigo-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">¡Únete a la Comunidad!</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Regístrate gratis y comienza a hacer posts, responder y ganar reputación.
                </p>
                <div className="space-y-2">
                  <Link to="/register">
                    <Button variant="primary" size="sm" fullWidth>
                      Crear Cuenta
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="ghost" size="sm" fullWidth>
                      Ya tengo cuenta
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Panel de usuario */}
            {user && (
              <Card>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tu Actividad</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reputación</span>
                    <Badge variant="primary">{user.reputacion} puntos</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rol</span>
                    <Badge variant="secondary">{user.rol}</Badge>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <Link to="/ask">
                    <Button variant="primary" size="sm" fullWidth icon={<span>✏️</span>}>
                      Nuevo Post
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button variant="outline" size="sm" fullWidth>
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Categorías Populares */}
            <Card>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Categorías Populares</h3>
              <div className="space-y-3">
                {[
                  { name: 'Matemáticas', count: 234, icon: '🔢' },
                  { name: 'Programación', count: 189, icon: '💻' },
                  { name: 'Física', count: 156, icon: '⚡' },
                  { name: 'Historia', count: 98, icon: '📚' },
                  { name: 'Química', count: 87, icon: '🧪' }
                ].map((category, index) => (
                  <Link 
                    key={index}
                    to={`/categories/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{category.icon}</span>
                      <span className="font-medium text-gray-900 group-hover:text-blue-600">
                        {category.name}
                      </span>
                    </div>
                    <Badge variant="secondary" size="sm">{category.count}</Badge>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Link to="/categories">
                  <Button variant="ghost" size="sm" fullWidth>
                    Ver Todas las Categorías
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Tips para Nuevos Usuarios */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
              <h3 className="text-lg font-bold text-gray-900 mb-3">💡 Tips para Posts</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Sé específico en tu post
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Incluye el contexto necesario
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Usa etiquetas relevantes
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Agrega imágenes si ayudan
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Usa formato markdown
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
