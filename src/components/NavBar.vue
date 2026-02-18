<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo / Brand Section (Optional, keeping as per previous structure but enhanced if needed) -->
      <!-- The user requested the dropdown ON the user logo/info section -->

      <div class="logo">
        <i class="fas fa-utensils"></i>
        <span>{{ settings.general?.name || "Restaurant" }}</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="nav-links desktop-menu">
        <router-link to="/" class="nav-item" :class="{ active: isActive('/') }">
          <i class="fas fa-home"></i> {{ t("dashboard") }}
        </router-link>
        <router-link
          to="/restaurant"
          class="nav-item"
          :class="{ active: isActive('/restaurant') }"
        >
          <i class="fas fa-chair"></i> {{ t("tables") }}
        </router-link>
        <router-link
          to="/registro"
          class="nav-item"
          :class="{ active: isActive('/registro') }"
        >
          <i class="fas fa-clipboard-list"></i> {{ t("register") }}
        </router-link>
        <router-link
          to="/menu"
          class="nav-item"
          :class="{ active: isActive('/menu') }"
        >
          <i class="fas fa-book-open"></i> {{ t("menu") }}
        </router-link>
        <router-link
          to="/clientes"
          class="nav-item"
          :class="{ active: isActive('/clientes') }"
        >
          <i class="fas fa-users"></i> {{ t("clients") }}
        </router-link>

        <!-- Admin Links -->
        <template v-if="isAdmin">
          <router-link
            to="/pedidos"
            class="nav-item"
            :class="{ active: isActive('/pedidos') }"
          >
            <i class="fas fa-shopping-cart"></i> {{ t("orders") }}
          </router-link>
          <router-link
            to="/inventario"
            class="nav-item"
            :class="{ active: isActive('/inventario') }"
          >
            <i class="fas fa-boxes"></i> {{ t("inventory") }}
          </router-link>
          <router-link
            to="/personal"
            class="nav-item"
            :class="{ active: isActive('/personal') }"
          >
            <i class="fas fa-user-tie"></i> {{ t("staff") }}
          </router-link>
          <router-link
            to="/finanzas"
            class="nav-item"
            :class="{ active: isActive('/finanzas') }"
          >
            <i class="fas fa-chart-line"></i> {{ t("finances") }}
          </router-link>
        </template>

        <router-link
          to="/configuracion"
          class="nav-item"
          :class="{ active: isActive('/configuracion') }"
        >
          <i class="fas fa-cogs"></i> {{ t("settings") }}
        </router-link>
      </div>

      <!-- User Profile Dropdown -->
      <div
        class="user-menu"
        v-if="user"
        @MouseEnter="showDropdown = true"
        @MouseLeave="showDropdown = false"
        @click="toggleDropdown"
      >
        <div class="user-info">
          <div class="user-avatar">
            <i
              class="fas"
              :class="user.role === 'admin' ? 'fa-user-tie' : 'fa-user'"
            ></i>
          </div>
          <span class="user-name">{{ user.name }}</span>
          <i class="fas fa-chevron-down dropdown-icon"></i>
        </div>

        <!-- Dropdown Content -->
        <transition name="dropdown-fade">
          <div v-if="showDropdown" class="dropdown-content">
            <div class="dropdown-header">
              <span class="dropdown-role">{{
                user.role === "admin" ? "Administrador" : "Personal"
              }}</span>
              <span class="dropdown-email">{{ user.email }}</span>
            </div>

            <div class="dropdown-divider"></div>

            <template v-if="isAdmin">
              <button class="dropdown-item" @click="navigateTo('usuarios')">
                <i class="fas fa-users-cog"></i> Gestión de Usuarios
              </button>
            </template>

            <button class="dropdown-item logout" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
            </button>
          </div>
        </transition>
      </div>
    </div>
  </nav>

  <!-- Sub Nav (kept as is) -->
  <div v-if="props.currentView === 'gestion'" class="sub-nav">
    <button class="sub-nav-btn" @click="subNavigate('mesas')">Mesas</button>
    <button class="sub-nav-btn" @click="subNavigate('mostrador')">
      Mostrador
    </button>
    <button class="sub-nav-btn" @click="subNavigate('domicilio')">
      Domicilio
    </button>
    <button class="sub-nav-btn" @click="subNavigate('mostraplus')">
      MostraPlus
    </button>
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
});

const emit = defineEmits(["navigate", "sub-navigate"]);
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

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 56px;
  padding: 0 1.5rem;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 2000px;
  gap: 2rem;
}

/* Brand Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.logo i {
  font-size: 1.2rem;
  color: #f97316;
}

/* Navigation Links */
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  justify-content: center;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0 0.5rem;
  max-width: 100%;
}

.nav-links::-webkit-scrollbar {
  display: none;
}

.nav-item {
  background: transparent;
  border: none;
  color: #cbd5e1;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.45rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  flex-shrink: 0;
  text-decoration: none;
  position: relative;
}

.nav-item i {
  font-size: 0.9rem;
  opacity: 0.9;
  flex-shrink: 0;
}

.nav-item span {
  font-size: 0.8rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateY(-1px);
}

.nav-item.active {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: #f97316;
  border-radius: 2px 2px 0 0;
}

.nav-item:active {
  transform: translateY(0);
}

/* User Menu */
.user-menu {
  position: relative;
  cursor: pointer;

  margin-left: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  transition: all 0.5s ease;
  color: white;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-name {
  font-size: 0.85rem;
  font-weight: 300;
  letter-spacing: 0.01em;
}

.dropdown-icon {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  opacity: 0.7;
}

.user-menu:hover .dropdown-icon {
  transform: rotate(180deg);
  opacity: 1;
}

/* Dropdown */
.dropdown-content {
  position: absolute;
  top: 60px;
  right: 0;
  width: 260px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 0.75rem;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transform-origin: top right;
}

.dropdown-header {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.dropdown-role {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
  letter-spacing: -0.01em;
}

.dropdown-email {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.dropdown-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 0.5rem 0;
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #334155;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
  font-size: 1rem;
  color: #64748b;
}

.dropdown-item:hover {
  background: #f8fafc;
  color: #1e293b;
  transform: translateX(2px);
}

.dropdown-item:hover i {
  color: #f97316;
}

.dropdown-item.logout {
  color: #dc2626;
  margin-top: 0.25rem;
}

.dropdown-item.logout i {
  color: #dc2626;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #b91c1c;
}

.dropdown-item.logout:hover i {
  color: #b91c1c;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Sub Navigation */
.sub-nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: fixed;
  top: 56px;
  left: 0;
  width: 100%;
  z-index: 999;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sub-nav-btn {
  background: transparent;
  border: 1px solid rgba(249, 115, 22, 0.3);
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sub-nav-btn:hover {
  background: rgba(249, 115, 22, 0.1);
  border-color: #f97316;
  color: #fb923c;
  transform: translateY(-1px);
}

.sub-nav-btn.active {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-color: #f97316;
  color: white;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
}

/* Responsive */
@media (max-width: 1400px) {
  .navbar-container {
    gap: 1rem;
  }

  .nav-links {
    gap: 0.3rem;
    padding: 0 0.5rem;
  }

  .nav-item {
    font-size: 0.75rem;
    padding: 0.4rem 0.65rem;
    gap: 0.35rem;
  }

  .nav-item i {
    font-size: 0.85rem;
  }

  .nav-item span {
    font-size: 0.75rem;
  }
}

@media (max-width: 1200px) {
  .navbar {
    height: 52px;
    padding: 0 1rem;
  }

  .navbar-container {
    gap: 0.75rem;
  }

  .logo {
    font-size: 0.95rem;
  }

  .logo i {
    font-size: 1.1rem;
  }

  .nav-links {
    gap: 0.25rem;
    padding: 0 0.4rem;
  }

  .nav-item {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
    gap: 0.3rem;
  }

  .nav-item i {
    font-size: 0.8rem;
  }

  .nav-item span {
    font-size: 0.7rem;
  }

  .user-info {
    padding: 0.35rem 0.75rem;
    gap: 0.6rem;
  }

  .user-name {
    font-size: 0.8rem;
  }

  .sub-nav {
    top: 52px;
    padding: 0.6rem 1rem;
  }

  .sub-nav-btn {
    font-size: 0.8rem;
    padding: 0.45rem 1rem;
  }
}

@media (max-width: 1024px) {
  .navbar {
    height: 50px;
    padding: 0 0.75rem;
  }

  .navbar-container {
    gap: 0.5rem;
  }

  .logo span {
    font-size: 0.85rem;
  }

  .nav-links {
    gap: 0.2rem;
    padding: 0 0.3rem;
  }

  .nav-item {
    font-size: 0.65rem;
    padding: 0.35rem 0.5rem;
    gap: 0.25rem;
  }

  .nav-item i {
    font-size: 0.75rem;
  }

  .nav-item span {
    font-size: 0.65rem;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .user-name {
    font-size: 0.75rem;
  }

  .sub-nav {
    top: 50px;
    padding: 0.5rem 0.75rem;
  }

  .sub-nav-btn {
    font-size: 0.75rem;
    padding: 0.4rem 0.9rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 0.5rem;
    height: 48px;
  }

  .navbar-container {
    gap: 0.4rem;
  }

  .logo {
    font-size: 0.9rem;
  }

  .logo span {
    display: none;
  }

  .logo i {
    font-size: 1.1rem;
  }

  .nav-links {
    gap: 0.2rem;
    padding: 0 0.25rem;
  }

  .nav-item span {
    display: none;
  }

  .nav-item {
    padding: 0.45rem;
    min-width: 36px;
    justify-content: center;
  }

  .nav-item i {
    font-size: 0.9rem;
  }

  .user-name {
    display: none;
  }

  .user-info {
    padding: 0.35rem 0.5rem;
    gap: 0.4rem;
  }

  .user-avatar {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }

  .dropdown-icon {
    font-size: 0.65rem;
  }

  .dropdown-content {
    right: 0;
    top: 53px;
    width: 240px;
  }

  .sub-nav {
    top: 48px;
    padding: 0.45rem 0.5rem;
    gap: 0.3rem;
  }

  .sub-nav-btn {
    font-size: 0.7rem;
    padding: 0.35rem 0.75rem;
  }

  .sub-nav-btn span {
    display: none;
  }

  .sub-nav-btn i {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .navbar {
    height: 44px;
    padding: 0 0.4rem;
  }

  .navbar-container {
    gap: 0.3rem;
  }

  .logo i {
    font-size: 1rem;
  }

  .nav-links {
    gap: 0.15rem;
    padding: 0 0.2rem;
  }

  .nav-item {
    padding: 0.4rem;
    min-width: 34px;
  }

  .nav-item i {
    font-size: 0.85rem;
  }

  .user-info {
    padding: 0.3rem 0.45rem;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }

  .dropdown-icon {
    font-size: 0.6rem;
  }

  .dropdown-content {
    top: 49px;
    width: 220px;
  }

  .dropdown-header {
    padding: 0.75rem;
  }

  .dropdown-item {
    padding: 0.65rem 0.85rem;
    font-size: 0.85rem;
  }

  .sub-nav {
    top: 44px;
    gap: 0.25rem;
    padding: 0.4rem 0.4rem;
  }

  .sub-nav-btn {
    font-size: 0.65rem;
    padding: 0.3rem 0.65rem;
  }

  .sub-nav-btn i {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    height: 42px;
    padding: 0 0.3rem;
  }

  .navbar-container {
    gap: 0.25rem;
  }

  .logo i {
    font-size: 0.95rem;
  }

  .nav-links {
    gap: 0.1rem;
    padding: 0 0.15rem;
  }

  .nav-item {
    padding: 0.35rem;
    min-width: 32px;
  }

  .nav-item i {
    font-size: 0.8rem;
  }

  .user-info {
    padding: 0.25rem 0.4rem;
  }

  .user-avatar {
    width: 22px;
    height: 22px;
    font-size: 0.65rem;
  }

  .dropdown-icon {
    font-size: 0.55rem;
  }

  .dropdown-content {
    top: 47px;
    width: 200px;
  }

  .sub-nav {
    top: 42px;
    padding: 0.35rem 0.3rem;
    gap: 0.2rem;
  }

  .sub-nav-btn {
    font-size: 0.6rem;
    padding: 0.25rem 0.55rem;
  }

  .sub-nav-btn i {
    font-size: 0.75rem;
  }
}

@media (max-width: 360px) {
  .navbar {
    height: 40px;
    padding: 0 0.25rem;
  }

  .navbar-container {
    gap: 0.2rem;
  }

  .logo i {
    font-size: 0.9rem;
  }

  .nav-links {
    gap: 0.08rem;
    padding: 0 0.1rem;
  }

  .nav-item {
    padding: 0.3rem;
    min-width: 30px;
  }

  .nav-item i {
    font-size: 0.75rem;
  }

  .user-info {
    padding: 0.25rem 0.35rem;
  }

  .user-avatar {
    width: 20px;
    height: 20px;
    font-size: 0.6rem;
  }

  .dropdown-icon {
    font-size: 0.5rem;
  }

  .dropdown-content {
    top: 45px;
    width: 190px;
  }

  .dropdown-header {
    padding: 0.65rem;
  }

  .dropdown-item {
    padding: 0.6rem 0.75rem;
    font-size: 0.8rem;
  }

  .sub-nav {
    top: 40px;
    padding: 0.3rem 0.25rem;
    gap: 0.15rem;
  }

  .sub-nav-btn {
    font-size: 0.55rem;
    padding: 0.25rem 0.5rem;
  }

  .sub-nav-btn i {
    font-size: 0.7rem;
  }
}

@media (max-width: 360px) {
  .navbar {
    height: 40px;
    padding: 0 0.25rem;
  }

  .nav-btn {
    padding: 0.35rem;
  }

  .nav-btn i {
    font-size: 0.95rem;
  }

  .sub-nav {
    top: 40px;
  }
}
</style>
