// src/components/layout/Navbar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para efectos dinámicos
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-2xl border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/30'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Premium con animaciones */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-2.5 rounded-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${
              isScrolled ? 'shadow-lg' : 'shadow-xl'
            }`}>
              <svg className="w-7 h-7 text-white transform group-hover:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-500">
                Hazlo tu 
              </span>
              <span className="text-xs font-bold text-gray-500 -mt-1 group-hover:text-indigo-500 transition-colors">
                mismo ✨
              </span>
            </div>
          </Link>

          {/* Navegación principal mejorada */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-lg border border-blue-200' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 hover:shadow-md'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🏠</span>
                <span>Inicio</span>
              </span>
              {isActive('/') && (
                <div className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
              )}
            </Link>
            
            <Link 
              to="/categories" 
              className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActive('/categories') 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-lg border border-green-200' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:text-green-600 hover:shadow-md'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">📚</span>
                <span>Categorías</span>
              </span>
              {isActive('/categories') && (
                <div className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              )}
            </Link>
            
            <Link 
              to="/search" 
              className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isActive('/search') 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-lg border border-purple-200' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:text-purple-600 hover:shadow-md'
              }`}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg">🔍</span>
                <span>Buscar</span>
              </span>
              {isActive('/search') && (
                <div className="absolute inset-x-0 -bottom-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              )}
            </Link>
          </div>

          {/* Sección derecha mejorada */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/ask">
                  <Button 
                    variant="primary" 
                    size="sm"
                    className="shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center space-x-2">
                      <span>✏️</span>
                      <span>Preguntar</span>
                    </span>
                  </Button>
                </Link>
                
                {/* Dropdown de usuario ultra premium */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 transform hover:scale-105 border border-transparent hover:border-blue-200 hover:shadow-lg"
                  >
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-900">{user.name}</div>
                      <div className="text-xs font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                        {user.reputacion} puntos ⭐
                      </div>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-all duration-300 ${isUserMenuOpen ? 'rotate-180 text-blue-500' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50 transform transition-all duration-300 animate-in slide-in-from-top-2">
                      {/* Header del dropdown */}
                      <div className="px-5 py-3 border-b border-gray-100/80">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                user.rol === 'admin' ? 'bg-red-100 text-red-700' :
                                user.rol === 'moderador' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                              </span>
                              <span className="text-xs font-bold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                                {user.reputacion} pts ⭐
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Menu items */}
                      <div className="py-2">
                        <Link 
                          to="/profile" 
                          className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 transform hover:scale-105"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="text-lg mr-3">👤</span>
                          <span>Mi Perfil</span>
                        </Link>
                        
                        <Link 
                          to="/favorites" 
                          className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-700 transition-all duration-200 transform hover:scale-105"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <span className="text-lg mr-3">❤️</span>
                          <span>Favoritos</span>
                        </Link>
                        
                        {user.rol === 'admin' && (
                          <>
                            <hr className="my-2 border-gray-100" />
                            <Link 
                              to="/admin" 
                              className="flex items-center px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 transition-all duration-200 transform hover:scale-105"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <span className="text-lg mr-3">⚙️</span>
                              <span>Panel Admin</span>
                            </Link>
                          </>
                        )}
                        
                        <hr className="my-2 border-gray-100" />
                        <button 
                          onClick={handleLogout}
                          className="flex items-center w-full px-5 py-3 text-sm font-medium text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 transform hover:scale-105"
                        >
                          <span className="text-lg mr-3">🚪</span>
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="font-semibold hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 transform hover:scale-105 transition-all duration-300">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="shadow-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300">
                    <span className="flex items-center space-x-1">
                      <span>🚀</span>
                      <span>Registrarse</span>
                    </span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón menú móvil Premium */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-gray-600 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-blue-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil Ultra Premium */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200/50 py-4 rounded-b-2xl shadow-2xl">
            <div className="space-y-2">
              <Link 
                to="/" 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive('/') ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-lg' : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">🏠</span>
                <span>Inicio</span>
              </Link>
              <Link 
                to="/categories" 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive('/categories') ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-lg' : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-green-50 hover:text-green-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">📚</span>
                <span>Categorías</span>
              </Link>
              <Link 
                to="/search" 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                  isActive('/search') ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 shadow-lg' : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 hover:text-purple-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">🔍</span>
                <span>Buscar</span>
              </Link>
              
              {user ? (
                <>
                  <hr className="my-4 border-gray-200" />
                  <div className="px-4 py-3">
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                          {user.reputacion} puntos ⭐
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to="/ask" 
                    className="flex items-center space-x-3 mx-4 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">✏️</span>
                    <span>Hacer Pregunta</span>
                  </Link>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">👤</span>
                    <span>Mi Perfil</span>
                  </Link>
                  
                  <Link 
                    to="/favorites" 
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 hover:text-pink-700 rounded-xl transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">❤️</span>
                    <span>Favoritos</span>
                  </Link>
                  
                  {user.rol === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-700 rounded-xl transition-all duration-300 transform hover:scale-105"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl">⚙️</span>
                      <span>Panel Admin</span>
                    </Link>
                  )}
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-4 border-gray-200" />
                  <Link 
                    to="/login" 
                    className="flex items-center space-x-3 mx-4 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-200 hover:border-blue-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">🔐</span>
                    <span>Iniciar Sesión</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center space-x-3 mx-4 px-4 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl shadow-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">🚀</span>
                    <span>Registrarse</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
