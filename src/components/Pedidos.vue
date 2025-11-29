<template>
  <div class="pedidos-container">
    <div class="button-bar">
      <button
        @click="setSection('mesa')"
        :class="{ active: currentSection === 'mesa' }"
      >
        Pedidos Mesa
      </button>
      <button
        @click="setSection('proveedores')"
        :class="{ active: currentSection === 'proveedores' }"
      >
        Pedidos Proveedores
      </button>
      <button
        @click="setSection('materiales')"
        :class="{ active: currentSection === 'materiales' }"
      >
        Pedidos Materiales
      </button>
      <button
        @click="setSection('inventario')"
        :class="{ active: currentSection === 'inventario' }"
      >
        Pedidos Inventario
      </button>
    </div>

    <!-- Pedidos de mesa por secciones -->
    <div v-if="currentSection === 'mesa'" class="pedidos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Mesas</h1>
          <div class="header-buttons">
            <button class="add-category-btn" @click="toggleAddTableForm">
              ➕ Agregar Mesa
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="table in tables"
            :key="table"
            class="category-btn"
            :class="{ active: selectedTable === table }"
            @click="selectTable(table)"
          >
            {{ table }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddOrderForm">
          Agregar Pedido
        </button>
        <div v-if="selectedTable" class="item-list">
          <h2>{{ selectedTable }}</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Items</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in getOrdersForTable(selectedTable)"
                :key="order.id"
              >
                <td>{{ order.id }}</td>
                <td>{{ order.items.join(", ") }}</td>
                <td :class="order.status.toLowerCase().replace(' ', '-')">
                  {{ order.status }}
                </td>
                <td>${{ order.total.toFixed(2) }}</td>
                <td>
                  <button class="edit-btn">Editar</button>
                  <button class="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pedidos de proveedores por secciones -->
    <div v-if="currentSection === 'proveedores'" class="pedidos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Proveedores</h1>
          <div class="header-buttons">
            <button class="add-category-btn" @click="toggleAddSupplierForm">
              ➕ Agregar Proveedor
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="supplier in suppliers"
            :key="supplier"
            class="category-btn"
            :class="{ active: selectedSupplier === supplier }"
            @click="selectSupplier(supplier)"
          >
            {{ supplier }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddSupplierOrderForm">
          Nuevo Pedido a Proveedor
        </button>
        <div v-if="selectedSupplier" class="item-list">
          <h2>{{ selectedSupplier }}</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Items</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in getOrdersForSupplier(selectedSupplier)"
                :key="order.id"
              >
                <td>{{ order.id }}</td>
                <td>{{ order.items.join(", ") }}</td>
                <td :class="order.status.toLowerCase()">{{ order.status }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <button class="edit-btn">Editar</button>
                  <button class="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pedidos de materiales por secciones -->
    <div v-if="currentSection === 'materiales'" class="pedidos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Categorías de Materiales</h1>
          <div class="header-buttons">
            <button
              class="add-category-btn"
              @click="toggleAddMaterialCategoryForm"
            >
              ➕ Agregar Categoría
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="category in materialCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedMaterialCategory === category }"
            @click="selectMaterialCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddMaterialOrderForm">
          Nuevo Pedido de Material
        </button>
        <div v-if="selectedMaterialCategory" class="item-list">
          <h2>{{ selectedMaterialCategory }}</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Proveedor</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in getOrdersForMaterialCategory(
                  selectedMaterialCategory
                )"
                :key="order.id"
              >
                <td>{{ order.id }}</td>
                <td>{{ order.material }}</td>
                <td>{{ order.quantity }}</td>
                <td>{{ order.supplier }}</td>
                <td :class="order.status.toLowerCase()">{{ order.status }}</td>
                <td>{{ order.date }}</td>
                <td>
                  <button class="edit-btn">Editar</button>
                  <button class="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pedidos de inventario por secciones -->
    <div v-if="currentSection === 'inventario'" class="pedidos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Categorías de Inventario</h1>
          <div class="header-buttons">
            <button
              class="add-category-btn"
              @click="toggleAddInventoryCategoryForm"
            >
              ➕ Agregar Categoría
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="category in inventoryCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedInventoryCategory === category }"
            @click="selectInventoryCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddInventoryRequestForm">
          Nueva Solicitud de Inventario
        </button>
        <div v-if="selectedInventoryCategory" class="item-list">
          <h2>{{ selectedInventoryCategory }}</h2>
          <table class="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Stock Actual</th>
                <th>Solicitado</th>
                <th>Razón</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in getRequestsForInventoryCategory(
                  selectedInventoryCategory
                )"
                :key="order.id"
              >
                <td>{{ order.id }}</td>
                <td>{{ order.item }}</td>
                <td>{{ order.currentStock }}</td>
                <td>{{ order.requested }}</td>
                <td>{{ order.reason }}</td>
                <td :class="order.status.toLowerCase()">{{ order.status }}</td>
                <td>
                  <button class="edit-btn">Editar</button>
                  <button class="delete-btn">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const currentSection = ref("mesa");

// Datos por  Pedidos de mesa
const mesaOrders = ref([
  {
    id: 1,
    table: "Mesa 1",
    items: ["Pizza", "Coca Cola"],
    status: "Pendiente",
    total: 25.0,
  },
  {
    id: 2,
    table: "Mesa 3",
    items: ["Hamburguesa", "Agua"],
    status: "En preparación",
    total: 15.5,
  },
]);

// Datos por  Pedidos de proveedores
const supplierOrders = ref([
  {
    id: 1,
    supplier: "Distribuidora ABC",
    items: ["Coca Cola x20", "Sprite x15"],
    status: "Pendiente",
    date: "2024-01-15",
  },
  {
    id: 2,
    supplier: "Verduras Frescas",
    items: ["Lechuga x10kg", "Tomate x5kg"],
    status: "Entregado",
    date: "2024-01-10",
  },
]);

// Datos por  Pedidos de materiales
const materialOrders = ref([
  {
    id: 1,
    material: "Servilletas",
    quantity: 100,
    supplier: "Papelera XYZ",
    status: "Pendiente",
    date: "2024-01-16",
  },
  {
    id: 2,
    material: "Platos",
    quantity: 50,
    supplier: "Cerámica Ltd",
    status: "Recibido",
    date: "2024-01-12",
  },
]);

// Datos por  Pedidos de inventario
const inventoryOrders = ref([
  {
    id: 1,
    item: "Coca Cola",
    currentStock: 5,
    requested: 20,
    reason: "Stock bajo",
    status: "Aprobado",
  },
  {
    id: 2,
    item: "Lechuga",
    currentStock: 2,
    requested: 15,
    reason: "Reabastecimiento semanal",
    status: "Pendiente",
  },
]);

const setSection = (section) => {
  currentSection.value = section;
};

// Registro de actividad
const activityLog = ref([]);

// Función para agregar actividad al registro
const addToLog = (action, details, section) => {
  const timestamp = new Date().toLocaleString();
  activityLog.value.unshift({
    id: Date.now(),
    timestamp,
    action,
    details,
    section,
  });
  // Mantener solo las últimas 50 entradas
  if (activityLog.value.length > 50) {
    activityLog.value = activityLog.value.slice(0, 50);
  }
};

// Funciones de marcador de posición para acciones
const toggleAddTableForm = () => {
  addToLog("Acción", "Abrir formulario para agregar mesa", "Pedidos Mesa");
};

const toggleAddOrderForm = () => {
  addToLog("Acción", "Abrir formulario para agregar pedido", "Pedidos Mesa");
};

const toggleAddSupplierForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para agregar proveedor",
    "Pedidos Proveedores"
  );
};

const toggleAddSupplierOrderForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para nuevo pedido a proveedor",
    "Pedidos Proveedores"
  );
};

const toggleAddMaterialCategoryForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para agregar categoría de material",
    "Pedidos Materiales"
  );
};

const toggleAddMaterialOrderForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para nuevo pedido de material",
    "Pedidos Materiales"
  );
};

const toggleAddInventoryCategoryForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para agregar categoría de inventario",
    "Pedidos Inventario"
  );
};

const toggleAddInventoryRequestForm = () => {
  addToLog(
    "Acción",
    "Abrir formulario para nueva solicitud de inventario",
    "Pedidos Inventario"
  );
};

const tables = ref([]);
const suppliers = ref([
  "Distribuidora ABC",
  "Verduras Frescas",
  "Carnes Premium",
]);
const materialCategories = ref(["Servilletas", "Platos", "Utensilios"]);
const inventoryCategories = ref(["Bebidas", "Comidas", "Ingredientes"]);

const selectedTable = ref("");
const selectedSupplier = ref("");
const selectedMaterialCategory = ref("");
const selectedInventoryCategory = ref("");

const selectTable = (table) => {
  selectedTable.value = table;
  addToLog("Selección", `Seleccionada mesa: ${table}`, "Pedidos Mesa");
};

const selectSupplier = (supplier) => {
  selectedSupplier.value = supplier;
  addToLog(
    "Selección",
    `Seleccionado proveedor: ${supplier}`,
    "Pedidos Proveedores"
  );
};

const selectMaterialCategory = (category) => {
  selectedMaterialCategory.value = category;
  addToLog(
    "Selección",
    `Seleccionada categoría: ${category}`,
    "Pedidos Materiales"
  );
};

const selectInventoryCategory = (category) => {
  selectedInventoryCategory.value = category;
  addToLog(
    "Selección",
    `Seleccionada categoría: ${category}`,
    "Pedidos Inventario"
  );
};

const getOrdersForTable = (table) => {
  return mesaOrders.value.filter((order) => order.table === table);
};

const getOrdersForSupplier = (supplier) => {
  return supplierOrders.value.filter((order) => order.supplier === supplier);
};

const getOrdersForMaterialCategory = (category) => {
  return materialOrders.value.filter((order) =>
    order.material.toLowerCase().includes(category.toLowerCase())
  );
};

const getRequestsForInventoryCategory = (category) => {
  return inventoryOrders.value.filter((order) =>
    order.item.toLowerCase().includes(category.toLowerCase())
  );
};

// Función para actualizar tablas desde localStorage
const updateTables = () => {
  const data = localStorage.getItem("mesasRestaurante");
  if (data) {
    const mesas = JSON.parse(data);
    return mesas.map((mesa) => mesa.id.toUpperCase());
  }
  return [];
};

// Inicializar mesas al montar
onMounted(() => {
  tables.value = updateTables();
});

// Escuchar cambios en el almacenamiento
window.addEventListener("storage", (e) => {
  if (e.key === "mesasRestaurante") {
    tables.value = updateTables();
  }
});
</script>

<style scoped>
@import "../style.css";

.pedidos-container {
  position: relative;
}

.button-bar {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(26, 46, 82, 0.733);
  border-radius: 1px;
  position: fixed;
  top: 48px; /* Ajuste según la altura de la barra de navegación */
  left: 0;
  width: 100%;
  z-index: 999;
  pointer-events: auto;
}

.button-bar button {
  background: #3182ce;
  border: none;
  color: white;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.3rem 0.3rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  white-space: nowrap;
}

.button-bar button:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.button-bar button:focus {
  outline: 2px solid #3182ce;
  outline-offset: 2px;
  transition: outline 0.1s ease;
}

.button-bar button.active {
  background: #2c5282;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.pedidos-page {
  display: flex;
  position: fixed;
  top: 100px; /* Ajustar según la altura de la barra de navegación */
  left: 0;
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.left-side {
  flex: 0 0 30%;
  padding: 1rem;
  background: #dedede7b;
  border-right: 1px solid #e2e8f0;
  border-radius: 10px 0 0 10px;
  overflow-y: auto;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #2d3748;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-btn {
  display: block;
  margin-top: 5%;
  margin-bottom: -2rem;
  background: #edf2f7;
  border: 1px solid #cbd5e0;
  color: #4a5568;
  padding: 0.4rem 0.2rem;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: all 0.1s ease;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-btn:hover {
  background: #e2e8f0;
}

.category-btn.active {
  background: #4b9feed6;
  color: white;
}

.right-side {
  flex: 1;
  padding: 1rem;
  background: #ffffff;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.add-btn {
  display: block;
  width: 28%;
  height: auto;
  background: #2ca53e;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 1rem;
  transition: background 0.2s ease;
}

.add-btn:hover {
  background: #2f855a;
}

.item-list h2 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.item-list ul {
  list-style: none;
  padding: 0;
}

.item-list li {
  padding: 0.25rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 1rem;
}

.orders-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.orders-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
  color: #4a5568;
}

.orders-table tbody tr:hover {
  background: #f7fafc;
}

.orders-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.status-pendiente {
  background: #fef5e7;
  color: #d69e2e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-entregado,
.status-recibido,
.status-aprobado {
  background: #f0fff4;
  color: #38a169;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-en-preparación {
  background: #ebf8ff;
  color: #3182ce;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.edit-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  margin-right: 0.5rem;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  background: #2c5282;
  transform: translateY(-1px);
}

.delete-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

.header-buttons {
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 0.5rem;
  align-items: center;
  margin-right: -0.5rem;
  margin-left: auto;
  margin-top: -0.5rem;
}

.header-buttons button {
  padding: 0.65rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.add-category-btn {
  background-color: #56cf44;
  color: white;
  width: 80%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.8s ease;
  padding: 0.35rem 0.5rem;
  font-size: 1rem;
  white-space: nowrap;
}

.add-category-btn:hover {
  background-color: #258714c6;
}

.activity-log-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.activity-log-section h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
}

.activity-log {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.activity-item {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}

.activity-item:hover {
  background: #f8fafc;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.activity-timestamp {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.activity-section {
  font-size: 0.75rem;
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.activity-content {
  font-size: 0.9rem;
  color: #2d3748;
  line-height: 1.4;
}

.no-activity {
  padding: 2rem;
  text-align: center;
  color: #a0aec0;
  font-style: italic;
}

@media (max-width: 768px) {
  .button-bar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .orders-table {
    font-size: 0.8rem;
  }

  .orders-table th,
  .orders-table td {
    padding: 0.5rem;
  }

  .pedidos-page {
    flex-direction: column;
  }

  .left-side {
    flex: 0 0 auto;
    max-height: 200px;
    border-radius: 10px 10px 0 0;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .right-side {
    flex: 1;
    border-radius: 0 0 10px 10px;
  }
}
</style>
