#!/bin/bash

# Script para manejo del frontend Docker

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones de utilidad
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Docker está ejecutándose
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker no está ejecutándose"
        exit 1
    fi
}

# Build de la imagen
build() {
    log_info "Construyendo imagen del frontend..."
    docker build -t foro-frontend:latest .
    log_success "Imagen construida exitosamente"
}

# Ejecutar en desarrollo
dev() {
    log_info "Iniciando frontend en modo desarrollo..."
    docker-compose up --build
}

# Ejecutar en producción
prod() {
    log_info "Iniciando frontend en modo producción..."
    docker-compose up -d --build
    log_success "Frontend ejecutándose en http://localhost:3000"
}

# Detener contenedores
stop() {
    log_info "Deteniendo contenedores..."
    docker-compose down
    log_success "Contenedores detenidos"
}

# Limpiar imágenes y contenedores
clean() {
    log_warning "Limpiando imágenes y contenedores..."
    docker-compose down --rmi all --volumes --remove-orphans
    docker system prune -f
    log_success "Limpieza completada"
}

# Ver logs
logs() {
    docker-compose logs -f foro-frontend
}

# Estado de contenedores
status() {
    log_info "Estado de contenedores:"
    docker-compose ps
}

# Health check
health() {
    log_info "Verificando salud del contenedor..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "Frontend está funcionando correctamente"
    else
        log_error "Frontend no responde"
        exit 1
    fi
}

# Mostrar ayuda
help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build     Construir imagen Docker"
    echo "  dev       Ejecutar en modo desarrollo"
    echo "  prod      Ejecutar en modo producción"
    echo "  stop      Detener contenedores"
    echo "  clean     Limpiar imágenes y contenedores"
    echo "  logs      Ver logs en tiempo real"
    echo "  status    Ver estado de contenedores"
    echo "  health    Verificar salud del servicio"
    echo "  help      Mostrar esta ayuda"
}

# Verificar Docker al inicio
check_docker

# Procesar argumentos
case "${1:-help}" in
    build)
        build
        ;;
    dev)
        dev
        ;;
    prod)
        prod
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    logs)
        logs
        ;;
    status)
        status
        ;;
    health)
        health
        ;;
    help|*)
        help
        ;;
esac
