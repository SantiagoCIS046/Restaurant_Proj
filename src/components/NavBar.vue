<template>
  <nav class="navbar" :class="{ 'has-subnav': props.currentView === 'gestion' }">
    <div class="navbar-container">
      <div class="logo" @click="navigateTo('dashboard')">
        <div class="logo-text">
          <span class="brand-name">Mi Restaurante</span>
        </div>
      </div>

      <!-- Desktop Navigation -->
      <div class="nav-links desktop-menu">
        <router-link to="/restaurant" class="main-nav-item" :class="{ active: isActive('/restaurant') }">
          <div class="item-icon-wrapper">
            <i class="fas fa-th-large"></i>
          </div>
          <span>MESAS</span>
        </router-link>
        <router-link to="/registro" class="main-nav-item" :class="{ active: isActive('/registro') }">
          <div class="item-icon-wrapper">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <span>REGISTRO</span>
        </router-link>
        <router-link to="/menu" class="main-nav-item" :class="{ active: isActive('/menu') }">
          <div class="item-icon-wrapper">
            <i class="fas fa-utensils"></i>
          </div>
          <span>MENÚ</span>
        </router-link>
        <router-link to="/clientes" class="main-nav-item" :class="{ active: isActive('/clientes') }">
          <div class="item-icon-wrapper">
            <i class="fas fa-users"></i>
          </div>
          <span>CLIENTES</span>
        </router-link>
        
        <template v-if="isAdmin">
          <router-link to="/pedidos" class="main-nav-item" :class="{ active: isActive('/pedidos') }">
            <div class="item-icon-wrapper">
              <i class="fas fa-shopping-cart"></i>
            </div>
            <span>PEDIDOS</span>
          </router-link>
          <router-link to="/inventario" class="main-nav-item" :class="{ active: isActive('/inventario') }">
            <div class="item-icon-wrapper">
              <i class="fas fa-box"></i>
            </div>
            <span>INVENTARIO</span>
          </router-link>
          <router-link to="/personal" class="main-nav-item" :class="{ active: isActive('/personal') }">
            <div class="item-icon-wrapper">
              <i class="fas fa-user-tie"></i>
            </div>
            <span>PERSONAL</span>
          </router-link>
          <router-link to="/finanzas" class="main-nav-item" :class="{ active: isActive('/finanzas') }">
            <div class="item-icon-wrapper">
              <i class="fas fa-chart-line"></i>
            </div>
            <span>FINANZAS</span>
          </router-link>
        </template>

        <router-link to="/configuracion" class="main-nav-item" :class="{ active: isActive('/configuracion') }">
          <div class="item-icon-wrapper">
            <i class="fas fa-cog"></i>
          </div>
          <span>CONFIG</span>
        </router-link>
      </div>

      <!-- User Info & Actions -->
      <div class="navbar-actions">
        <div class="user-profile" v-if="user" @click="toggleDropdown">
          <div class="user-info-text">
            <span class="user-name">{{ user.name }}</span>
          </div>
          <div class="user-avatar">
            <img v-if="user.avatar" :src="user.avatar" alt="Avatar" />
            <div v-else class="avatar-placeholder">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
          </div>
        </div>

        <!-- Logout / Profile Dropdown -->
        <transition name="dropdown-fade">
          <div v-if="showDropdown" class="profile-dropdown">
            <button @click="navigateTo('perfil')" class="dropdown-item">
              <i class="fas fa-user-circle"></i> Mi Perfil
            </button>
            <button @click="handleLogout" class="dropdown-item logout-item">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Sub Nav Bar (Integrated) -->
    <transition name="slide-down">
      <div v-if="props.currentView === 'gestion'" class="sub-nav-wrapper">
        <div class="sub-nav-container">
          <div class="sub-nav-tabs">
            <button 
              v-for="tab in ['mesas', 'mostrador', 'domicilio', 'mostraplus']"
              :key="tab"
              class="sub-tab" 
              :class="{ active: props.subView === tab }" 
              @click="subNavigate(tab)"
            >
              {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
            </button>
          </div>

          <div class="sub-nav-right">
            <div class="sub-nav-search">
              <div class="search-input-wrapper">
                <i class="fas fa-search"></i>
                <input 
                  type="text" 
                  :value="search" 
                  @input="$emit('update:search', $event.target.value)" 
                  placeholder="Buscar mesa..." 
                />
              </div>
            </div>
            
            <div class="sub-nav-actions">
              <button class="sub-action-btn">
                <i class="far fa-bell"></i>
              </button>
              <button class="sub-action-btn">
                <i class="far fa-user-circle"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useSettings } from "../composables/useSettings";
import { useAuth } from "../composables/useAuth";

const route = useRoute();
const { settings, t } = useSettings();

const isActive = (path) => route.path === path;

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
  showDropdown.value = false;
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

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: #ffffff;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  transition: none;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 1.5rem;
  width: 100%;
}

/* Logo Styling */
.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0047ab;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 100%;
}

.main-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0 0.25rem;
  height: 56px;
  justify-content: center;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.item-icon-wrapper {
  font-size: 1rem;
}

.main-nav-item span {
  font-size: 0.6rem;
  font-weight: 700;
}

.main-nav-item:hover {
  color: #0047ab;
}

.main-nav-item.active {
  color: #0047ab;
  border-bottom-color: #0047ab;
}

/* User Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.user-info-text {
  text-align: right;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* Dropdown Menu */
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.5rem;
  width: 180px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 1rem;
  background: transparent;
  border: none;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #0047ab;
}

/* Sub-nav Styling */
.sub-nav-wrapper {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}

.sub-nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 1.5rem;
  width: 100%;
}

.sub-nav-tabs {
  display: flex;
  gap: 1rem;
}

.sub-tab {
  background: transparent;
  border: none;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tab.active {
  background: #0047ab;
  color: #fff;
}

.sub-nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.sub-nav-search {
  position: relative;
}

.sub-nav-search input {
  background: #f1f5f9;
  border: none;
  border-radius: 20px;
  padding: 0.35rem 1rem 0.35rem 2.2rem;
  font-size: 0.75rem;
  width: 180px;
  color: #1e293b;
}

.sub-nav-search input:focus {
  outline: none;
  background: #e2e8f0;
}

.search-input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 1;
}

.sub-nav-actions {
  display: flex;
  gap: 0.75rem;
}

.sub-action-btn {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.1rem;
  cursor: pointer;
}

/* Transitions */
.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
