<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo / Brand Section (Optional, keeping as per previous structure but enhanced if needed) -->
      <!-- The user requested the dropdown ON the user logo/info section -->

      <!-- Main Navigation Items -->
      <div class="nav-links">
        <button class="nav-btn" @click="navigateTo('gestion')">
          <i class="fas fa-utensils"></i>
          <span>Gestión Mesas</span>
        </button>
        <button class="nav-btn" @click="navigateTo('registro')">
          <i class="fas fa-clipboard-list"></i>
          <span>Registro</span>
        </button>
        <button class="nav-btn" @click="navigateTo('menu')">
          <i class="fas fa-book-open"></i>
          <span>Menú</span>
        </button>
        <button class="nav-btn" @click="navigateTo('clientes')">
          <i class="fas fa-users"></i>
          <span>Clientes</span>
        </button>

        <!-- Admin Only Sections -->
        <template v-if="isAdmin">
          <button class="nav-btn" @click="navigateTo('reportes')">
            <i class="fas fa-chart-bar"></i>
            <span>Reportes</span>
          </button>
          <button class="nav-btn" @click="navigateTo('inventario')">
            <i class="fas fa-boxes"></i>
            <span>Inventario</span>
          </button>
          <button class="nav-btn" @click="navigateTo('personal')">
            <i class="fas fa-user-tie"></i>
            <span>Personal</span>
          </button>
          <button class="nav-btn" @click="navigateTo('pedidos')">
            <i class="fas fa-shopping-cart"></i>
            <span>Pedidos</span>
          </button>
          <button class="nav-btn" @click="navigateTo('finanzas')">
            <i class="fas fa-dollar-sign"></i>
            <span>Finanzas</span>
          </button>
          <button class="nav-btn" @click="navigateTo('caracteristicas')">
            <i class="fas fa-cogs"></i>
            <span>Características</span>
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
  justify-content: center;
  width: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 50px;
  padding: 0 0.75rem;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1600px;
  gap: 0.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.nav-links::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.nav-btn {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  flex-shrink: 0;
}

.nav-btn i {
  font-size: 0.9rem;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transform: translateY(-1px);
}

.nav-btn:active {
  transform: translateY(0);
}

.user-menu {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.6rem;
  border-radius: 20px;
  transition: background 0.2s;
  color: white;
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  font-size: 0.8rem;
}

.user-name {
  font-size: 0.8rem;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 0.65rem;
  transition: transform 0.2s;
}

.user-menu:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 55px;
  right: 0;
  width: 220px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1001;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transform-origin: top right;
}

.dropdown-header {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-role {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.dropdown-email {
  font-size: 0.75rem;
  color: #718096;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 0.5rem 0;
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #2d3748;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
}

.dropdown-item i {
  width: 20px;
  text-align: center;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-item.logout {
  color: #e53e3e;
}

.dropdown-item.logout:hover {
  background: #fff5f5;
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

.sub-nav {
  display: flex;
  justify-content: flex-start;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.4rem 0.75rem;
  background: rgba(26, 46, 82, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: fixed;
  top: 50px;
  left: 0;
  width: 100%;
  z-index: 999;
}

.sub-nav-btn {
  background: rgba(49, 130, 206, 0.2);
  border: 1px solid rgba(49, 130, 206, 0.4);
  color: white;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.3rem 0.7rem;
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
@media (max-width: 1024px) {
  .nav-btn {
    font-size: 0.7rem;
    padding: 0.35rem 0.5rem;
    gap: 0.35rem;
  }

  .nav-btn i {
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 0 0.5rem;
    height: 45px;
  }

  .navbar-container {
    gap: 0.35rem;
  }

  .nav-links {
    gap: 0.2rem;
  }

  .nav-btn {
    font-size: 0.65rem;
    padding: 0.3rem 0.45rem;
  }

  .user-name {
    display: none;
  }

  .user-info {
    padding: 0.3rem;
    gap: 0.4rem;
  }

  .user-avatar {
    width: 26px;
    height: 26px;
    font-size: 0.75rem;
  }

  .dropdown-content {
    right: -10px;
    top: 50px;
  }

  .sub-nav {
    top: 45px;
    padding: 0.35rem 0.5rem;
    gap: 0.5rem;
  }

  .sub-nav-btn {
    font-size: 0.65rem;
    padding: 0.25rem 0.55rem;
  }
}

@media (max-width: 600px) {
  .navbar {
    height: 42px;
  }

  .nav-btn span {
    display: none; /* Hide text, show only icons */
  }

  .nav-btn {
    padding: 0.4rem;
    gap: 0;
  }

  .nav-btn i {
    font-size: 1rem;
  }

  .user-avatar {
    width: 24px;
    height: 24px;
    font-size: 0.7rem;
  }

  .dropdown-content {
    top: 47px;
    width: 200px;
  }

  .sub-nav {
    top: 42px;
    gap: 0.4rem;
    padding: 0.3rem 0.4rem;
  }

  .sub-nav-btn {
    font-size: 0.6rem;
    padding: 0.2rem 0.5rem;
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
