<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="logo">
        <i class="fas fa-utensils"></i>
        <span class="brand-text">Mi Restaurante</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="nav-links desktop-menu">
        <router-link to="/restaurant" class="main-nav-item" :class="{ active: isActive('/restaurant') }">
          <i class="fas fa-th-large"></i>
          <span>MESAS</span>
        </router-link>
        <router-link to="/registro" class="main-nav-item" :class="{ active: isActive('/registro') }">
          <i class="fas fa-clipboard-list"></i>
          <span>REGISTRO</span>
        </router-link>
        <router-link to="/menu" class="main-nav-item" :class="{ active: isActive('/menu') }">
          <i class="fas fa-utensils"></i>
          <span>MENÚ</span>
        </router-link>
        <router-link to="/clientes" class="main-nav-item" :class="{ active: isActive('/clientes') }">
          <i class="fas fa-users"></i>
          <span>CLIENTES</span>
        </router-link>
        
        <template v-if="isAdmin">
          <router-link to="/pedidos" class="main-nav-item" :class="{ active: isActive('/pedidos') }">
            <i class="fas fa-shopping-basket"></i>
            <span>PEDIDOS</span>
          </router-link>
          <router-link to="/inventario" class="main-nav-item" :class="{ active: isActive('/inventario') }">
            <i class="fas fa-box"></i>
            <span>INVENTARIO</span>
          </router-link>
          <router-link to="/personal" class="main-nav-item" :class="{ active: isActive('/personal') }">
            <i class="fas fa-user-tie"></i>
            <span>PERSONAL</span>
          </router-link>
          <router-link to="/finanzas" class="main-nav-item" :class="{ active: isActive('/finanzas') }">
            <i class="fas fa-chart-line"></i>
            <span>FINANZAS</span>
          </router-link>
        </template>

        <router-link to="/configuracion" class="main-nav-item" :class="{ active: isActive('/configuracion') }">
          <i class="fas fa-cog"></i>
          <span>CONFIGURACIÓN</span>
        </router-link>
      </div>

      <!-- User Info (Minimal Right) -->
      <div class="user-profile-simple" v-if="user">
        <span class="user-role-label">{{ user.name }}</span>
        <div class="user-avatar-outline">
          <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
          <i v-else class="fas fa-user"></i>
        </div>
      </div>
    </div>
  </nav>

  <!-- Sub Nav Bar -->
  <div v-if="props.currentView === 'gestion'" class="sub-nav-bar">
    <div class="sub-nav-container">
      <div class="sub-nav-tabs">
        <button 
          class="sub-tab" 
          :class="{ active: props.subView === 'mesas' }" 
          @click="subNavigate('mesas')"
        >Mesas</button>
        <button 
          class="sub-tab" 
          :class="{ active: props.subView === 'mostrador' }" 
          @click="subNavigate('mostrador')"
        >Mostrador</button>
        <button 
          class="sub-tab" 
          :class="{ active: props.subView === 'domicilio' }" 
          @click="subNavigate('domicilio')"
        >Domicilio</button>
        <button 
          class="sub-tab" 
          :class="{ active: props.subView === 'mostraplus' }" 
          @click="subNavigate('mostraplus')"
        >MostraPlus</button>
      </div>

      <div class="sub-nav-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            :value="search" 
            @input="$emit('update:search', $event.target.value)" 
            placeholder="Buscar mesa..." 
          />
        </div>
        <button class="icon-btn">
          <i class="far fa-bell"></i>
        </button>
        <button class="icon-btn profile-outline">
          <i class="far fa-user-circle"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const { settings, t } = useSettings();

const isActive = (path) => route.path === path;

const isOpen = ref(false);
const props = defineProps({
  currentView: {
    type: String,
    default: "gestion",
  },
  subView: {
    type: String,
    default: "mesas",
  },
  search: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["navigate", "sub-navigate", "update:search"]);
const { user, isAdmin, logout } = useAuth();
const showDropdown = ref(false);

const navigateTo = (section) => {
  emit("navigate", section);
  showDropdown.value = false; // Close dropdown on navigation
};

const subNavigate = (subSection) => {
  emit("sub-navigate", subSection);
};

const handleLogout = () => {
  logout();
};

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};
</script>

<style scoped>.navbar {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px;
  padding: 0 1.5rem;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0038a8;
  font-weight: 800;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.logo i {
  font-size: 1.35rem;
}

.brand-text {
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
  justify-content: center;
}

.main-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.4rem 0;
  transition: all 0.2s ease;
  min-width: 70px;
  position: relative;
}

.main-nav-item i {
  font-size: 1.25rem;
  margin-bottom: 2px;
}

.main-nav-item:hover {
  color: #1e293b;
}

.main-nav-item.active {
  color: #0038a8;
}

.main-nav-item.active::after {
  content: "";
  position: absolute;
  bottom: -6px;
  left: 0;
  width: 100%;
  height: 3px;
  background: #0038a8;
  border-radius: 3px 3px 0 0;
}

.user-profile-simple {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-role-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.user-avatar-outline {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8fafc;
}

.user-avatar-outline i {
  color: #94a3b8;
}

.user-avatar-outline img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Sub-nav Bar Styles */
.sub-nav-bar {
  display: flex;
  align-items: center;
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  position: fixed;
  top: 60px;
  left: 0;
  z-index: 999;
  height: 54px;
  padding: 0 1.5rem;
}

.sub-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.sub-nav-tabs {
  display: flex;
  gap: 1rem;
}

.sub-tab {
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-tab:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.sub-tab.active {
  background: #0038a8;
  color: #ffffff;
}

.sub-nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-box {
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.9rem;
}

.search-box input {
  padding: 0.5rem 1rem 0.5rem 2.4rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  width: 240px;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  background: #ffffff;
  border-color: #0038a8;
  box-shadow: 0 0 0 4px rgba(0, 56, 168, 0.05);
}

.icon-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  color: #1e293b;
}

.profile-outline {
  font-size: 1.5rem;
}

/* Animations */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Responsive Customization */
@media (max-width: 1024px) {
  .logo span { display: none; }
  .nav-links { gap: 0.5rem; }
  .main-nav-item { min-width: 60px; font-size: 0.6rem; }
  .search-box input { width: 180px; }
}

@media (max-width: 768px) {
  .navbar { padding: 0 1rem; height: 60px; }
  .sub-nav-bar { top: 60px; height: auto; padding: 0.5rem 1rem; }
  .sub-nav-container { flex-direction: column; gap: 1rem; }
  .nav-links { justify-content: flex-start; overflow-x: auto; padding-bottom: 5px; }
  .sub-nav-actions { width: 100%; justify-content: space-between; }
  .search-box { flex: 1; }
  .search-box input { width: 100%; }
}

@media (max-width: 480px) {
  .navbar { height: auto; padding: 0.5rem 1rem; flex-direction: column; gap: 0.5rem; }
  .navbar-container { flex-direction: column; gap: 0.5rem; }
  .nav-links { width: 100%; justify-content: center; }
  .sub-nav-bar { top: unset; position: relative; }
  .sub-tab { padding: 0.4rem 0.75rem; font-size: 0.8rem; }
}
</style>
