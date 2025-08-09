# Rincón del Vago 2.0 - Frontend

Sistema de preguntas y respuestas académico tipo "Stack Overflow" desarrollado con React, TypeScript y Tailwind CSS.

## 🎯 Funcionalidades Principales

### Para Usuarios Registrados
- **Hacer preguntas** académicas con categorías y etiquetas
- **Responder preguntas** de otros usuarios
- **Sistema de votación** para preguntas y respuestas (+1/-1)
- **Marcar respuestas como "mejor respuesta"** (solo autor de la pregunta)
- **Guardar preguntas como favoritas**
- **Sistema de reputación** basado en votos
- **Reportar contenido** inapropiado

### Para Administradores
- **Panel de administración** completo
- **Gestión de usuarios** (cambiar roles, eliminar)
- **Gestión de categorías y etiquetas**
- **Moderación de reportes**
- **Estadísticas del sistema**

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── common/          # Componentes comunes (QuestionCard, VoteButtons, etc.)
│   ├── layout/          # Componentes de layout (Navbar, MainLayout)
│   └── ui/              # Componentes UI básicos (Button, Card, Spinner)
├── hooks/               # Custom hooks para lógica de negocio
│   ├── useAuth.ts       # Autenticación y gestión de usuarios
│   ├── useQuestions.ts  # Gestión de preguntas
│   ├── useAnswers.ts    # Gestión de respuestas
│   ├── useVoting.ts     # Sistema de votación
│   ├── useFavorites.ts  # Gestión de favoritos
│   └── useReports.ts    # Sistema de reportes
├── pages/               # Páginas de la aplicación
│   ├── admin/           # Páginas del panel de administración
│   ├── HomePage.tsx     # Página principal
│   ├── LoginPage.tsx    # Inicio de sesión
│   ├── RegisterPage.tsx # Registro
│   └── ...              # Otras páginas
├── types/               # Definiciones de tipos TypeScript
├── api/                 # Configuración de Axios
└── App.tsx              # Componente principal con rutas
```

## 📋 Reglas de Negocio

### Preguntas
- Solo usuarios registrados pueden crear preguntas
- Deben tener título, contenido y al menos una etiqueta
- Estados: `abierta`, `resuelta`, `cerrada`
- Se pueden votar por cualquier usuario (excepto el autor)

### Respuestas
- Mínimo 30 caracteres
- Una respuesta por usuario por pregunta (puede editarse)
- Solo el autor de la pregunta puede marcar como "mejor"
- Se pueden votar por cualquier usuario (excepto el autor)

### Sistema de Reputación
- +5 puntos por voto positivo
- -2 puntos por voto negativo  
- +10 puntos si tu respuesta es marcada como "mejor"

### Roles de Usuario
- **Usuario**: Funcionalidades básicas
- **Moderador**: Revisar reportes (opcional)
- **Admin**: Acceso completo al panel de administración

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone [repo-url]
cd foro-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter
```

## 🔧 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz:
```env
VITE_API_URL=http://localhost:8000/api
```

### Configuración de Axios
El cliente HTTP está configurado en `src/api/axios.ts` con:
- Base URL automática
- Interceptores para tokens de autenticación
- Manejo de errores

## 📱 Páginas y Rutas

### Rutas Públicas
- `/` - Página principal con últimas preguntas
- `/login` - Inicio de sesión
- `/register` - Registro de usuario
- `/questions/:id` - Detalle de pregunta
- `/categories` - Lista de categorías
- `/search` - Búsqueda avanzada

### Rutas Protegidas (requieren autenticación)
- `/ask` - Crear nueva pregunta
- `/profile` - Perfil del usuario
- `/favorites` - Preguntas favoritas

### Rutas de Administrador
- `/admin` - Panel principal con estadísticas
- `/admin/users` - Gestión de usuarios
- `/admin/categories` - Gestión de categorías
- `/admin/tags` - Gestión de etiquetas
- `/admin/reports` - Moderación de reportes

## 🎨 Componentes Principales

### QuestionCard
Tarjeta para mostrar preguntas en listas con:
- Información básica de la pregunta
- Tags y categoría
- Botones de votación
- Contador de respuestas

### VoteButtons  
Sistema de votación para preguntas y respuestas:
- Botones +1/-1
- Contador de votos actual
- Integración con backend

### AnswerCard
Componente para mostrar respuestas:
- Contenido de la respuesta
- Botones de votación
- Opción "marcar como mejor" (solo para autor de pregunta)
- Botón de reporte

### ProtectedRoute
Wrapper para rutas que requieren autenticación o roles específicos.

## 🔐 Sistema de Autenticación

### Flujo de Autenticación
1. Usuario inicia sesión → obtiene token JWT
2. Token se guarda en localStorage
3. Se incluye en todas las peticiones HTTP
4. Verificación automática al cargar la app

### Gestión de Estado
- Hook `useAuth` maneja estado global del usuario
- Persistencia automática entre sesiones
- Logout limpia token y estado

## 🎯 Hooks Personalizados

### useAuth
- Gestión completa de autenticación
- Login, registro, logout
- Estado del usuario actual

### useQuestions  
- CRUD de preguntas
- Búsqueda y filtrado
- Carga de preguntas por ID

### useAnswers
- Crear respuestas
- Marcar como mejor respuesta

### useVoting
- Sistema de votación
- Soporte para preguntas y respuestas

### useFavorites
- Añadir/quitar favoritos
- Verificar estado de favorito

### useReports
- Reportar contenido inapropiado

## 🚀 Integración con Backend

### API Endpoints Esperados
```
# Autenticación
POST /auth/login
POST /auth/register  
POST /auth/logout
GET  /auth/me

# Preguntas
GET    /public/questions
GET    /public/questions/:id
POST   /questions
PUT    /questions/:id
DELETE /questions/:id

# Respuestas
POST   /answers
PUT    /answers/:id/mark-as-best

# Votación
POST   /votes

# Favoritos
GET    /favorites
POST   /favorites
DELETE /favorites/:questionId

# Reportes
POST   /reports
GET    /admin/reports
PUT    /admin/reports/:id

# Admin
GET /admin/stats
GET /admin/users
GET /admin/categories
GET /admin/tags
```

## 🎨 Estilos y UI

### Tailwind CSS
- Framework CSS utility-first
- Configuración personalizada en `tailwind.config.js`
- Componentes UI reutilizables

### Tema de Colores
- Primario: Azul (`blue-600`)
- Secundario: Gris (`gray-500`) 
- Éxito: Verde (`green-600`)
- Error: Rojo (`red-600`)

## 📱 Responsive Design

La aplicación está optimizada para:
- Desktop (lg: 1024px+)
- Tablet (md: 768px - 1023px)
- Mobile (sm: 640px - 767px)

Componentes clave como Navbar incluyen menú móvil hamburguesa.

## 🔍 Funcionalidades Avanzadas

### Búsqueda
- Búsqueda por texto libre
- Filtros por categoría y tags
- Ordenamiento por fecha/votos

### Sistema de Reputación
- Cálculo automático basado en votos
- Visualización en perfil de usuario

### Moderación
- Reportes de contenido
- Panel de administración
- Estados de revisión

## 🧪 Testing y Calidad

### ESLint
Configuración incluida para:
- Reglas de React
- TypeScript strict
- Hooks rules

### TypeScript
- Tipado estricto
- Interfaces definidas en `types/`
- Props y estado tipados

## 🚀 Deployment

### Build de Producción
```bash
npm run build
```

Genera carpeta `dist/` con archivos optimizados.

### Variables de Entorno de Producción
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## 🤝 Contribución

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🙏 Créditos

Desarrollado como sistema académico de preguntas y respuestas, inspirado en Stack Overflow y plataformas similares.
