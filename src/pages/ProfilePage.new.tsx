// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import apiClient from '../api/axios';

interface UserActivity {
  questions: {
    total: number;
    resolved: number;
    recent: Array<{
      id: number;
      titulo: string;
      estado: string;
      created_at: string;
    }>;
  };
  answers: {
    total: number;
    best_answers: number;
    recent: Array<{
      id: number;
      question: {
        id: number;
        titulo: string;
      };
      created_at: string;
    }>;
  };
  votes_given: number;
  reputation: number;
  favorites_count: number;
}

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userActivity, setUserActivity] = useState<UserActivity | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserActivity();
    }
  }, [user]);

  const loadUserActivity = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get('/dashboard/user-activity');
      setUserActivity(response.data);
    } catch (error) {
      console.error('Error cargando actividad del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center">
          <p>No estás autenticado</p>
        </div>
      </MainLayout>
    );
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header del Perfil */}
        <Card className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {user.rol}
                </span>
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm ml-2">
                  {user.reputacion} puntos de reputación
                </span>
              </div>
            </div>
            <div>
              <Button variant="secondary">
                Editar Perfil
              </Button>
            </div>
          </div>
        </Card>

        {/* Estadísticas */}
        {userActivity && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userActivity.questions.total}</div>
                <div className="text-gray-600">Preguntas</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userActivity.answers.total}</div>
                <div className="text-gray-600">Respuestas</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{userActivity.answers.best_answers}</div>
                <div className="text-gray-600">Mejores Respuestas</div>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userActivity.favorites_count}</div>
                <div className="text-gray-600">Favoritos</div>
              </div>
            </Card>
          </div>
        )}

        {/* Tabs de Contenido */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preguntas Recientes
              </button>
              <button
                onClick={() => setActiveTab('answers')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'answers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Respuestas Recientes
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'overview' && userActivity && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">Actividad de Preguntas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span>Total de preguntas</span>
                      <span className="font-bold text-blue-600">{userActivity.questions.total}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span>Preguntas resueltas</span>
                      <span className="font-bold text-green-600">{userActivity.questions.resolved}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                      <span>Votos dados</span>
                      <span className="font-bold text-purple-600">{userActivity.votes_given}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-600">Actividad de Respuestas</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span>Total de respuestas</span>
                      <span className="font-bold text-green-600">{userActivity.answers.total}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                      <span>Mejores respuestas</span>
                      <span className="font-bold text-yellow-600">{userActivity.answers.best_answers}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded">
                      <span>Reputación total</span>
                      <span className="font-bold text-indigo-600">{userActivity.reputation}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'questions' && userActivity && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Preguntas Recientes</h3>
                {userActivity.questions.recent.length > 0 ? (
                  <div className="space-y-4">
                    {userActivity.questions.recent.map(question => (
                      <Card key={question.id}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">{question.titulo}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className={`px-2 py-1 rounded ${
                                question.estado === 'resuelta' ? 'bg-green-100 text-green-800' :
                                question.estado === 'abierta' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {question.estado}
                              </span>
                              <span>{new Date(question.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No has hecho preguntas recientemente</p>
                )}
              </div>
            )}

            {activeTab === 'answers' && userActivity && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Respuestas Recientes</h3>
                {userActivity.answers.recent.length > 0 ? (
                  <div className="space-y-4">
                    {userActivity.answers.recent.map(answer => (
                      <Card key={answer.id}>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-2">
                              Respuesta a: {answer.question.titulo}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Respuesta #{answer.id}</span>
                              <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">No has dado respuestas recientemente</p>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};
