<template>
  <div class="user-management-container">
    <div class="header-container">
      <h1>Gestión de Usuarios</h1>
      <button class="back-btn" @click="$router.push('/gestion')">
        <i class="fas fa-arrow-left"></i> Volver
      </button>
    </div>

    <div class="users-grid">
      <div v-for="user in users" :key="user.email" class="user-card">
        <div class="user-info">
          <div class="user-avatar">
            <i :class="user.role === 'admin' ? 'fas fa-user-tie' : 'fas fa-user-friends'"></i>
          </div>
          <div class="user-details">
            <h3>{{ user.name }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <span :class="['role-badge', user.role]">
              {{ user.role === 'admin' ? 'Jefe' : 'Trabajador' }}
            </span>
          </div>
        </div>
        <div class="user-actions">
          <button class="edit-btn" @click="openEditModal(user)">
             <i class="fas fa-edit"></i>
          </button>
          <button class="delete-btn" @click="confirmDelete(user)">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar Usuario</h2>
        <form @submit.prevent="saveUserChanges">
          <div class="form-group">
            <label>Nombre</label>
            <input v-model="editingUser.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input v-model="editingUser.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="editingUser.role">
              <option value="admin">Jefe</option>
              <option value="user">Trabajador</option>
            </select>
          </div>
          <div class="form-group">
            <label>Contraseña (Opcional)</label>
            <input v-model="editingUser.password" type="text" placeholder="Nueva contraseña" />
          </div>
          
          <div class="modal-actions">
            <button type="submit" class="save-btn">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';

const { getAllUsers, deleteUser, updateUser } = useAuth();
const users = ref([]);
const showEditModal = ref(false);
const editingUser = ref({});
let originalEmail = '';

const loadUsers = () => {
  users.value = getAllUsers();
};

onMounted(() => {
  loadUsers();
});

const confirmDelete = (user) => {
  if (confirm(`¿Estás seguro de que deseas eliminar al usuario ${user.name}?`)) {
    deleteUser(user.email);
    loadUsers();
  }
};

const openEditModal = (user) => {
  originalEmail = user.email;
  editingUser.value = { ...user, password: '' }; // Don't show old password, allow setting new one
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
.user-management-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 1rem;
}

.back-btn {
  background: white;
  border: 1px solid #e2e8f0;
  color: #4a5568;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
  border: 1px solid #e2e8f0;
}

.user-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  background: #edf2f7;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #4a5568;
}

.user-details h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.user-email {
  margin: 0.2rem 0;
  font-size: 0.85rem;
  color: #718096;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #fefcbf;
  color: #b7791f;
}

.role-badge.user {
  background: #c6f6d5;
  color: #2f855a;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.edit-btn, .delete-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn {
  background: #ebf8ff;
  color: #3182ce;
}

.edit-btn:hover {
  background: #bee3f8;
}

.delete-btn {
  background: #fff5f5;
  color: #e53e3e;
}

.delete-btn:hover {
  background: #fed7d7;
}

/* Modal styles reusing existing ones mostly, updating specific overrides */
.modal {
  z-index: 1000;
}

.save-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
</style>
