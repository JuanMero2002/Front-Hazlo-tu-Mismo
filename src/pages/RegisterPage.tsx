// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { MainLayout } from '../components/layout/MainLayout';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!acceptTerms) {
      newErrors.terms = 'Debes aceptar los términos y condiciones';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const success = await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });
      
      if (success) {
        navigate('/');
      }
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Error al crear la cuenta. Inténtalo de nuevo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    return strength;
  };

  const getStrengthLabel = () => {
    const strength = getPasswordStrength();
    if (strength < 2) return { label: 'Muy débil', color: 'bg-red-500' };
    if (strength < 3) return { label: 'Débil', color: 'bg-orange-500' };
    if (strength < 4) return { label: 'Buena', color: 'bg-yellow-500' };
    return { label: 'Excelente', color: 'bg-green-500' };
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-xl">🚀</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Únete a la comunidad!
          </h2>
          <p className="text-gray-600">
            Crea tu cuenta y comienza tu viaje de aprendizaje
          </p>
        </div>

        {/* Form */}
        <Card className="shadow-2xl border-0">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  <p className="text-red-700 text-sm">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Name */}
            <div>
              <Input
                label="Nombre completo"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                error={errors.name}
                required
                fullWidth
                icon={<span>👤</span>}
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                error={errors.email}
                required
                fullWidth
                icon={<span>📧</span>}
                disabled={isLoading}
                helperText="Te enviaremos un correo de confirmación"
              />
            </div>

            {/* Password */}
            <div>
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Crea una contraseña segura"
                error={errors.password}
                required
                fullWidth
                icon={<span>🔒</span>}
                disabled={isLoading}
              />
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Seguridad:</span>
                    <span className={`text-xs font-medium ${
                      getPasswordStrength() < 2 ? 'text-red-600' :
                      getPasswordStrength() < 3 ? 'text-orange-600' :
                      getPasswordStrength() < 4 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {getStrengthLabel().label}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthLabel().color}`}
                      style={{ width: `${(getPasswordStrength() / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? '🙈 Ocultar' : '👁️ Mostrar'} contraseña
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <Input
                label="Confirmar contraseña"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword}
                required
                fullWidth
                icon={<span>🔐</span>}
                disabled={isLoading}
              />
            </div>

            {/* Terms and conditions */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Acepto los{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                    Términos de Servicio
                  </Link>{' '}
                  y la{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                    Política de Privacidad
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading || !acceptTerms}
              className="relative shadow-lg py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner size="sm" color="white" className="mr-2" />
                  Creando cuenta...
                </div>
              ) : (
                '🎉 Crear mi cuenta'
              )}
            </Button>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                to="/login" 
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </Card>

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <h3 className="font-bold text-gray-900 mb-3">🌟 ¿Por qué unirte?</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              Acceso a miles de preguntas y respuestas
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              Gana reputación ayudando a otros
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              Conecta con estudiantes de tu área
            </li>
            <li className="flex items-center">
              <span className="mr-2">✅</span>
              Completamente gratis
            </li>
          </ul>
        </Card>
      </div>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>
      </div>
    </MainLayout>
  );
};
