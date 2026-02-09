<template>
  <div class="user-management-container">
    <div class="glass-background"></div>
    
    <div class="header-section">
      <div class="title-group">
        <div class="icon-wrapper">
          <i class="fas fa-users-cog"></i>
        </div>
        <div>
          <h1>Gestión de Usuarios</h1>
          <p class="subtitle">Administra el equipo de trabajo</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn-header" @click="showStatsModal = true">
          <i class="fas fa-chart-pie"></i> Ver Resumen
        </button>
        <button class="back-btn" @click="$router.push('/gestion')">
          <i class="fas fa-arrow-left"></i>
          <span>Volver al Panel</span>
        </button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="users-grid">
        <div v-for="user in users" :key="user.email" class="user-card" :class="{ 'is-admin': user.role === 'admin' }">
          <div class="card-header">
            <span :class="['role-badge', user.role]">
              <i :class="getRoleIcon(user.role)"></i>
              {{ getRoleName(user.role) }}
            </span>
            <div class="card-actions">
              <button class="action-btn edit" @click="openEditModal(user)" title="Editar">
                <i class="fas fa-pen"></i>
              </button>
              <button 
                class="action-btn delete" 
                @click="confirmDelete(user)" 
                :disabled="isCurrentUser(user)"
                :title="isCurrentUser(user) ? 'No puedes eliminar tu propia cuenta' : 'Eliminar'"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
          
          <div class="card-body">
            <div class="avatar-placeholder">
              <span>{{ getInitials(user.name) }}</span>
            </div>
            <h3>{{ user.name }}</h3>
            <p class="email-text">
              <i class="fas fa-envelope"></i>
              {{ user.email }}
            </p>
          </div>
          
          <div class="card-footer">
            <div class="status-indicator active">
              <span class="dot"></span> Activo
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <transition name="modal">
      <div v-if="showEditModal" class="modal-overlay" @click.self="closeEditModal">
        <div class="modal-content glass-modal">
          <button class="close-modal-btn" @click="closeEditModal">&times;</button>
          
          <div class="modal-header">
            <div class="modal-icon edit">
              <i class="fas fa-user-edit"></i>
            </div>
            <h2>Editar Usuario</h2>
            <p>Actualizar información del empleado</p>
          </div>

          <form @submit.prevent="saveUserChanges" class="premium-form">
            <div class="form-group">
              <label>Nombre Completo</label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input v-model="editingUser.name" type="text" required placeholder="Ej: Juan Pérez" />
              </div>
            </div>
            
            <div class="form-group">
              <label>Correo Electrónico</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input v-model="editingUser.email" type="email" required placeholder="usuario@correo.com" />
              </div>
            </div>

            <div class="form-group">
              <label>Rol de Usuario</label>
              <div class="input-wrapper">
                <i class="fas fa-user-tag"></i>
                <select v-model="editingUser.role">
                  <option value="admin">Administrador (Jefe)</option>
                  <option value="mesero">Mesero</option>
                  <option value="cocinero">Cocinero</option>
                  <option value="cajero">Cajero</option>
                  <option value="user">Personal General</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Nueva Contraseña <span class="optional">(Opcional)</span></label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input v-model="editingUser.password" type="password" placeholder="Dejar vacío para mantener actual" />
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="closeEditModal">Cancelar</button>
              <button type="submit" class="save-btn">
                <i class="fas fa-save"></i> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-content delete-modal glass-modal">
          <div class="modal-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <h2>¿Eliminar Usuario?</h2>
          <p>Esta acción eliminará permanentemente a <strong>{{ userToDelete?.name }}</strong> del sistema.</p>
          <div class="warning-box">
            <i class="fas fa-info-circle"></i>
            <span>Esta acción no se puede deshacer.</span>
          </div>
          <div class="modal-actions">
            <button class="cancel-btn" @click="closeDeleteModal">Cancelar</button>
            <button class="confirm-delete-btn" @click="executeDelete">
              <i class="fas fa-trash"></i> Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Stats Modal -->
    <transition name="modal">
      <div v-if="showStatsModal" class="modal-overlay" @click.self="showStatsModal = false">
        <div class="modal-content glass-modal stats-modal">
          <button class="close-modal-btn" @click="showStatsModal = false">&times;</button>
          
          <div class="modal-header">
            <div class="modal-icon stats">
              <i class="fas fa-chart-pie"></i>
            </div>
            <h2>Resumen de Personal</h2>
            <p>Distribución del equipo de trabajo</p>
          </div>

          <div class="stats-grid">
             <div class="stat-card total">
                <h3>Total Empleados</h3>
                <div class="number">{{ users.length }}</div>
             </div>
             <div class="role-breakdown">
                <div class="role-stat-item" v-for="(count, role) in roleCounts" :key="role">
                   <div class="role-info">
                      <span :class="['role-dot', role]"></span>
                      <span class="role-name">{{ getRoleName(role) }}</span>
                   </div>
                   <span class="role-count">{{ count }}</span>
                </div>
             </div>
          </div>
          
          <div class="modal-actions">
            <button class="cancel-btn full-width" @click="showStatsModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuth } from '../composables/useAuth';

const { getAllUsers, deleteUser, updateUser, user: currentUser } = useAuth();
const users = ref([]);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showStatsModal = ref(false);
const editingUser = ref({});
const userToDelete = ref(null);
let originalEmail = '';

const loadUsers = () => {
  users.value = getAllUsers();
};

onMounted(() => {
  loadUsers();
});

const getInitials = (name) => {
  return name
    ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';
};

const isCurrentUser = (user) => {
  return currentUser.value && user.email === currentUser.value.email;
};

const getRoleName = (role) => {
  const roles = {
    'admin': 'Jefe',
    'mesero': 'Mesero',
    'cocinero': 'Cocinero',
    'cajero': 'Cajero',
    'user': 'Personal'
  };
  return roles[role] || 'Empleado';
};

const getRoleIcon = (role) => {
  const icons = {
    'admin': 'fas fa-user-tie',
    'mesero': 'fas fa-utensils',
    'cocinero': 'fas fa-hat-chef', // Note: fa-hat-chef might not be in free version, fallback to user
    'cajero': 'fas fa-cash-register',
    'user': 'fas fa-user'
  };
  // Fallback for icons if specific ones aren't available in your fontawesome version
  if (role === 'cocinero') return 'fas fa-cookie-bite';
  return icons[role] || 'fas fa-user';
};

const roleCounts = computed(() => {
  const counts = {};
  users.value.forEach(user => {
    const role = user.role || 'user';
    counts[role] = (counts[role] || 0) + 1;
  });
  return counts;
});

// Delete Logic
const confirmDelete = (user) => {
  if (isCurrentUser(user)) {
    alert("No puedes eliminar tu propia cuenta de administrador.");
    return;
  }
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
};

const executeDelete = () => {
  if (userToDelete.value) {
    const success = deleteUser(userToDelete.value.email);
    if (success) {
      loadUsers();
      closeDeleteModal();
    } else {
      alert("Error al eliminar el usuario.");
    }
  }
};

// Edit Logic
const openEditModal = (user) => {
  originalEmail = user.email;
  editingUser.value = { ...user, password: '' };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  editingUser.value = {};
};

const saveUserChanges = () => {
  const updates = {
    name: editingUser.value.name,
    email: editingUser.value.email,
    role: editingUser.value.role
  };

  if (editingUser.value.password && editingUser.value.password.trim() !== '') {
    updates.password = editingUser.value.password;
  }

  const success = updateUser(originalEmail, updates);
  if (success) {
    loadUsers();
    closeEditModal();
  } else {
    alert('Error al actualizar. Es posible que el correo ya esté en uso.');
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

.user-management-container {
  min-height: 100vh;
  padding: 2rem;
  background: #f8fafc;
  font-family: 'Outfit', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Glass Background Effect */
.glass-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 10% 20%, rgba(66, 153, 225, 0.1) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(159, 122, 234, 0.1) 0%, transparent 40%);
  pointer-events: none;
  z-index: 0;
}

.header-section {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding: 0 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #3182ce;
  box-shadow: 0 10px 25px rgba(49, 130, 206, 0.15);
}

.title-group h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: -0.5px;
}

.subtitle {
  margin: 0.25rem 0 0;
  color: #718096;
  font-size: 1rem;
}

.header-actions {
    display: flex;
    gap: 1rem;
}

.back-btn, .action-btn-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.back-btn {
    background: white;
    color: #4a5568;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.action-btn-header {
    background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    color: white;
    box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2);
}

.back-btn:hover, .action-btn-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.content-wrapper {
  position: relative;
  z-index: 1;
}


.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* Reduced from 320px */
  gap: 1rem; /* Reduced gap */
  padding: 0.5rem;
}

/* Premium Card Styles */
.user-card {
  background: white;
  border-radius: 12px; /* Reduced radius */
  padding: 1rem; /* Reduced from 1.75rem */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px; /* Thinner border */
  background: #e2e8f0;
  transition: background 0.3s;
}

/* ... other states ... */

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); /* Lighter hover shadown */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem; /* Reduced margin */
}

.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem; /* Reduced padding */
  border-radius: 50px;
  font-size: 0.7rem; /* Smaller font */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ... badge colors ... */

.card-actions {
  display: flex;
  gap: 0.4rem;
}

.action-btn {
  width: 28px; /* Smaller buttons */
  height: 28px;
  border-radius: 6px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8rem;
}

/* ... btn styles ... */

.card-body { text-align: center; margin-bottom: 1rem; }

.avatar-placeholder {
  width: 50px; /* Reduced from 80px */
  height: 50px;
  background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
  border-radius: 50%;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem; /* Smaller icon font */
  font-weight: 700;
  color: #718096;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* ... active avatar style ... */

.card-body h3 { margin: 0 0 0.25rem; font-size: 1rem; color: #2d3748; } /* Smaller h3 */

.email-text {
  margin: 0; color: #718096; font-size: 0.75rem; /* Smaller email */
  display: flex; align-items: center; justify-content: center; gap: 0.4rem;
}

.card-footer {
  border-top: 1px solid #edf2f7; paddingTop: 0.75rem; display: flex; justify-content: center; /* Reduced padding */
}

.status-indicator {
  font-size: 0.7rem; font-weight: 600; color: #48bb78;
  display: flex; align-items: center; gap: 0.3rem;
}


.status-indicator .dot {
  width: 8px; height: 8px; background: #48bb78; border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(72, 187, 120, 0.2);
}

/* Modal Styles with Animations */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(45, 55, 72, 0.6); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 2000;
}

.glass-modal {
  background: white; border-radius: 24px; padding: 2.5rem; width: 100%; max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); position: relative; border: 1px solid rgba(255, 255, 255, 0.3);
}

.close-modal-btn {
  position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; font-size: 1.5rem; color: #a0aec0; cursor: pointer; transition: color 0.2s;
}

.close-modal-btn:hover { color: #4a5568; }

.modal-header { text-align: center; margin-bottom: 2rem; }

.modal-icon {
  width: 64px; height: 64px; border-radius: 20px; margin: 0 auto 1rem;
  display: flex; align-items: center; justify-content: center; font-size: 1.75rem;
}

.modal-icon.edit { background: #ebf8ff; color: #3182ce; }
.modal-icon.warning { background: #fff5f5; color: #e53e3e; }
.modal-icon.stats { background: #e6fffa; color: #319795; }


.modal-header h2 { margin: 0 0 0.5rem; font-size: 1.5rem; color: #2d3748; }
.modal-header p { margin: 0; color: #718096; }

/* Premium Form Styles */
.premium-form .form-group { margin-bottom: 1.5rem; }
.premium-form label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #4a5568; font-size: 0.9rem; }
.premium-form .optional { color: #a0aec0; font-weight: 400; font-size: 0.8rem; }

.input-wrapper { position: relative; display: flex; align-items: center; }
.input-wrapper i { position: absolute; left: 1rem; color: #a0aec0; font-size: 1rem; pointer-events: none; }
.input-wrapper input, .input-wrapper select {
  width: 100%; padding: 0.75rem 1rem 0.75rem 2.75rem; border: 2px solid #edf2f7; border-radius: 12px; font-family: inherit; font-size: 1rem; color: #2d3748; transition: all 0.3s; background: #f7fafc;
}
.input-wrapper input:focus, .input-wrapper select:focus {
  outline: none; border-color: #3182ce; background: white; box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.modal-actions { display: flex; gap: 1rem; margin-top: 2rem; }
.modal-actions button {
  flex: 1; padding: 0.875rem; border-radius: 12px; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.2s; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
}

.cancel-btn { background: white; border: 2px solid #edf2f7; color: #4a5568; }
.cancel-btn:hover { background: #f7fafc; border-color: #e2e8f0; }

.save-btn { background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%); border: none; color: white; box-shadow: 0 4px 6px rgba(49, 130, 206, 0.2); }
.save-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(49, 130, 206, 0.25); }

.confirm-delete-btn { background: linear-gradient(135deg, #f56565 0%, #c53030 100%); border: none; color: white; box-shadow: 0 4px 6px rgba(245, 101, 101, 0.2); }
.confirm-delete-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 12px rgba(245, 101, 101, 0.25); }

.warning-box {
  background: #fffaf0; border-left: 4px solid #ed8936; padding: 1rem; border-radius: 6px; display: flex; align-items: center; gap: 0.75rem; color: #c05621; margin: 1.5rem 0; font-size: 0.9rem;
}

/* Stats Styles */
.stats-grid { display: flex; flex-direction: column; gap: 1.5rem; }
.stat-card.total { background: #ebf8ff; padding: 1.5rem; border-radius: 16px; text-align: center; }
.stat-card.total h3 { margin: 0 0 0.5rem; color: #2b6cb0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
.stat-card.total .number { font-size: 3rem; font-weight: 800; color: #2c5282; line-height: 1; }

.role-breakdown { display: flex; flex-direction: column; gap: 0.75rem; }
.role-stat-item {
    display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: #f7fafc; border-radius: 12px; border: 1px solid #edf2f7;
}
.role-info { display: flex; align-items: center; gap: 0.75rem; }
.role-dot { width: 10px; height: 10px; border-radius: 50%; }
.role-dot.admin { background: #ed8936; }
.role-dot.mesero { background: #4299e1; }
.role-dot.cocinero { background: #a0aec0; }
.role-dot.cajero { background: #48bb78; }
.role-dot.user { background: #cbd5e0; }

.role-name { font-weight: 500; color: #4a5568; }
.role-count { font-weight: 700; color: #2d3748; background: white; padding: 0.25rem 0.75rem; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

.full-width { width: 100%; }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-content, .modal-leave-active .modal-content { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .modal-content, .modal-leave-to .modal-content { transform: scale(0.9) translateY(20px); }
</style>
