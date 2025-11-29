<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import NavBar from "./components/NavBar.vue";

// Composables de Vue Router
const router = useRouter();
const route = useRoute();

// Estado para sub-vistas (si es necesario mantener esta funcionalidad)
const subView = ref("mesas");

// Computed para obtener la vista actual desde la ruta
const currentView = computed(() => {
  const routeName = route.name;
  if (routeName === "Gestion") return "gestion";
  return routeName ? routeName.toLowerCase() : "gestion";
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
    :current-view="currentView"
    @navigate="handleNavigate"
    @sub-navigate="handleSubNavigate"
  />
  <!-- RouterView renderiza el componente correspondiente a la ruta actual -->
  <router-view :sub-view="subView" />
</template>

<style scoped></style>
