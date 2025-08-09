// src/pages/admin/AdminStats.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import apiClient from '../../api/axios';

interface AdminStatsData {
  users: {
    total: number;
    admins: number;
    moderators: number;
    regular: number;
    new_this_month: number;
  };
  content: {
    questions: {
      total: number;
      open: number;
      resolved: number;
      closed: number;
      new_today: number;
    };
    answers: {
      total: number;
      new_today: number;
    };
    categories: number;
    tags: number;
  };
  engagement: {
    votes: {
      total: number;
      positive: number;
      negative: number;
    };
    reports: {
      total: number;
      pending: number;
      reviewed: number;
      discarded: number;
    };
  };
  top_users: Array<{
    id: number;
    name: string;
    reputacion: number;
  }>;
  popular_categories: Array<{
    id: number;
    nombre: string;
    questions_count: number;
  }>;
  popular_tags: Array<{
    id: number;
    nombre: string;
    questions_count: number;
  }>;
  recent_activity: {
    questions: Array<{
      id: number;
      titulo: string;
      user_id: number;
      category_id: number;
      created_at: string;
    }>;
    answers: Array<{
      id: number;
      user_id: number;
      question_id: number;
      created_at: string;
    }>;
  };
  monthly_stats: Array<{
    month: string;
    label: string;
    questions: number;
    answers: number;
    users: number;
    votes: number;
  }>;
}

export const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/admin-stats');
        setStats(response.data);
      } catch (e: any) {
        setError(e.response?.data?.message || 'Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-red-500 text-center">{error}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <p className="text-center">No hay datos disponibles</p>
      </Card>
    );
  }

  const statCards = [
    { title: 'Total Usuarios', value: stats.users.total, color: 'blue' },
    { title: 'Total Preguntas', value: stats.content.questions.total, color: 'green' },
    { title: 'Total Respuestas', value: stats.content.answers.total, color: 'purple' },
    { title: 'Total Reportes', value: stats.engagement.reports.total, color: 'red' },
    { title: 'Usuarios Nuevos (Este Mes)', value: stats.users.new_this_month, color: 'indigo' },
    { title: 'Preguntas Hoy', value: stats.content.questions.new_today, color: 'teal' },
    { title: 'Reportes Pendientes', value: stats.engagement.reports.pending, color: 'orange' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Estadísticas del Sistema</h2>
      
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <div className="text-center">
              <div className={`text-3xl font-bold text-${stat.color}-600 mb-2`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.title}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Estadísticas de usuarios por rol */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-bold mb-4">Usuarios por Rol</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span>Administradores</span>
              <span className="font-bold text-blue-600">{stats.users.admins}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span>Moderadores</span>
              <span className="font-bold text-green-600">{stats.users.moderators}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span>Usuarios Regulares</span>
              <span className="font-bold text-gray-600">{stats.users.regular}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4">Estado de Preguntas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span>Abiertas</span>
              <span className="font-bold text-green-600">{stats.content.questions.open}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span>Resueltas</span>
              <span className="font-bold text-blue-600">{stats.content.questions.resolved}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span>Cerradas</span>
              <span className="font-bold text-red-600">{stats.content.questions.closed}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Top usuarios y categorías populares */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-bold mb-4">Top Usuarios por Reputación</h3>
          <div className="space-y-2">
            {stats.top_users.slice(0, 5).map((user, index) => (
              <div key={user.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="flex items-center">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 font-bold">
                    {index + 1}
                  </span>
                  {user.name}
                </span>
                <span className="font-bold text-blue-600">{user.reputacion}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold mb-4">Categorías Más Populares</h3>
          <div className="space-y-2">
            {stats.popular_categories.slice(0, 5).map((category, index) => (
              <div key={category.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <span className="flex items-center">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full text-xs flex items-center justify-center mr-2 font-bold">
                    {index + 1}
                  </span>
                  {category.nombre}
                </span>
                <span className="font-bold text-green-600">{category.questions_count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actividad reciente */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Actividad Reciente</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-3 text-green-600">Preguntas Recientes</h4>
            <div className="space-y-2">
              {stats.recent_activity.questions.map((question) => (
                <div key={question.id} className="p-2 bg-green-50 rounded text-sm">
                  <div className="font-medium truncate">{question.titulo}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(question.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-blue-600">Respuestas Recientes</h4>
            <div className="space-y-2">
              {stats.recent_activity.answers.map((answer) => (
                <div key={answer.id} className="p-2 bg-blue-50 rounded text-sm">
                  <div className="text-gray-700">Respuesta #{answer.id}</div>
                  <div className="text-gray-500 text-xs">
                    {new Date(answer.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
