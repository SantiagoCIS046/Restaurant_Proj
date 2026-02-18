// Importación de Vue Router
import { createRouter, createWebHistory } from "vue-router";
import { useAuth } from "../composables/useAuth";

// Importación de componentes
import Login from "../components/Login.vue";
import Restaurant from "../components/Restaurant.vue";
import Registro from "../components/Registro.vue";
import Usuarios from "../components/Usuarios.vue"; // New Component
import Menu from "../components/Menu.vue";
import Clientes from "../components/Clientes.vue";

import Inventario from "../components/Inventario.vue";
import Personal from "../components/Personal.vue";
import Pedidos from "../components/Pedidos.vue";
import Finanzas from "../components/Finanzas.vue";
import Caracteristicas from "../components/Caracteristicas.vue";

// Definición de rutas de la aplicación
const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Iniciar Sesión",
      description: "Ingreso al sistema",
      public: true
    }
  },
  {
    path: "/",
    redirect: "/gestion", // Redirección a la página principal
  },
  {
    path: "/gestion",
    name: "Gestion",
    component: Restaurant,
    meta: {
      title: "Gestión de Restaurant",
      description: "Gestión de mesas y reservas del restaurant",
    },
  },
  {
    path: "/registro",
    name: "Registro",
    component: Registro,
    meta: {
      title: "Registro",
      description: "Registro de nuevos usuarios y datos",
    },
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
    meta: {
      title: "Menú",
      description: "Gestión del menú del restaurant",
    },
  },
  {
    path: "/clientes",
    name: "Clientes",
    component: Clientes,
    meta: {
      title: "Clientes",
      description: "Gestión de clientes del restaurant",
    },
  },

  {
    path: "/inventario",
    name: "Inventario",
    component: Inventario,
    meta: {
      title: "Inventario",
      description: "Control de inventario y stock",
    },
  },
  {
    path: "/personal",
    name: "Personal",
    component: Personal,
    meta: {
      title: "Personal",
      description: "Gestión del personal del restaurant",
    },
  },
  {
    path: "/pedidos",
    name: "Pedidos",
    component: Pedidos,
    meta: {
      title: "Pedidos",
      description: "Gestión de pedidos y órdenes",
    },
  },
  {
    path: "/finanzas",
    name: "Finanzas",
    component: Finanzas,
    meta: {
      title: "Finanzas",
      description: "Control financiero y contabilidad",
    },
  },
  {
    path: "/configuracion",
    name: "Configuracion",
    component: Caracteristicas,
    meta: {
      title: "Configuración",
      description: "Configuración y características del sistema",
    },
  },
  {
    path: "/usuarios", // Add path if not exists or find existing
    name: "Usuarios",
    component: Usuarios,
    meta: {
      title: "Gestión de Usuarios",
      description: "Administración de usuarios del sistema",
      requiresAdmin: true
    }
  },
  {
    // Ruta 404 - Página no encontrada
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    redirect: "/gestion",
  },
];

// Creación del router con historial web
const router = createRouter({
  history: createWebHistory(),
  routes,
  // Comportamiento del scroll al cambiar de ruta
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Guard de navegación global - Se ejecuta antes de cada cambio de ruta
// Guard de navegación global - Se ejecuta antes de cada cambio de ruta
router.beforeEach((to, from, next) => {
  const { isAuthenticated, isAdmin } = useAuth(); // Destructure isAdmin as well

  // Actualizar el título de la página según la ruta
  if (to.meta.title) {
    document.title = `${to.meta.title} - Restaurant App`;
  } else {
    document.title = "Restaurant App";
  }

  // Verificación de autenticación y roles
  if (to.meta.requiresAdmin && !isAdmin.value) {
    // If route requires admin and user is not admin, redirect to management or login
    if (isAuthenticated.value) {
      next('/gestion');
    } else {
      next('/login');
    }
  } else if (!to.meta.public && !isAuthenticated.value) {
    next('/login');
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/gestion');
  } else {
    next();
  }
});

// Exportación del router
export default router;
