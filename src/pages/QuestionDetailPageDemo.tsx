// src/pages/QuestionDetailPageDemo.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { VoteButtons } from '../components/common/VoteButtons';
import { AnswerCard } from '../components/common/AnswerCard';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ReportButton } from '../components/common/ReportButton';
import type { Question, Answer, User } from '../types';

// Datos mock para demostración
const mockUser: User = {
  id: 1,
  name: 'María González',
  email: 'maria@example.com',
  rol: 'usuario',
  reputacion: 150
};

const mockAnswer: Answer = {
  id: 1,
  contenido: 'La integral por partes es una técnica fundamental del cálculo integral. La fórmula es ∫u dv = uv - ∫v du. En este caso, debes identificar qué parte será u y qué parte será dv. Para x ln(x), recomiendo que u = ln(x) y dv = x dx.',
  es_mejor_respuesta: true,
  votos: 15,
  user: {
    id: 2,
    name: 'Dr. Carlos Pérez',
    email: 'carlos@example.com',
    rol: 'usuario',
    reputacion: 500
  },
  created_at: '2024-01-15T10:30:00Z'
};

const mockQuestion: Question = {
  id: 1,
  titulo: '¿Cómo resolver la integral de x ln(x) dx?',
  contenido: `Estoy estudiando cálculo integral y me encontré con este problema que no logro resolver:

∫ x ln(x) dx

He intentado usar sustitución pero no me ha funcionado. ¿Podrían ayudarme con el método correcto y los pasos detallados?

Gracias de antemano por su ayuda.`,
  estado: 'resuelta',
  votos: 8,
  vistas: 124,
  user: mockUser,
  category: {
    id: 1,
    nombre: 'Matemáticas',
    descripcion: 'Preguntas sobre matemáticas y cálculo'
  },
  tags: [
    { id: 1, nombre: 'cálculo' },
    { id: 2, nombre: 'integral' },
    { id: 3, nombre: 'logaritmo' }
  ],
  answers: [mockAnswer],
  created_at: '2024-01-15T09:00:00Z'
};

export const QuestionDetailPageDemo: React.FC = () => {
  const [answerContent, setAnswerContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const user = mockUser; // Simular usuario autenticado

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerContent.length < 30) {
      alert('Debes escribir al menos 30 caracteres para tu respuesta');
      return;
    }
    
    alert('¡Respuesta enviada correctamente! (Demo)');
    setAnswerContent('');
    setShowAnswerForm(false);
  };

  const getStatusColor = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return 'bg-green-100 text-green-800 border-green-300';
      case 'cerrada': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusIcon = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return '✅';
      case 'cerrada': return '🔒';
      default: return '🔍';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  🏠 Inicio
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Link to="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                    Categorías
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-gray-900 font-medium">{mockQuestion.category.nombre}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-3 space-y-6">
              {/* Pregunta Principal */}
              <Card>
                <div className="border-b border-gray-200 pb-6 mb-6">
                  {/* Header con estado y acciones */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(mockQuestion.estado)}`}>
                          {getStatusIcon(mockQuestion.estado)} {(mockQuestion.estado || 'abierta').charAt(0).toUpperCase() + (mockQuestion.estado || 'abierta').slice(1)}
                        </span>
                        
                        <div className="flex space-x-2">
                          {mockQuestion.tags.map(tag => (
                            <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              #{tag.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                        {mockQuestion.titulo}
                      </h1>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <FavoriteButton questionId={mockQuestion.id} />
                      <ReportButton 
                        reportableType="App\Models\Question"
                        reportableId={mockQuestion.id}
                      />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {mockQuestion.user.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">{mockQuestion.user.name}</span>
                        <span className="ml-1">• {mockQuestion.user.reputacion} puntos</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <span>📅 {formatDate(mockQuestion.created_at!)}</span>
                      <span>👁️ {mockQuestion.vistas} vistas</span>
                    </div>
                  </div>
                </div>

                {/* Contenido y votación */}
                <div className="flex space-x-6">
                  <div className="flex-shrink-0">
                    <VoteButtons
                      votableType="App\Models\Question"
                      votableId={mockQuestion.id}
                      initialScore={mockQuestion.votos || 0}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="prose max-w-none">
                      {mockQuestion.contenido.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Sección de Respuestas */}
              <Card>
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <h2 className="text-xl font-bold text-gray-900">
                    {mockQuestion.answers?.length || 0} Respuesta(s)
                  </h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {mockQuestion.answers?.length ? (
                    mockQuestion.answers.map((answer) => (
                      <div key={answer.id} className="p-6">
                        <AnswerCard 
                          answer={answer} 
                          questionAuthorId={mockQuestion.user?.id}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.001 8.001 0 01-7.391-4.9L2 8a8 8 0 018-8c4.418 0 8 3.582 8 8z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay respuestas aún</h3>
                      <p className="text-gray-500 mb-4">¡Sé el primero en responder esta pregunta!</p>
                      {user && (
                        <Button 
                          variant="primary" 
                          onClick={() => setShowAnswerForm(true)}
                        >
                          Escribir Respuesta
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Formulario para nueva respuesta */}
              {user && (mockQuestion.answers?.length ? true : showAnswerForm) && (
                <Card>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                    <h3 className="text-lg font-bold text-gray-900">Tu Respuesta</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Ayuda a la comunidad compartiendo tu conocimiento
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <form onSubmit={handleSubmitAnswer} className="space-y-4">
                      <div>
                        <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                          Tu respuesta *
                        </label>
                        <textarea
                          id="answer"
                          value={answerContent}
                          onChange={(e) => setAnswerContent(e.target.value)}
                          placeholder="Escribe una respuesta clara y útil. Recuerda incluir detalles específicos y ejemplos cuando sea apropiado..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={8}
                          required
                        />
                        <div className="flex justify-between items-center mt-2">
                          <div className={`text-sm ${answerContent.length < 30 ? 'text-red-500' : 'text-green-600'}`}>
                            {answerContent.length}/30 caracteres mínimo
                          </div>
                          <div className="text-sm text-gray-500">
                            Markdown básico soportado
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <p>💡 Consejo: Proporciona respuestas detalladas y bien estructuradas</p>
                        </div>
                        
                        <div className="flex space-x-3">
                          {mockQuestion.answers?.length && (
                            <Button 
                              type="button" 
                              variant="secondary"
                              onClick={() => setShowAnswerForm(false)}
                            >
                              Cancelar
                            </Button>
                          )}
                          <Button 
                            type="submit" 
                            variant="primary"
                            disabled={answerContent.length < 30}
                            className="px-6"
                          >
                            Publicar Respuesta
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6 sticky top-6">
                {/* Estadísticas de la pregunta */}
                <Card>
                  <h3 className="font-bold text-gray-900 mb-4">Estadísticas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Votos</span>
                      <span className="font-bold text-blue-600">{mockQuestion.votos || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Respuestas</span>
                      <span className="font-bold text-green-600">{mockQuestion.answers?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Vistas</span>
                      <span className="font-bold text-purple-600">{mockQuestion.vistas || 0}</span>
                    </div>
                  </div>
                </Card>

                {/* Categoría */}
                <Card>
                  <h3 className="font-bold text-gray-900 mb-4">Categoría</h3>
                  <Link 
                    to={`/categories/${mockQuestion.category.id}`}
                    className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <span className="text-2xl mr-3">📚</span>
                    <div>
                      <div className="font-medium text-blue-900">{mockQuestion.category.nombre}</div>
                      <div className="text-sm text-blue-700">{mockQuestion.category.descripcion}</div>
                    </div>
                  </Link>
                </Card>

                {/* Enlaces rápidos */}
                <Card>
                  <h3 className="font-bold text-gray-900 mb-4">Enlaces Útiles</h3>
                  <div className="space-y-2">
                    <Link to="/ask" className="block text-blue-600 hover:underline text-sm">
                      Hacer una pregunta
                    </Link>
                    <Link to="/search" className="block text-blue-600 hover:underline text-sm">
                      Buscar preguntas
                    </Link>
                    <Link to="/categories" className="block text-blue-600 hover:underline text-sm">
                      Ver categorías
                    </Link>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
