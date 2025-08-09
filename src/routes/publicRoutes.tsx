// src/routes/publicRoutes.tsx
import { Route } from 'react-router-dom';

// Páginas públicas
import HomePage from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { QuestionDetailPage } from '../pages/QuestionDetailPage';
import { QuestionDetailPageDemo } from '../pages/QuestionDetailPageDemo';
import { CategoriesPage } from '../pages/CategoriesPage';
import { SearchPage } from '../pages/SearchPage';
import { TestPage } from '../pages/TestPage';

export const publicRoutes = [
  <Route key="home" path="/" element={<HomePage />} />,
  <Route key="login" path="/login" element={<LoginPage />} />,
  <Route key="register" path="/register" element={<RegisterPage />} />,
  <Route key="question-detail" path="/questions/:id" element={<QuestionDetailPage />} />,
  <Route key="question-demo" path="/demo/question" element={<QuestionDetailPageDemo />} />,
  <Route key="categories" path="/categories" element={<CategoriesPage />} />,
  <Route key="search" path="/search" element={<SearchPage />} />,
  <Route key="test" path="/test" element={<TestPage />} />,
];
