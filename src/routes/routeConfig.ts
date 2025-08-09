// src/routes/routeConfig.ts

export interface RouteConfig {
  path: string;
  title: string;
  description?: string;
  requiresAuth?: boolean;
  requiredRoles?: string[];
  isPublic?: boolean;
}

export const routeConfigs: Record<string, RouteConfig> = {
  // Rutas públicas
  home: {
    path: '/',
    title: 'Inicio',
    description: 'Página principal del foro',
    isPublic: true,
  },
  login: {
    path: '/login',
    title: 'Iniciar Sesión',
    description: 'Página de autenticación',
    isPublic: true,
  },
  register: {
    path: '/register',
    title: 'Registro',
    description: 'Crear nueva cuenta',
    isPublic: true,
  },
  questionDetail: {
    path: '/questions/:id',
    title: 'Detalle de Pregunta',
    description: 'Ver pregunta específica',
    isPublic: true,
  },
  categories: {
    path: '/categories',
    title: 'Categorías',
    description: 'Explorar categorías',
    isPublic: true,
  },
  search: {
    path: '/search',
    title: 'Buscar',
    description: 'Buscar preguntas y respuestas',
    isPublic: true,
  },
  
  // Rutas protegidas
  ask: {
    path: '/ask',
    title: 'Crear Post',
    description: 'Crear nuevo post',
    requiresAuth: true,
  },
  createPost: {
    path: '/create-post',
    title: 'Nuevo Post',
    description: 'Crear nuevo post con markdown e imágenes',
    requiresAuth: true,
  },
  profile: {
    path: '/profile',
    title: 'Mi Perfil',
    description: 'Información personal y actividad',
    requiresAuth: true,
  },
  favorites: {
    path: '/favorites',
    title: 'Favoritos',
    description: 'Preguntas marcadas como favoritas',
    requiresAuth: true,
  },
  
  // Rutas de administrador
  admin: {
    path: '/admin',
    title: 'Administración',
    description: 'Panel de administración del sistema',
    requiresAuth: true,
    requiredRoles: ['admin'],
  },
};

// Utilidades para trabajar con rutas
export const getRouteConfig = (routeName: string): RouteConfig | undefined => {
  return routeConfigs[routeName];
};

export const getPublicRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs).filter(route => route.isPublic);
};

export const getProtectedRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs).filter(route => route.requiresAuth && !route.requiredRoles);
};

export const getAdminRoutes = (): RouteConfig[] => {
  return Object.values(routeConfigs).filter(route => route.requiredRoles?.includes('admin'));
};
