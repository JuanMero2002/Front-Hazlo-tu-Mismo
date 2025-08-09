// src/pages/TestPage.tsx
import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { FileUploadTest } from '../components/test/FileUploadTest';

export const TestPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Test de Funcionalidades</h1>
          <p className="text-gray-600">Página para probar componentes</p>
        </div>
        
        <FileUploadTest />
      </div>
    </MainLayout>
  );
};
