<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";
import { useTheme } from "./composables/useTheme";
import { useSettings } from "./composables/useSettings";

// Composables de Vue Router
const router = useRouter();
const route = useRoute();

// Initialize Theme
const { loadTheme } = useTheme();

// Initialize Settings
const { loadSettings, settings } = useSettings();

// Auto Logout Logic
let logoutTimer;
const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes in ms

const resetLogoutTimer = () => {
  if (!settings.security?.autoLogout) return;
  
  clearTimeout(logoutTimer);
  logoutTimer = setTimeout(() => {
    // Perform logout
    console.log("Auto-logout triggered due to inactivity.");
  }, INACTIVITY_LIMIT);
};

const setupActivityListeners = () => {
  window.addEventListener('mousemove', resetLogoutTimer);
  window.addEventListener('keydown', resetLogoutTimer);
  window.addEventListener('click', resetLogoutTimer);
  window.addEventListener('scroll', resetLogoutTimer);
};

const removeActivityListeners = () => {
  window.removeEventListener('mousemove', resetLogoutTimer);
  window.removeEventListener('keydown', resetLogoutTimer);
  window.removeEventListener('click', resetLogoutTimer);
  window.removeEventListener('scroll', resetLogoutTimer);
  clearTimeout(logoutTimer);
};

onMounted(() => {
  loadTheme();
  loadSettings();
  setupActivityListeners();
  resetLogoutTimer(); // Start the timer
});

onUnmounted(() => {
  removeActivityListeners();
});

// Watch for setting change to enable/disable listeners dynamically
watch(() => settings.security?.autoLogout, (enabled) => {
  if (enabled) {
    setupActivityListeners();
    resetLogoutTimer();
  } else {
    removeActivityListeners();
  }
});

// Estado para sub-vistas (si es necesario mantener esta funcionalidad)
const subView = ref("mesas");

// Computed para obtener la vista actual desde la ruta
const currentView = computed(() => {
  const routeName = route.name;
  if (routeName === "Gestion") return "gestion";
  return routeName ? routeName.toLowerCase() : "gestion";
});

const isLoginPage = computed(() => {
  return route.name === 'Login';
});

// Función para navegar entre secciones principales
const handleNavigate = (section) => {
  router.push(`/${section}`);
  subView.value = "mesas"; // Reset sub-view on main navigation
};

// Función para navegar entre sub-secciones
const handleSubNavigate = (subSection) => {
  subView.value = subSection;
};
</script>

<template>
  <NavBar
    v-if="!isLoginPage"
    :current-view="currentView"
    @navigate="handleNavigate"
    @sub-navigate="handleSubNavigate"
  />
  <!-- RouterView renderiza el componente correspondiente a la ruta actual -->
  <router-view :sub-view="subView" />
</template>

<style scoped></style>
