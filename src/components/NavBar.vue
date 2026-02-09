<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo / Brand Section (Optional, keeping as per previous structure but enhanced if needed) -->
      <!-- The user requested the dropdown ON the user logo/info section -->

      <!-- Main Navigation Items -->
      <div class="nav-links">
        <button class="nav-btn" @click="navigateTo('gestion')">
          <i class="fas fa-utensils"></i> Gestión Mesas
        </button>
        <button class="nav-btn" @click="navigateTo('registro')">
          <i class="fas fa-clipboard-list"></i> Registro
        </button>
        <button class="nav-btn" @click="navigateTo('menu')">
          <i class="fas fa-book-open"></i> Menú
        </button>
        <button class="nav-btn" @click="navigateTo('clientes')">
          <i class="fas fa-users"></i> Clientes
        </button>

        <!-- Admin Only Sections -->
        <template v-if="isAdmin">
          <button class="nav-btn" @click="navigateTo('reportes')">
            <i class="fas fa-chart-bar"></i> Reportes
          </button>
          <button class="nav-btn" @click="navigateTo('inventario')">
            <i class="fas fa-boxes"></i> Inventario
          </button>
          <button class="nav-btn" @click="navigateTo('personal')">
            <i class="fas fa-user-tie"></i> Personal
          </button>
          <button class="nav-btn" @click="navigateTo('pedidos')">
            <i class="fas fa-shopping-cart"></i> Pedidos
          </button>
          <button class="nav-btn" @click="navigateTo('finanzas')">
            <i class="fas fa-dollar-sign"></i> Finanzas
          </button>
          <button class="nav-btn" @click="navigateTo('caracteristicas')">
            <i class="fas fa-cogs"></i> Características
          </button>
          <!-- 'Usuarios' moved to dropdown -->
        </template>
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
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

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
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 60px; /* Restored height */
}

/* ... container ... */

.nav-btn {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.85rem; /* Restored font size */
  font-weight: 500;
  padding: 0.5rem 0.75rem; /* Restored padding */
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.5rem; /* Restored gap */
  white-space: nowrap;
}

.nav-btn i {
  font-size: 1rem;
} /* Restored icon size */

/* ... hover ... */

/* ... user info ... */

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Restored gap */
  padding: 0.4rem 0.8rem; /* Restored padding */
  border-radius: 20px;
  transition: background 0.2s;
  color: white;
}

/* ... avatar ... */

.user-avatar {
  width: 32px; /* Restored size */
  height: 32px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 0.9rem;
}

/* ... dropdown ... */

.dropdown-content {
  position: absolute;
  top: 65px; /* Restored top position */
  right: 0;
  width: 240px; /* Restored width */
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transform-origin: top right;
}

/* ... sub nav ... */

.sub-nav {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(26, 46, 82, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 60px; /* Restored top position */
  left: 0;
  width: 100%;
  z-index: 999;
}

.sub-nav-btn {
  background: rgba(49, 130, 206, 0.2);
  border: 1px solid rgba(49, 130, 206, 0.4);
  color: white;
  font-size: 0.8rem; /* Restored font size */
  font-weight: 500;
  padding: 0.3rem 0.8rem; /* Restored padding */
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sub-nav-btn:hover {
  background: #3182ce;
  border-color: #3182ce;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .user-name {
    display: none;
  } /* Hide name on mobile */
  .navbar-container {
    padding: 0.5rem;
  }
  .user-menu {
    margin-left: 0.5rem;
  }
}
</style>
