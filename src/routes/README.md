# Estructura de Rutas

Esta carpeta contiene toda la configuración de rutas de la aplicación, organizada de manera modular y escalable.

## Archivos

### `index.tsx`
Archivo principal que exporta el componente `AppRoutes`. Este componente combina todas las rutas de la aplicación.

### `publicRoutes.tsx`
Contiene todas las rutas que no requieren autenticación:
- `/` - Página principal
- `/login` - Página de inicio de sesión
- `/register` - Página de registro
- `/questions/:id` - Detalle de pregunta
- `/categories` - Explorar categorías
- `/search` - Búsqueda

### `protectedRoutes.tsx`
Rutas que requieren autenticación:
- `/ask` - Crear pregunta
- `/profile` - Perfil del usuario
- `/favorites` - Favoritos del usuario

### `adminRoutes.tsx`
Rutas que requieren permisos de administrador:
- `/admin/*` - Panel de administración

### `routeConfig.ts`
Configuración centralizada de rutas con metadatos útiles como títulos, descripciones y permisos requeridos.

## Ventajas de esta estructura

1. **Separación clara**: Cada tipo de ruta está en su propio archivo
2. **Escalabilidad**: Fácil agregar nuevas rutas sin tocar otros archivos
3. **Mantenibilidad**: Cambios en un tipo de ruta no afectan otros
4. **Configuración centralizada**: Metadatos de rutas en un solo lugar
5. **App.tsx limpio**: Solo maneja providers y configuración principal

## Uso

Para agregar una nueva ruta:
1. Agrégala al archivo correspondiente (`publicRoutes.tsx`, `protectedRoutes.tsx`, etc.)
2. Opcionalmente, agrega su configuración en `routeConfig.ts`
3. Las rutas se incluyen automáticamente en la aplicación

## Ejemplo de nueva ruta pública

```tsx
// En publicRoutes.tsx
<Route key="about" path="/about" element={<AboutPage />} />,
```

## Ejemplo de nueva ruta protegida

```tsx
// En protectedRoutes.tsx
<Route 
  key="settings" 
  path="/settings" 
  element={
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  } 
/>,
```
