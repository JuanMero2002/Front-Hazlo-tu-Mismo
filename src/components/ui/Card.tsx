// src/components/ui/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  gradient?: boolean;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  hover = false,
  gradient = false,
  border = true
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const baseClasses = 'bg-white transition-all duration-200';
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';
  const gradientClass = gradient ? 'bg-gradient-to-br from-white to-blue-50' : '';
  const borderClass = border ? 'border border-gray-200' : '';
  
  return (
    <div className={`
      ${baseClasses} 
      ${paddingClasses[padding]} 
      ${shadowClasses[shadow]} 
      ${roundedClasses[rounded]} 
      ${hoverClass} 
      ${gradientClass}
      ${borderClass}
      ${className}
    `}>
      {children}
    </div>
  );
};
