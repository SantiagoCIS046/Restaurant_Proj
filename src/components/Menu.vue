<template>
  <div class="menu-layout">
    <!-- Premium Sidebar -->
    <aside class="menu-sidebar">
      <div class="sidebar-header">
        <i class="fas fa-utensils brand-icon"></i>
        <h3>MENÚ DIGITAL</h3>
      </div>
      
      <div class="sidebar-divider"></div>
      
      <nav class="sidebar-nav">
        <button 
          v-for="category in categories" 
          :key="category"
          class="nav-item"
          :class="{ active: selectedCategory === category }"
          @click="selectedCategory = category"
        >
          <div class="icon-box">
            <i :class="getCategoryIcon(category)"></i>
          </div>
          <span>{{ category }}</span>
          <i v-if="selectedCategory === category" class="fas fa-chevron-right active-indicator"></i>
        </button>
      </nav>

    </aside>

    <!-- Main Content -->
    <main class="menu-main">
      <header class="content-header">
        <div class="header-breadcrumb">
          <span>Menú</span>
          <i class="fas fa-chevron-right"></i>
          <span class="current">{{ selectedCategory }}</span>
        </div>
        
        <div class="header-actions">
          <div class="section-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              class="tab-btn"
              :class="{ active: currentTab === tab.id }"
              @click="currentTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <button class="add-btn" @click="openAddModal">
            <i class="fas fa-plus"></i>
            <span>Agregar {{ currentTab === 'ingredientes' ? 'Ingrediente' : 'Producto' }}</span>
          </button>
        </div>
      </header>

      <div class="content-scroll">
        <div class="empty-state">
          <i class="fas fa-layer-group"></i>
          <h2>{{ selectedCategory }}</h2>
          <p>Seleccione una sub-sección para gestionar los elementos.</p>
        </div>
      </div>
    </main>

    <!-- Premium Modal Overlay -->
    <Transition name="fade">
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeAddModal">
        <div class="modal-content glass-effect">
          <div class="modal-header">
            <div class="modal-title">
              <i class="fas fa-plus-circle"></i>
              <h2>Nuevo {{ currentTab === 'ingredientes' ? 'Ingrediente' : 'Producto' }}</h2>
            </div>
            <button class="close-btn" @click="closeAddModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveItem" class="premium-form">
            <div class="form-group">
              <label>NOMBRE DEL ELEMENTO</label>
              <div class="input-wrapper">
                <i class="fas fa-tag"></i>
                <input v-model="formItem.name" type="text" placeholder="Ej: Pizza Margarita" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>CATEGORÍA</label>
                <div class="input-wrapper">
                  <i class="fas fa-folder"></i>
                  <select v-model="formItem.category" required>
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
              </div>

              <div v-if="currentTab !== 'ingredientes'" class="form-group flex-1">
                <label>PRECIO (COP)</label>
                <div class="input-wrapper">
                  <i class="fas fa-dollar-sign"></i>
                  <input v-model.number="formItem.price" type="number" placeholder="0.00" required />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>STOCK INICIAL</label>
              <div class="input-wrapper">
                <i class="fas fa-boxes"></i>
                <input v-model.number="formItem.quantity" type="number" placeholder="0" />
              </div>
            </div>

            <div v-if="currentTab !== 'ingredientes'" class="form-group">
              <label>INGREDIENTES (Opcional)</label>
              <div class="input-wrapper textarea">
                <i class="fas fa-list-ul"></i>
                <textarea v-model="formItem.ingredientsText" placeholder="Separados por comas..."></textarea>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="cancel-btn" @click="closeAddModal">Cancelar</button>
              <button type="submit" class="save-btn">
                <span>Guardar Cambios</span>
                <i class="fas fa-save"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedCategory = ref('Bebidas');
const currentTab = ref('productos');
const showAddModal = ref(false);

const formItem = ref({
  name: '',
  category: '',
  price: 0,
  quantity: 0,
  ingredientsText: ''
});

const openAddModal = () => {
  formItem.value = {
    name: '',
    category: selectedCategory.value,
    price: 0,
    quantity: 0,
    ingredientsText: ''
  };
  showAddModal.value = true;
};

const closeAddModal = () => {
  showAddModal.value = false;
};

const saveItem = () => {
  const itemData = {
    name: formItem.value.name,
    quantity: formItem.value.quantity || 0
  };

  if (currentTab.value === 'ingredientes') {
    if (!ingredients.value[formItem.value.category]) {
      ingredients.value[formItem.value.category] = [];
    }
    ingredients.value[formItem.value.category].push(itemData);
  } else {
    itemData.price = formItem.value.price || 0;
    itemData.ingredients = formItem.value.ingredientsText 
      ? formItem.value.ingredientsText.split(',').map(i => i.trim()) 
      : [];
    
    if (!items.value[formItem.value.category]) {
      items.value[formItem.value.category] = [];
    }
    items.value[formItem.value.category].push(itemData);
  }

  closeAddModal();
};

const tabs = [
  { id: 'productos', label: 'PRODUCTOS' },
  { id: 'ingredientes', label: 'INGREDIENTES' },
  { id: 'stock', label: 'CONTROL STOCK' },
  { id: 'precios', label: 'LISTA PRECIOS' }
];

const categories = [
  'Bebidas', 'Entradas', 'Platos Fuertes', 'Ensaladas', 
  'Pescados', 'Carnes', 'Pastas', 'Postres', 'Adicionales'
];

const items = ref({
  'Bebidas': [
    { name: 'Coca Cola', price: 2500, quantity: 10, ingredients: ['Agua', 'Azúcar', 'Gas'] },
    { name: 'Sprite', price: 2500, quantity: 5, ingredients: ['Agua', 'Azúcar', 'Gas', 'Limón'] }
  ],
  'Entradas': [
    { name: 'Empanadas', price: 3000, quantity: 20, ingredients: ['Harina', 'Carne', 'Cebolla'] },
    { name: 'Patacones', price: 4000, quantity: 15, ingredients: ['Plátano', 'Aceite', 'Sal'] }
  ]
  // ... rest of the categories can be added later as needed
});

const ingredients = ref({
  'Verduras': [
    { name: 'Lechuga', quantity: 20 },
    { name: 'Tomate', quantity: 15 }
  ]
});

const getCategoryIcon = (category) => {
  const icons = {
    'Bebidas': 'fas fa-wine-glass-alt',
    'Entradas': 'fas fa-cheese',
    'Platos Fuertes': 'fas fa-drumstick-bite',
    'Ensaladas': 'fas fa-leaf',
    'Pescados': 'fas fa-fish',
    'Carnes': 'fas fa-steak',
    'Pastas': 'fas fa-pizza-slice',
    'Postres': 'fas fa-cookie-bite',
    'Adicionales': 'fas fa-plus-circle'
  };
  return icons[category] || 'fas fa-folder';
};
</script>

<style scoped>
.menu-layout {
  display: flex;
  height: calc(100vh - 56px);
  margin-top: 56px;
  background-color: #f8fafc;
  overflow: hidden;
}

/* Sidebar Styling */
.menu-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #101c2c 0%, #0a0f18 100%);
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 1.5rem;
  color: #3b82f6;
}

.sidebar-header h3 {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: white;
  margin: 0;
}

.sidebar-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0 24px 20px;
}

.sidebar-nav {
  flex: 1;
  padding: 0 16px;
  overflow-y: auto;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 4px;
  font-weight: 600;
  position: relative;
}

.icon-box {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s;
}

.nav-item i {
  font-size: 1.1rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.nav-item:hover .icon-box {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), transparent);
  color: white;
}

.nav-item.active .icon-box {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.active-indicator {
  margin-left: auto;
  font-size: 0.8rem;
  opacity: 0.5;
}

/* Main Content Styling */
.menu-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content-header {
  background: white;
  padding: 24px 40px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.header-breadcrumb .current {
  color: #0f172a;
  font-weight: 800;
}

.section-tabs {
  display: flex;
  gap: 8px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 14px;
  align-self: flex-start;
}

.tab-btn {
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.02em;
}

.tab-btn:hover {
  color: #0f172a;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.add-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-content {
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  overflow: hidden;
  padding: 32px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.modal-title i {
  font-size: 1.5rem;
  color: #3b82f6;
}

.modal-title h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.close-btn {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Premium Form */
.premium-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.2s;
}

.input-wrapper:focus-within {
  background: white;
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper i {
  color: #94a3b8;
  font-size: 0.9rem;
}

.input-wrapper input,
.input-wrapper select,
.input-wrapper textarea {
  width: 100%;
  border: none;
  background: transparent;
  padding: 14px 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  outline: none;
}

.input-wrapper textarea {
  height: 80px;
  resize: none;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-1 { flex: 1; }

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.cancel-btn {
  flex: 1;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.save-btn {
  flex: 2;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  text-align: center;
}

.empty-state i {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.2;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-state p {
  max-width: 300px;
  line-height: 1.6;
}
</style>
