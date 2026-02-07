<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div v-if="user" class="user-info">
        <i
          class="fas"
          :class="user.role === 'admin' ? 'fa-user-tie' : 'fa-user'"
        ></i>
        <span class="user-role">{{ user.name }}</span>
      </div>

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
        <button class="nav-btn" @click="navigateTo('usuarios')">
          <i class="fas fa-users-cog"></i> Usuarios
        </button>
      </template>

      <button class="nav-btn logout-btn" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </nav>
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
import { useAuth } from "../composables/useAuth";

const props = defineProps({
  currentView: {
    type: String,
    default: "gestion",
  },
});

const emit = defineEmits(["navigate", "sub-navigate"]);
const { user, isAdmin, logout } = useAuth();

const navigateTo = (section) => {
  emit("navigate", section);
};

const subNavigate = (subSection) => {
  emit("sub-navigate", subSection);
};

const handleLogout = () => {
  logout();
};
</script>

<style scoped>
.navbar {
  width: 100%;
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.5rem 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  margin-right: 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.user-role {
  text-transform: capitalize;
}

.nav-btn {
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: unset; /* Remove min-width to fit more items */
}

.nav-btn i {
  font-size: 1rem;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  transform: translateY(-1px);
}

.nav-btn:focus {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
}

.logout-btn {
  color: #fc8181;
}

.logout-btn:hover {
  background: rgba(252, 129, 129, 0.1);
  color: #feb2b2;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-container {
    flex-wrap: wrap;
    padding: 0.5rem;
  }

  .nav-btn {
    flex: 1;
    min-width: 100px;
    margin: 0.25rem;
  }
}

.sub-nav {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(26, 46, 82, 0.733);
  border-radius: 1px;
  position: fixed;
  top: 48px; /* Adjust based on navbar height */
  left: 0;
  width: 100%;
  z-index: 999;
  pointer-events: auto;
}

.sub-nav-btn {
  background: #3182ce;
  border: none;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.1px;
}

.sub-nav-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.sub-nav-btn:focus {
  outline: 2px solid #076da951;
  transition: outline 0.1s ease;
  outline-offset: 0.5px;
}
</style>
