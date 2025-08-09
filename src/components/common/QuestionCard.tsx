// src/components/common/QuestionCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { VoteButtons } from './VoteButtons';
import type { Question } from '../../types';

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'hace tiempo';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'hace menos de 1 hora';
    if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 30) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return 'success';
      case 'cerrada': return 'danger';
      default: return 'primary';
    }
  };

  const getStatusIcon = (estado?: string) => {
    switch (estado) {
      case 'resuelta': return '✅';
      case 'cerrada': return '🔒';
      default: return '❓';
    }
  };

  const getCategoryIcon = (categoryName?: string) => {
    switch (categoryName?.toLowerCase()) {
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

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-blue-500">
      <div className="flex space-x-4">
        {/* Voting section */}
        <div className="flex-shrink-0">
          <VoteButtons 
            votableType="App\Models\Question"
            votableId={question.id}
            initialScore={question.votos || 0}
          />
        </div>

        {/* Content section */}
        <div className="flex-grow min-w-0">
          {/* Title and status */}
          <div className="flex items-start justify-between mb-3">
            <Link 
              to={`/questions/${question.id}`} 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mr-4"
            >
              {question.titulo}
            </Link>
            <Badge 
              variant={getStatusColor(question.estado)} 
              size="sm"
              icon={<span>{getStatusIcon(question.estado)}</span>}
            >
              {question.estado || 'abierta'}
            </Badge>
          </div>

          {/* Content preview */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {question.contenido}
          </p>

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.slice(0, 4).map(tag => (
                <Badge key={tag.id} variant="secondary" size="sm">
                  {tag.nombre}
                </Badge>
              ))}
              {question.tags.length > 4 && (
                <Badge variant="secondary" size="sm">
                  +{question.tags.length - 4} más
                </Badge>
              )}
            </div>
          )}

          {/* Footer with metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {/* Category */}
              <div className="flex items-center space-x-1">
                <span>{getCategoryIcon(question.category?.nombre)}</span>
                <span className="font-medium">{question.category?.nombre || 'Sin categoría'}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center space-x-3">
                {question.answers && (
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{question.answers.length} respuesta{question.answers.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
                
                {question.vistas && (
                  <div className="flex items-center space-x-1">
                    <span>👁️</span>
                    <span>{question.vistas} vista{question.vistas !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Author and date */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {question.user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{question.user.name}</span>
              </div>
              <span>•</span>
              <span>{formatDate(question.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};