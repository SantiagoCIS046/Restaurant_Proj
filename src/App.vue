<script setup>
import { ref } from "vue";
import NavBar from "./components/NavBar.vue";
import Restaurant from "./components/Restaurant.vue";
import Registro from "./components/Registro.vue";
import Menu from "./components/Menu.vue";
import Clientes from "./components/Clientes.vue";
import Reportes from "./components/Reportes.vue";
import Inventario from "./components/Inventario.vue";
import Personal from "./components/Personal.vue";
import Pedidos from "./components/Pedidos.vue";
import Finanzas from "./components/Finanzas.vue";
import Caracteristicas from "./components/Caracteristicas.vue";

const currentView = ref("gestion");
const subView = ref("mesas");

const components = {
  gestion: Restaurant,
  registro: Registro,
  menu: Menu,
  clientes: Clientes,
  reportes: Reportes,
  inventario: Inventario,
  personal: Personal,
  pedidos: Pedidos,
  finanzas: Finanzas,
  caracteristicas: Caracteristicas,
};

const handleNavigate = (section) => {
  currentView.value = section;
  subView.value = "mesas"; // Reset sub-view on main navigation
};

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
  <component :is="components[currentView]" :sub-view="subView" />
</template>

<style scoped></style>
