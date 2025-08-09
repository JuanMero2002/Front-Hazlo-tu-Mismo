# 🐳 Docker Setup - Frontend

Este documento explica cómo dockerizar y ejecutar el frontend del Foro Académico.

## 📋 Prerrequisitos

- Docker Desktop instalado y ejecutándose
- Backend ejecutándose en puerto 8080
- Node.js 18+ (para desarrollo local)

## 🚀 Inicio Rápido

### Usando PowerShell (Windows)
```powershell
# Construir y ejecutar en producción
.\docker.ps1 prod

# Ver logs
.\docker.ps1 logs

# Detener
.\docker.ps1 stop
```

### Usando Bash (Linux/Mac)
```bash
# Dar permisos de ejecución
chmod +x docker.sh

# Construir y ejecutar en producción
./docker.sh prod

# Ver logs
./docker.sh logs

# Detener
./docker.sh stop
```

### Usando Docker Compose directamente
```bash
# Producción (en background)
docker-compose up -d --build

# Desarrollo (con logs)
docker-compose up --build

# Detener
docker-compose down
```

## 🔧 Configuración

### Estructura de archivos Docker
```
foro-frontend/
├── Dockerfile              # Imagen multi-stage con Node + Nginx
├── docker-compose.yml      # Configuración de servicios
├── nginx.conf              # Configuración principal de Nginx
├── default.conf            # Configuración del servidor virtual
├── .dockerignore           # Archivos excluidos del build
├── .env.docker             # Variables de entorno
├── docker.ps1              # Script PowerShell para Windows
└── docker.sh               # Script Bash para Linux/Mac
```

### Variables de entorno importantes
- `VITE_API_URL`: URL del API backend (default: http://localhost:8080/api)
- `NODE_ENV`: Entorno de ejecución (production)

## 🌐 Puertos y URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Health Check**: http://localhost:3000/health

## 📦 Arquitectura Docker

### Multi-stage Build
1. **Stage 1**: Build de la aplicación React con Node.js
2. **Stage 2**: Servir archivos estáticos con Nginx

### Nginx Configuration
- Proxy al backend en `/api/*`
- Servir archivos estáticos optimizados
- Compresión gzip habilitada
- Cache headers configurados
- Security headers incluidos

### Networking
- Comunicación con backend via `host.docker.internal:8080`
- Red externa: `foro_academico_default`
- Health checks cada 30 segundos

## 🛠️ Comandos Disponibles

### Scripts PowerShell/Bash
| Comando | Descripción |
|---------|-------------|
| `build` | Construir imagen Docker |
| `dev` | Ejecutar en modo desarrollo |
| `prod` | Ejecutar en modo producción |
| `stop` | Detener contenedores |
| `clean` | Limpiar imágenes y contenedores |
| `logs` | Ver logs en tiempo real |
| `status` | Ver estado de contenedores |
| `health` | Verificar salud del servicio |

### Docker Compose
```bash
# Build y ejecutar
docker-compose up --build

# Solo build
docker-compose build

# Ejecutar en background
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener y limpiar
docker-compose down --volumes
```

## 🔍 Troubleshooting

### El frontend no puede conectar al backend
1. Verificar que el backend esté ejecutándose en puerto 8080:
   ```bash
   docker ps -a | grep foro
   ```

2. Verificar la configuración de proxy en `default.conf`

3. Revisar logs del contenedor:
   ```bash
   docker-compose logs foro-frontend
   ```

### Error de build de Docker
1. Limpiar cache de Docker:
   ```bash
   docker system prune -f
   ```

2. Reconstruir sin cache:
   ```bash
   docker-compose build --no-cache
   ```

### Problemas de permisos (Linux/Mac)
```bash
# Dar permisos al script
chmod +x docker.sh

# Si hay problemas con nginx user
sudo chown -R $(whoami):$(whoami) ./logs
```

## 📊 Monitoreo

### Health Checks
El contenedor incluye health checks automáticos:
- Endpoint: `/health`
- Intervalo: 30 segundos
- Timeout: 10 segundos
- Reintentos: 3

### Logs
Los logs de Nginx se persisten en `./logs/`:
- `access.log`: Logs de acceso
- `error.log`: Logs de errores

## 🔄 Desarrollo vs Producción

### Desarrollo Local (sin Docker)
```bash
npm install
npm run dev
# Ejecuta en http://localhost:5173
```

### Desarrollo con Docker
```bash
.\docker.ps1 dev
# Ejecuta con hot reload
```

### Producción
```bash
.\docker.ps1 prod
# Build optimizado + Nginx
# Ejecuta en http://localhost:3000
```

## 🚀 Deployment

Para deployment en producción:

1. Ajustar variables de entorno en `.env.docker`
2. Configurar URL del backend en producción
3. Ejecutar build de producción:
   ```bash
   docker-compose up -d --build
   ```

## 🔐 Seguridad

El setup incluye:
- Usuario no-root en el contenedor
- Security headers en Nginx
- Archivos sensibles excluidos via `.dockerignore`
- Health checks para monitoreo
- Límites de memoria y recursos

## 📚 Referencias

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
- [React Deployment](https://create-react-app.dev/docs/deployment/)
