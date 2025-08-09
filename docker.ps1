# Script PowerShell para manejo del frontend Docker

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Colores para output
$Red = [ConsoleColor]::Red
$Green = [ConsoleColor]::Green
$Yellow = [ConsoleColor]::Yellow
$Blue = [ConsoleColor]::Blue

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Verificar si Docker está ejecutándose
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker no está ejecutándose"
        return $false
    }
}

# Build de la imagen
function Build-Image {
    Write-Info "Construyendo imagen del frontend..."
    docker build -t foro-frontend:latest .
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Imagen construida exitosamente"
    }
    else {
        Write-Error "Error al construir la imagen"
        exit 1
    }
}

# Ejecutar en desarrollo
function Start-Dev {
    Write-Info "Iniciando frontend en modo desarrollo..."
    docker-compose up --build
}

# Ejecutar en producción
function Start-Prod {
    Write-Info "Iniciando frontend en modo producción..."
    docker-compose up -d --build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Frontend ejecutándose en http://localhost:3000"
    }
}

# Detener contenedores
function Stop-Containers {
    Write-Info "Deteniendo contenedores..."
    docker-compose down
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Contenedores detenidos"
    }
}

# Limpiar imágenes y contenedores
function Clear-Docker {
    Write-Warning "Limpiando imágenes y contenedores..."
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    Write-Success "Limpieza completada"
}

# Ver logs
function Show-Logs {
    docker-compose logs -f foro-frontend
}

# Estado de contenedores
function Show-Status {
    Write-Info "Estado de contenedores:"
    docker-compose ps
}

# Health check
function Test-Health {
    Write-Info "Verificando salud del contenedor..."
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Success "Frontend está funcionando correctamente"
        }
        else {
            Write-Error "Frontend no responde correctamente"
        }
    }
    catch {
        Write-Error "Frontend no responde"
    }
}

# Mostrar ayuda
function Show-Help {
    Write-Host "Uso: .\docker.ps1 [COMANDO]"
    Write-Host ""
    Write-Host "Comandos disponibles:"
    Write-Host "  build     Construir imagen Docker"
    Write-Host "  dev       Ejecutar en modo desarrollo"
    Write-Host "  prod      Ejecutar en modo producción"
    Write-Host "  stop      Detener contenedores"
    Write-Host "  clean     Limpiar imágenes y contenedores"
    Write-Host "  logs      Ver logs en tiempo real"
    Write-Host "  status    Ver estado de contenedores"
    Write-Host "  health    Verificar salud del servicio"
    Write-Host "  help      Mostrar esta ayuda"
}

# Verificar Docker al inicio
if (-not (Test-Docker)) {
    exit 1
}

# Procesar comandos
switch ($Command.ToLower()) {
    "build" { Build-Image }
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "stop" { Stop-Containers }
    "clean" { Clear-Docker }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "health" { Test-Health }
    default { Show-Help }
}
