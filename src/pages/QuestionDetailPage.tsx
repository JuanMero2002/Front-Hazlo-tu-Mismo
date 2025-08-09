// src/pages/QuestionDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuestions } from '../hooks/useQuestions';
import { useAnswers } from '../hooks/useAnswers';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { MarkdownEditor } from '../components/ui/MarkdownEditor';
import { AttachmentsList } from '../components/common/AttachmentsList';
import { VoteButtons } from '../components/common/VoteButtons';
import { AnswerCard } from '../components/common/AnswerCard';
import { FavoriteButton } from '../components/common/FavoriteButton';
import { ReportButton } from '../components/common/ReportButton';

export const QuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { question, loading: questionLoading, error, fetchQuestionById } = useQuestions();
  const { createAnswer, loading: answerLoading } = useAnswers();
  const [answerContent, setAnswerContent] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  // Efecto para cargar la pregunta una sola vez cuando cambia el ID
  useEffect(() => {
    if (id) {
      fetchQuestionById(parseInt(id));
    }
  }, [id]); // Solo depende del ID, no de fetchQuestionById

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !question || answerContent.length < 30) {
      alert('Debes escribir al menos 30 caracteres para tu respuesta');
      return;
    }

    const result = await createAnswer({
      contenido: answerContent.replace(/[*_`>#+\-]/g, ''), // Contenido sin markdown para fallback
      contenido_markdown: answerContent, // Contenido con markdown
      question_id: question.id
    });

    if (result) {
      setAnswerContent('');
      setShowAnswerForm(false);
      // Recargar la pregunta para obtener las respuestas actualizadas
      if (id) {
        fetchQuestionById(parseInt(id));
      }
    }
  };

  const getStatusColor = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return 'bg-green-100 text-green-800 border-green-300';
      case 'cerrada': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusText = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return '✓ Resuelta';
      case 'cerrada': return '✗ Cerrada';
      default: return '● Abierta';
    }
  };

  if (questionLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Spinner />
            <p className="mt-4 text-gray-600">Cargando pregunta...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !question) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.29-5.5-3.29" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">Pregunta no encontrada</h2>
            <p className="text-gray-500 mb-6">{error || 'La pregunta que buscas no existe o ha sido eliminada'}</p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/search" className="hover:text-blue-600 transition-colors">
                Preguntas
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {question.titulo.length > 50 ? `${question.titulo.substring(0, 50)}...` : question.titulo}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenido Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Pregunta Principal */}
            <Card className="overflow-hidden">
              {/* Header con estado */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(question.estado)}`}>
                      {getStatusText(question.estado)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {question.vistas || 0} visualizaciones
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(question.created_at || '').toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex space-x-6">
                  {/* Votación */}
                  <div className="flex-shrink-0">
                    <VoteButtons 
                      votableType="App\Models\Question"
                      votableId={question.id}
                      initialScore={question.votos || 0}
                    />
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-grow min-w-0">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                      {question.titulo}
                    </h1>
                    
                    {/* Contenido de la pregunta */}
                    <div className="mb-6">
                      {question.contenido_markdown ? (
                        <MarkdownRenderer 
                          content={question.contenido_markdown} 
                          className="text-gray-700 leading-relaxed"
                        />
                      ) : (
                        <div className="prose prose-lg max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {question.contenido}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Archivos adjuntos */}
                    {question.attachments && question.attachments.length > 0 && (
                      <div className="mb-6">
                        <AttachmentsList attachments={question.attachments} />
                      </div>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {question.tags?.map(tag => (
                        <Link
                          key={tag.id}
                          to={`/search?tags=${tag.id}`}
                          className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                        >
                          #{tag.nombre}
                        </Link>
                      ))}
                    </div>

                    {/* Metadatos y acciones */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {question.user?.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{question.user?.name}</p>
                            <p className="text-sm text-gray-500">
                              {question.user?.reputacion} puntos de reputación
                            </p>
                          </div>
                        </div>
                        {question.category && (
                          <Link
                            to={`/search?category=${question.category.id}`}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                          >
                            {question.category.nombre}
                          </Link>
                        )}
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex items-center space-x-3">
                        <FavoriteButton questionId={question.id} />
                        <ReportButton 
                          reportableType="App\Models\Question"
                          reportableId={question.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Sección de Respuestas */}
            <Card>
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {question.answers?.length || 0} Respuesta(s)
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {question.answers?.length ? (
                  question.answers.map((answer) => (
                    <div key={answer.id} className="p-6">
                      <AnswerCard 
                        answer={answer} 
                        questionAuthorId={question.user?.id}
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
            {user && (question.answers?.length ? true : showAnswerForm) && (
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
                      <MarkdownEditor
                        value={answerContent}
                        onChange={(value) => setAnswerContent(value)}
                        placeholder="Escribe una respuesta clara y útil usando Markdown...

Ejemplos:
**negrita** o *cursiva*
`código` o ```bloque de código```
[enlace](URL)
- lista
> cita

Recuerda incluir detalles específicos y ejemplos cuando sea apropiado."
                        rows={8}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className={`text-sm ${answerContent.length < 30 ? 'text-red-500' : 'text-green-600'}`}>
                          {answerContent.length}/30 caracteres mínimo
                        </div>
                        <div className="text-sm text-gray-500">
                          Markdown soportado con vista previa
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        <p>💡 Consejo: Proporciona respuestas detalladas y bien estructuradas</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        {question.answers?.length && (
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
                          disabled={answerLoading || answerContent.length < 30}
                          className="px-6"
                        >
                          {answerLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Publicando...
                            </>
                          ) : (
                            'Publicar Respuesta'
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>
            )}

            {/* Call to action para usuarios no autenticados */}
            {!user && (
              <Card>
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">¿Conoces la respuesta?</h3>
                  <p className="text-gray-600 mb-6">
                    Inicia sesión para ayudar a la comunidad con tu conocimiento
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link to="/login">
                      <Button variant="primary">Iniciar Sesión</Button>
                    </Link>
                    <Link to="/register">
                      <Button variant="secondary">Crear Cuenta</Button>
                    </Link>
                  </div>
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
                    <span className="font-bold text-blue-600">{question.votos || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Respuestas</span>
                    <span className="font-bold text-green-600">{question.answers?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vistas</span>
                    <span className="font-bold text-purple-600">{question.vistas || 0}</span>
                  </div>
                </div>
              </Card>

              {/* Preguntas relacionadas */}
              <Card>
                <h3 className="font-bold text-gray-900 mb-4">Preguntas Relacionadas</h3>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">
                    Próximamente: preguntas similares basadas en tags y categoría
                  </div>
                </div>
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
    </MainLayout>
  );
};
