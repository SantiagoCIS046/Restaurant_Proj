# 📍 Documentación de Rutas - Restaurant App

## Resumen de Implementación

Se ha implementado **Vue Router 4** para gestionar la navegación de la aplicación de manera profesional y organizada.

---

## 🗺️ Rutas Disponibles

### Ruta Principal

- **URL**: `/`
- **Acción**: Redirecciona automáticamente a `/gestion`

### 1. Gestión de Restaurant

- **URL**: `/gestion`
- **Nombre**: `Gestion`
- **Componente**: `Restaurant.vue`
- **Descripción**: Página principal para la gestión de mesas y reservas del restaurant

### 2. Registro

- **URL**: `/registro`
- **Nombre**: `Registro`
- **Componente**: `Registro.vue`
- **Descripción**: Registro de nuevos usuarios y datos

### 3. Menú

- **URL**: `/menu`
- **Nombre**: `Menu`
- **Componente**: `Menu.vue`
- **Descripción**: Gestión del menú del restaurant

### 4. Clientes

- **URL**: `/clientes`
- **Nombre**: `Clientes`
- **Componente**: `Clientes.vue`
- **Descripción**: Gestión de clientes del restaurant

### 5. Reportes

- **URL**: `/reportes`
- **Nombre**: `Reportes`
- **Componente**: `Reportes.vue`
- **Descripción**: Reportes y estadísticas del restaurant

### 6. Inventario

- **URL**: `/inventario`
- **Nombre**: `Inventario`
- **Componente**: `Inventario.vue`
- **Descripción**: Control de inventario y stock

### 7. Personal

- **URL**: `/personal`
- **Nombre**: `Personal`
- **Componente**: `Personal.vue`
- **Descripción**: Gestión del personal del restaurant

### 8. Pedidos

- **URL**: `/pedidos`
- **Nombre**: `Pedidos`
- **Componente**: `Pedidos.vue`
- **Descripción**: Gestión de pedidos y órdenes

### 9. Finanzas

- **URL**: `/finanzas`
- **Nombre**: `Finanzas`
- **Componente**: `Finanzas.vue`
- **Descripción**: Control financiero y contabilidad

### 10. Características

- **URL**: `/caracteristicas`
- **Nombre**: `Caracteristicas`
- **Componente**: `Caracteristicas.vue`
- **Descripción**: Características y configuración del sistema

### Ruta 404

- **URL**: Cualquier ruta no definida
- **Acción**: Redirecciona automáticamente a `/gestion`

---

## 🔧 Características Implementadas

### 1. Metadata en Rutas

Cada ruta incluye metadata con:

- `title`: Título de la página
- `description`: Descripción de la funcionalidad

### 2. Guard de Navegación Global

- Se ejecuta antes de cada cambio de ruta
- Actualiza automáticamente el título del navegador
- Formato: `[Título de la Ruta] - Restaurant App`

### 3. Scroll Behavior

- Al navegar a una nueva ruta, la página se desplaza automáticamente al inicio
- Si existe una posición guardada (navegación con botones del navegador), se restaura

### 4. Historial Web

- Utiliza `createWebHistory()` para URLs limpias sin hash (#)
- Ejemplo: `http://localhost:3001/menu` en lugar de `http://localhost:3001/#/menu`

---

## 📁 Estructura de Archivos

```
src/
├── routes/
│   └── route.js          # Configuración central de todas las rutas
├── components/
│   ├── Restaurant.vue    # Componente de gestión
│   ├── Registro.vue      # Componente de registro
│   ├── Menu.vue          # Componente de menú
│   ├── Clientes.vue      # Componente de clientes
│   ├── Reportes.vue      # Componente de reportes
│   ├── Inventario.vue    # Componente de inventario
│   ├── Personal.vue      # Componente de personal
│   ├── Pedidos.vue       # Componente de pedidos
│   ├── Finanzas.vue      # Componente de finanzas
│   └── Caracteristicas.vue # Componente de características
├── App.vue               # Componente principal con <router-view>
└── main.js               # Punto de entrada con router integrado
```

---

## 💻 Uso en el Código

### Navegación Programática

```javascript
import { useRouter } from "vue-router";

const router = useRouter();

// Navegar a una ruta
router.push("/menu");

// Navegar con nombre de ruta
router.push({ name: "Menu" });
```

### Obtener Ruta Actual

```javascript
import { useRoute } from "vue-router";

const route = useRoute();

// Obtener nombre de la ruta actual
console.log(route.name);

// Obtener path de la ruta actual
console.log(route.path);
```

### Router Links en Template

```vue
<template>
  <!-- Navegación declarativa -->
  <router-link to="/menu">Ir al Menú</router-link>

  <!-- Con nombre de ruta -->
  <router-link :to="{ name: 'Menu' }">Ir al Menú</router-link>
</template>
```

---

## 🚀 Cómo Probar

1. **Iniciar el servidor de desarrollo**:

   ```bash
   npm run dev
   ```

2. **Abrir el navegador** en `http://localhost:3001/`

3. **Probar las rutas** navegando a:

   - `http://localhost:3001/gestion`
   - `http://localhost:3001/menu`
   - `http://localhost:3001/clientes`
   - etc.

4. **Verificar funcionalidades**:
   - ✅ La navegación cambia la URL
   - ✅ El título de la página se actualiza
   - ✅ Los componentes se cargan correctamente
   - ✅ Las rutas no válidas redirigen a `/gestion`

---

## 📝 Notas Importantes

- **Compatibilidad**: El sistema mantiene la funcionalidad de sub-vistas existente mediante la prop `:sub-view`
- **Comentarios**: Todo el código en `route.js` está comentado en español
- **Extensibilidad**: Es fácil agregar nuevas rutas siguiendo el patrón establecido
- **SEO Friendly**: Los títulos dinámicos mejoran el SEO de la aplicación

---

## 🔄 Mejoras Futuras Sugeridas

1. **Lazy Loading**: Cargar componentes bajo demanda para mejorar el rendimiento inicial

   ```javascript
   component: () => import("../components/Menu.vue");
   ```

2. **Rutas Anidadas**: Para sub-secciones específicas

   ```javascript
   {
     path: '/gestion',
     component: Restaurant,
     children: [
       { path: 'mesas', component: Mesas },
       { path: 'reservas', component: Reservas }
     ]
   }
   ```

3. **Transiciones**: Animaciones entre cambios de ruta

   ```vue
   <router-view v-slot="{ Component }">
     <transition name="fade">
       <component :is="Component" />
     </transition>
   </router-view>
   ```

4. **Guards de Autenticación**: Proteger rutas que requieren login
   ```javascript
   beforeEnter: (to, from, next) => {
     if (isAuthenticated()) {
       next();
     } else {
       next("/login");
     }
   };
   ```
