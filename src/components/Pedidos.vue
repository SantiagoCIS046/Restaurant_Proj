<template>
  <div class="pedidos-layout">
    <!-- Premium Sidebar (Admin View) -->
    <aside v-if="!vistaCliente" class="pedidos-sidebar shadow-premium">
      <div class="sidebar-header">
        <div class="brand-logo">
          <i class="fas fa-clipboard-list"></i>
        </div>
        <div class="brand-text">
          <h3>EPICURE PRO</h3>
          <span>GESTIÓN PEDIDOS</span>
        </div>
      </div>
      
      <div class="sidebar-divider"></div>
      
      <nav class="sidebar-nav">
        <button 
          v-for="section in sections" 
          :key="section.id"
          class="nav-item"
          :class="{ active: currentSection === section.id }"
          @click="setSection(section.id)"
        >
          <div class="icon-box">
            <i :class="section.icon"></i>
          </div>
          <span>{{ section.label }}</span>
          <i v-if="currentSection === section.id" class="fas fa-chevron-right active-indicator"></i>
        </button>
      </nav>

      <div class="view-toggle-container">
        <button @click="toggleView" class="view-toggle-btn secondary">
          <i class="fas fa-shopping-cart"></i>
          <span>Vista Cliente</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="pedidos-main" :class="{ 'full-width': vistaCliente }">
      <!-- Client View Toggle (Visible in Client View) -->
      <button v-if="vistaCliente" @click="toggleView" class="client-view-toggle glass-effect">
        <i class="fas fa-user-shield"></i>
        <span>Panel Administrativo</span>
      </button>

      <!-- Content Header (Admin Only) -->
      <header v-if="!vistaCliente" class="content-header glass-effect">
        <div class="header-info">
          <div class="header-breadcrumb">
            <span>Administración</span>
            <i class="fas fa-chevron-right"></i>
            <span class="current">{{ getCurrentSectionLabel() }}</span>
          </div>
          <h1 class="header-title">{{ getCurrentSectionLabel() }}</h1>
        </div>

        <div class="header-actions">
          
          <template v-if="currentSection === 'proveedores'">
            <button class="add-btn premium" @click="toggleAddSupplierForm">
              <i class="fas fa-user-plus"></i>
              <span>Nuevo Proveedor</span>
            </button>
            <button class="secondary-btn" @click="toggleAddSupplierOrderForm">
              <i class="fas fa-truck"></i>
              <span>Realizar Pedido</span>
            </button>
          </template>

          <template v-if="currentSection === 'materiales'">
             <button class="add-btn premium" @click="showAddMaterialOrderModal = true">
              <i class="fas fa-shopping-basket"></i>
              <span>Nuevo Pedido</span>
            </button>
          </template>
        </div>
      </header>

      <div class="content-body" :class="{ 'no-padding': vistaCliente }">
        <!-- VISTA CLIENTE -->
        <div v-if="vistaCliente" class="vista-cliente-wrapper">
          <div class="cliente-hero">
            <div class="hero-content">
              <span class="hero-badge">MENÚ EXCLUSIVO</span>
              <h1>Nuestra Selección <span class="text-gradient">Epicure</span></h1>
              <p>Experiencia gastronómica de primer nivel a un clic de distancia.</p>
            </div>
            <div class="search-bar-premium">
              <i class="fas fa-search"></i>
              <input v-model="searchQuery" type="text" placeholder="Buscar en el menú...">
            </div>
          </div>

          <div class="cliente-layout-premium">
            <!-- Products Panel -->
            <div class="products-container">
              <div class="categories-capsules">
                <button 
                  class="capsule-btn" 
                  :class="{ active: !selectedCategory }"
                  @click="selectedCategory = ''"
                >Todos</button>
                <button 
                  v-for="cat in categorias" 
                  :key="cat" 
                  class="capsule-btn"
                  :class="{ active: selectedCategory === cat }"
                  @click="selectedCategory = cat"
                >{{ cat }}</button>
              </div>

              <div class="premium-products-grid">
                <div 
                  v-for="producto in productosFiltrados" 
                  :key="producto.id" 
                  class="product-card-premium shadow-premium"
                  :class="{ 'out-of-stock': producto.quantity === 0 }"
                >
                  <div class="product-image-placeholder">
                    <i class="fas fa-utensils"></i>
                    <div v-if="producto.quantity === 0" class="stock-overlay">AGOTADO</div>
                  </div>
                  <div class="product-info-premium">
                    <div class="product-header">
                      <h3>{{ producto.name }}</h3>
                      <span class="price-tag">${{ producto.price.toLocaleString() }}</span>
                    </div>
                    <p class="product-desc">{{ producto.ingredients.join(', ') }}</p>
                    <div class="product-footer-premium">
                      <div class="stock-info">
                        <i class="fas fa-box"></i>
                        <span>Stock: {{ producto.quantity }}</span>
                      </div>
                      <button 
                        @click="agregarAlCarrito(producto)" 
                        :disabled="producto.quantity === 0"
                        class="add-to-cart-btn"
                      >
                        <i class="fas fa-plus"></i>
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modern Cart Panel -->
            <div class="cart-panel-premium glass-effect shadow-premium">
              <div class="cart-header-premium">
                <div class="title-with-count">
                  <h2>Su Pedido</h2>
                  <span class="cart-count">{{ carrito.length }}</span>
                </div>
                <button v-if="carrito.length > 0" @click="vaciarCarrito" class="text-btn">Vaciar</button>
              </div>

              <div class="cart-content-premium">
                <div v-if="carrito.length === 0" class="empty-cart-state">
                  <i class="fas fa-shopping-basket"></i>
                  <p>Tu canasta está vacía</p>
                  <span>Empieza a agregar delicias</span>
                </div>

                <div v-else class="cart-items-list">
                  <div v-for="item in carrito" :key="item.id" class="cart-item-premium">
                    <div class="item-main">
                      <div class="item-meta">
                        <h4>{{ item.name }}</h4>
                        <span>${{ item.price.toLocaleString() }} c/u</span>
                      </div>
                      <div class="item-total-line">
                        ${{ (item.price * item.cantidad).toLocaleString() }}
                      </div>
                    </div>
                    <div class="item-actions-premium">
                      <div class="quantity-stepper">
                        <button @click="disminuirCantidad(item)"><i class="fas fa-minus"></i></button>
                        <span>{{ item.cantidad }}</span>
                        <button @click="aumentarCantidad(item)"><i class="fas fa-plus"></i></button>
                      </div>
                      <button @click="eliminarDelCarrito(item)" class="remove-btn">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="carrito.length > 0" class="cart-footer-premium">
                <div class="summary-details">
                  <div class="summary-row">
                    <span>Subtotal</span>
                    <span>${{ calcularSubtotal().toLocaleString() }}</span>
                  </div>
                  <div class="summary-row">
                    <span>IVA (19%)</span>
                    <span>${{ Math.round(calcularIVA()).toLocaleString() }}</span>
                  </div>
                  <div class="summary-row total">
                    <span>Total</span>
                    <span>${{ Math.round(calcularTotal()).toLocaleString() }}</span>
                  </div>
                </div>
                <button @click="mostrarFormularioPedido = true" class="checkout-btn">
                  <span>Confirmar Pedido</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- VISTA ADMINISTRATIVA -->
        <div v-else class="admin-content">
          <!-- Mesa Section -->
          <div v-if="currentSection === 'mesa'" class="section-container animate-fade-in">
            <div class="split-layout">
              <div class="list-panel card-premium">
                <div class="panel-header">
                  <h3>Mesas Registradas</h3>
                </div>
                <div class="item-grid">
                  <button
                    v-for="table in tables"
                    :key="table"
                    class="grid-item-compact"
                    :class="{ active: selectedTable === table, occupied: getTableStatus(table) === 'ocupado' }"
                    @click="selectTable(table)"
                  >
                    <div class="table-icon">
                      <i class="fas fa-chair"></i>
                    </div>
                    <span>{{ table }}</span>
                    <div class="status-dot"></div>
                  </button>
                </div>
              </div>

              <div class="detail-panel">
                <div v-if="selectedTable" class="table-detail-card glass-effect shadow-premium">
                  <div class="card-header">
                    <div class="header-main">
                      <i class="fas fa-utensils"></i>
                      <h2>Detalles: {{ selectedTable }}</h2>
                    </div>
                    <div class="status-indicator-premium" :class="getTableStatus(selectedTable)">
                      <span class="dot pulse"></span>
                      {{ getTableStatusLabel(selectedTable) }}
                    </div>
                  </div>
                  
                  <div class="premium-table-wrapper">
                    <table class="epicure-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>ELEMENTOS</th>
                          <th>ESTADO</th>
                          <th>TOTAL</th>
                          <th class="actions-col">ACCIONES</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="order in getOrdersForTable(selectedTable)" :key="order.id">
                          <td class="id-tag">#{{ order.id }}</td>
                          <td class="items-cell">
                            <span v-for="(item, idx) in order.items" :key="idx" class="item-chip">
                              {{ item }}
                            </span>
                          </td>
                          <td>
                            <span class="status-badge" :class="order.status.toLowerCase().replace(' ', '-')">
                              {{ order.status }}
                            </span>
                          </td>
                          <td class="price-cell">${{ order.total.toLocaleString() }}</td>
                          <td class="actions-cell">
                            <button class="action-icon-btn edit" title="Editar"><i class="fas fa-edit"></i></button>
                            <button class="action-icon-btn delete" title="Cancelar"><i class="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                        <tr v-if="getOrdersForTable(selectedTable).length === 0">
                          <td colspan="5" class="empty-row-msg">
                            <i class="fas fa-info-circle"></i>
                            Sin pedidos activos para esta mesa.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="empty-selection-state">
                  <div class="empty-icon-box">
                    <i class="fas fa-hand-pointer"></i>
                  </div>
                  <h2>Seleccione una Mesa</h2>
                  <p>Haga clic en una mesa de la lista lateral para visualizar sus pedidos y estado actual.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Proveedores Section -->
          <div v-if="currentSection === 'proveedores'" class="section-container animate-fade-in">
            <div class="split-layout">
              <div class="list-panel card-premium">
                <div class="panel-header">
                  <h3>Directorio Proveedores</h3>
                </div>
                <div class="item-list-container">
                  <button
                    v-for="supplier in suppliersData"
                    :key="supplier.id"
                    class="list-item-premium"
                    :class="{ active: selectedSupplier?.id === supplier.id }"
                    @click="selectedSupplier = supplier"
                  >
                    <div class="item-icon-box">
                      <i :class="supplier.icon"></i>
                    </div>
                    <div class="item-text">
                      <span class="item-name">{{ supplier.name }}</span>
                      <span class="item-category-badge">{{ supplier.category }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <div class="detail-panel">
                <div v-if="selectedSupplier" class="table-detail-card glass-effect shadow-premium">
                  <div class="card-header">
                    <div class="header-main">
                      <i class="fas fa-address-card"></i>
                      <h2>{{ selectedSupplier.name }}</h2>
                    </div>
                    <button class="btn-info-premium" @click="viewSupplierInfo(selectedSupplier.name)">
                      <i class="fas fa-external-link-alt"></i> Ficha Técnica
                    </button>
                  </div>

                  <div class="info-summary-grid">
                    <div class="summary-item">
                      <label>Contacto</label>
                      <span>{{ selectedSupplier.contact.email }}</span>
                    </div>
                    <div class="summary-item">
                      <label>Teléfono</label>
                      <span>{{ selectedSupplier.contact.phone }}</span>
                    </div>
                    <div class="summary-item">
                      <label>Estado</label>
                      <span class="status-indicator-premium" :class="selectedSupplier.active ? 'disponible' : 'ocupado'">
                        {{ selectedSupplier.active ? 'Verificado' : 'En Pausa' }}
                      </span>
                    </div>
                  </div>

                  <div class="premium-table-wrapper">
                    <h4 class="table-subtitle">Historial de Suministros</h4>
                    <table class="epicure-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>ITEMS</th>
                          <th>ESTADO</th>
                          <th>RECIBIDO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="order in supplierOrders.filter(o => o.supplier === selectedSupplier.name)" :key="order.id">
                          <td class="id-tag">#{{ order.id }}</td>
                          <td>{{ order.items.join(', ') }}</td>
                          <td>
                            <span class="status-badge" :class="order.status.toLowerCase()">
                              {{ order.status }}
                            </span>
                          </td>
                          <td>{{ order.date }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="empty-selection-state">
                  <div class="empty-icon-box">
                    <i class="fas fa-truck-loading"></i>
                  </div>
                  <h2>Catálogo de Proveedores</h2>
                  <p>Seleccione un aliado comercial para gestionar pedidos y visualizar información crítica de contacto.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Materiales Section -->
          <div v-if="currentSection === 'materiales'" class="section-container animate-fade-in">
            <div class="split-layout">
              <div class="list-panel card-premium">
                <div class="panel-header">
                  <h3>Categorías Materiales</h3>
                </div>
                <div class="item-grid-compact">
                  <button
                    v-for="category in materialCategories"
                    :key="category"
                    class="grid-item-card"
                    :class="{ active: selectedMaterialCategory === category }"
                    @click="selectedMaterialCategory = category"
                  >
                    <i class="fas fa-box-open"></i>
                    <span>{{ category }}</span>
                  </button>
                </div>
              </div>

              <div class="detail-panel">
                <div v-if="selectedMaterialCategory" class="table-detail-card glass-effect shadow-premium">
                  <div class="card-header">
                    <div class="header-main">
                      <i class="fas fa-tags"></i>
                      <h2>Suministros: {{ selectedMaterialCategory }}</h2>
                    </div>
                  </div>

                  <div class="premium-table-wrapper">
                    <table class="epicure-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>MATERIAL</th>
                          <th>STOCK</th>
                          <th>PROVEEDOR</th>
                          <th>ESTADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="order in materialOrders" :key="order.id">
                          <td class="id-tag">#{{ order.id }}</td>
                          <td class="font-bold">{{ order.material }}</td>
                          <td class="price-cell">{{ order.quantity }} un.</td>
                          <td>{{ order.supplier }}</td>
                          <td>
                            <span class="status-badge" :class="order.status.toLowerCase()">
                              {{ order.status }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="empty-selection-state">
                  <div class="empty-icon-box">
                    <i class="fas fa-toolbox"></i>
                  </div>
                  <h2>Gestión de Materiales</h2>
                  <p>Seleccione una categoría para realizar auditoría de stock y programar nuevos pedidos de insumos.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Inventario Section -->
          <div v-if="currentSection === 'inventario'" class="section-container animate-fade-in">
            <div class="split-layout">
              <div class="list-panel card-premium">
                <div class="panel-header">
                  <h3>Bodega Central</h3>
                </div>
                <div class="item-grid-compact">
                  <button
                    v-for="category in inventoryCategories"
                    :key="category"
                    class="grid-item-card"
                    :class="{ active: selectedInventoryCategory === category }"
                    @click="selectedInventoryCategory = category"
                  >
                    <i class="fas fa-warehouse"></i>
                    <span>{{ category }}</span>
                  </button>
                </div>
              </div>

              <div class="detail-panel">
                <div v-if="selectedInventoryCategory" class="table-detail-card glass-effect shadow-premium">
                  <div class="card-header">
                    <div class="header-main">
                      <i class="fas fa-clipboard-check"></i>
                      <h2>Solicitudes: {{ selectedInventoryCategory }}</h2>
                    </div>
                    <button class="add-btn premium" @click="showAddInventoryRequestModal = true">
                      <i class="fas fa-plus"></i> Nueva Solicitud
                    </button>
                  </div>

                  <div class="premium-table-wrapper">
                    <table class="epicure-table">
                      <thead>
                        <tr>
                          <th>ITEM</th>
                          <th>STOCK ACTUAL</th>
                          <th>PEDIDO</th>
                          <th>ESTADO</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="request in inventoryRequests" :key="request.id">
                          <td class="font-bold">{{ request.item }}</td>
                          <td>{{ request.currentStock }}</td>
                          <td class="price-cell highlight">{{ request.requested }}</td>
                          <td>
                            <span class="status-badge" :class="request.status.toLowerCase()">
                              {{ request.status }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="empty-selection-state">
                  <div class="empty-icon-box">
                    <i class="fas fa-boxes"></i>
                  </div>
                  <h2>Gestión de Inventario</h2>
                  <p>Monitoreo en tiempo real de alimentos y bebidas. Gestione solicitudes de reabastecimiento crítico.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODALES - CLIENTE -->
    <div v-if="mostrarFormularioPedido" class="modal-overlay" @click.self="mostrarFormularioPedido = false">
      <div class="modal-content pedido-modal glass-modal slide-up">
        <span class="close-modal" @click="mostrarFormularioPedido = false">&times;</span>
        <div class="modal-brand">
          <i class="fas fa-utensils"></i>
          <h2>FINALIZAR PEDIDO</h2>
        </div>

        <form @submit.prevent="confirmarPedido" class="epicure-form">
          <div class="form-section">
            <label class="section-label">Tipo de Entrega</label>
            <div class="tipo-pedido-grid">
              <button type="button" @click="pedidoForm.tipo = 'mesa'" :class="{ active: pedidoForm.tipo === 'mesa' }">
                <i class="fas fa-chair"></i> Mesa
              </button>
              <button type="button" @click="pedidoForm.tipo = 'mostrador'" :class="{ active: pedidoForm.tipo === 'mostrador' }">
                <i class="fas fa-store"></i> Para Recoger
              </button>
              <button type="button" @click="pedidoForm.tipo = 'domicilio'" :class="{ active: pedidoForm.tipo === 'domicilio' }">
                <i class="fas fa-home"></i> Domicilio
              </button>
            </div>
          </div>

          <div v-if="pedidoForm.tipo === 'mesa'" class="form-group animate-float-in">
            <label>Mesa de Comedor</label>
            <select v-model="pedidoForm.mesaId" required class="premium-select">
              <option value="">Seleccione su mesa...</option>
              <option v-for="mesaId in tables" :key="mesaId" :value="mesaId">{{ mesaId }}</option>
            </select>
          </div>

          <div v-if="pedidoForm.tipo === 'domicilio'" class="form-group animate-float-in">
            <label>Dirección de Entrega</label>
            <input v-model="pedidoForm.direccion" type="text" placeholder="Ej: Calle 10 #23-45" required class="premium-input">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nombre</label>
              <input v-model="pedidoForm.cliente.nombre" type="text" required class="premium-input">
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="pedidoForm.cliente.telefono" type="tel" required class="premium-input">
            </div>
          </div>

          <div class="form-group">
            <label>Método de Pago</label>
            <select v-model="pedidoForm.metodoPago" required class="premium-select">
              <option value="">Seleccione método...</option>
              <option value="Efectivo">Efectivo al Recibir</option>
              <option value="Tarjeta">Tarjeta (Datafono)</option>
              <option value="Transferencia">Transferencia Bancaria</option>
            </select>
          </div>

          <div class="order-summary-box">
             <div class="summary-line total-highlight">
               <span>Total a Pagar</span>
               <span>${{ calcularTotal().toLocaleString() }}</span>
             </div>
          </div>

          <div class="form-actions-premium">
            <button type="button" @click="mostrarFormularioPedido = false" class="btn-cancel">Cancelar</button>
            <button type="submit" class="btn-confirm-order">Confirmar y Enviar <i class="fas fa-paper-plane"></i></button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Confirmación Exitosa -->
    <div v-if="mostrarConfirmacion" class="modal-overlay" @click.self="cerrarConfirmacion">
      <div class="modal-content confirm-success-modal glass-modal animate-pop">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h2>¡Orden Recibida!</h2>
        <p class="order-id-display">ID: <strong>{{ ultimoPedidoId }}</strong></p>
        <p class="helper-text">Estamos preparando su selección con el más alto estándar Epicure.</p>
        <button @click="cerrarConfirmacion" class="btn-primary-premium">Continuar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Application State
const vistaCliente = ref(false);
const currentSection = ref("mesa");
const selectedTable = ref(null);
const selectedSupplier = ref(null);
const selectedMaterialCategory = ref(null);
const selectedInventoryCategory = ref(null);

// Sidebar Navigation
const sections = [
  { id: 'mesa', label: 'Pedidos Mesa', icon: 'fas fa-chair' },
  { id: 'proveedores', label: 'Proveedores', icon: 'fas fa-truck-loading' },
  { id: 'materiales', label: 'Insumos', icon: 'fas fa-box-open' },
  { id: 'inventario', label: 'Bodega', icon: 'fas fa-warehouse' }
];

const getCurrentSectionLabel = () => {
  return sections.find(s => s.id === currentSection.value)?.label || '';
};

const toggleView = () => {
  vistaCliente.value = !vistaCliente.value;
};

const setSection = (section) => {
  currentSection.value = section;
  selectedTable.value = null;
  selectedSupplier.value = null;
  selectedMaterialCategory.value = null;
  selectedInventoryCategory.value = null;
};

// --- DATA STRUCTURES ---

// Tables Data
const tables = ref(["MESA 1", "MESA 2", "MESA 3", "MESA 4", "MESA 5", "MESA 6"]);

// Initial Orders Data
const mesaOrders = ref([
  { id: 101, table: "MESA 1", items: ["Pizza Margherita", "Coca Cola"], status: "Preparando", total: 45000 },
  { id: 102, table: "MESA 3", items: ["Hamburguesa Wagyu", "Papas Fritas"], status: "Pendiente", total: 68000 },
  { id: 103, table: "MESA 1", items: ["Tiramisú"], status: "Servido", total: 18000 },
]);

const suppliersData = ref([
  { id: 1, name: "Distribuidora ABC Bebidas", category: "Bebidas & Sifones", contact: { email: "ventas@abcbev.com", phone: "+57 300 123 4567" }, icon: "fas fa-wine-glass-alt", active: true },
  { id: 2, name: "Huerta & Campo", category: "Vegetales & Frutas", contact: { email: "pedidos@huertacampo.co", phone: "+57 310 987 6543" }, icon: "fas fa-carrot", active: true },
  { id: 3, name: "Carnes de la Sierra", category: "Res & Aves", contact: { email: "logistica@sierracarnes.com", phone: "+57 315 222 3344" }, icon: "fas fa-drumstick-bite", active: true },
  { id: 4, name: "Mariscos del Pacífico", category: "Pescados & Mariscos", contact: { email: "frescura@pacificosea.com", phone: "+57 320 444 5566" }, icon: "fas fa-fish", active: true },
  { id: 5, name: "Panadería Gourmet 24/7", category: "Panadería & Repostería", contact: { email: "admin@panaderiagourmet.com", phone: "+57 301 777 8899" }, icon: "fas fa-bread-slice", active: true },
]);

const supplierOrders = ref([
  { id: 1, supplier: "Distribuidora ABC", items: ["Coca Cola x20"], status: "Pendiente", date: "2024-03-22" },
]);

const materialCategories = ref(["Papelería", "Limpieza", "Vajilla"]);
const materialOrders = ref([
  { id: 1, material: "Servilletas", quantity: 100, supplier: "Papelera XYZ", status: "Pendiente", date: "2024-03-21" },
]);

const inventoryCategories = ref(["Lácteos", "Carnes", "Bebidas"]);
const inventoryRequests = ref([
  { id: 1, item: "Leche Entera", currentStock: 5, requested: 20, status: "Aprobado" },
]);

// --- HELPER FUNCTIONS ---

const getOrdersForTable = (table) => {
  return mesaOrders.value.filter(o => o.table === table);
};

const getTableStatus = (table) => {
  const tableOrders = getOrdersForTable(table);
  return tableOrders.length > 0 ? 'ocupado' : 'disponible';
};

const getTableStatusLabel = (table) => {
  return getTableStatus(table) === 'ocupado' ? 'Ocupada' : 'Disponible';
};

const selectTable = (table) => {
  selectedTable.value = table;
};

// --- CLIENT LOGIC ---
const searchQuery = ref("");
const selectedCategory = ref("");
const carrito = ref([]);
const mostrarFormularioPedido = ref(false);
const mostrarConfirmacion = ref(false);
const ultimoPedidoId = ref("");

const categorias = ["Bebidas", "Entradas", "Res", "Cerdo", "Pastas", "Postres"];
const productos = ref([
  { id: 1, name: "Pizza Margherita", category: "Entradas", price: 35000, quantity: 10, ingredients: ["Queso", "Tomate", "Albahaca"] },
  { id: 2, name: "Hamburguesa Wagyu", category: "Res", price: 55000, quantity: 5, ingredients: ["Carne Wagyu", "Cebolla", "Pan Artisanal"] },
  { id: 3, name: "Coca Cola", category: "Bebidas", price: 5000, quantity: 50, ingredients: ["Bebida Gaseosa"] },
]);

const productosFiltrados = computed(() => {
  let filtered = productos.value;
  if (selectedCategory.value) filtered = filtered.filter(p => p.category === selectedCategory.value);
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }
  return filtered;
});

const agregarAlCarrito = (p) => {
  const item = carrito.value.find(i => i.id === p.id);
  if (item) {
    if (item.cantidad < p.quantity) item.cantidad++;
  } else {
    carrito.value.push({ ...p, cantidad: 1 });
  }
};

const eliminarDelCarrito = (i) => carrito.value = carrito.value.filter(item => item.id !== i.id);
const aumentarCantidad = (i) => i.cantidad < productos.value.find(p => p.id === i.id).quantity && i.cantidad++;
const disminuirCantidad = (i) => i.cantidad > 1 ? i.cantidad-- : eliminarDelCarrito(i);
const vaciarCarrito = () => carrito.value = [];

const calcularSubtotal = () => carrito.value.reduce((acc, i) => acc + (i.price * i.cantidad), 0);
const calcularIVA = () => calcularSubtotal() * 0.19;
const calcularTotal = () => calcularSubtotal() + calcularIVA();

const pedidoForm = ref({
  tipo: 'mesa',
  mesaId: '',
  direccion: '',
  cliente: { nombre: '', telefono: '' },
  metodoPago: ''
});

const confirmarPedido = () => {
  ultimoPedidoId.value = `EP-${Math.floor(1000 + Math.random() * 9000)}`;
  mostrarFormularioPedido.value = false;
  mostrarConfirmacion.value = true;
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
  carrito.value = [];
};

// --- MODAL PLACEHOLDERS ---
const showAddTableModal = ref(false);
const showAddOrderModal = ref(false);
const showAddSupplierModal = ref(false);
const showAddInventoryRequestModal = ref(false);

const toggleAddOrderForm = () => showAddOrderModal.value = true;
const toggleAddTableForm = () => showAddTableModal.value = true;
const toggleAddSupplierForm = () => showAddSupplierModal.value = true;
const toggleAddSupplierOrderForm = () => {};
const viewSupplierInfo = (name) => {};

onMounted(() => {
  const data = localStorage.getItem("mesasRestaurante");
  if (data) tables.value = JSON.parse(data).map(m => m.id.toUpperCase());
});
</script>

<style scoped>
:root {
  --accent-color: #10b981;
  --accent-glow: rgba(16, 185, 129, 0.2);
  --bg-primary: #f8fafc;
  --bg-card: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --border-color: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.pedidos-layout {
  display: flex;
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
  font-family: 'Outfit', sans-serif;
  padding-top: 56px;
  box-sizing: border-box;
}

/* --- Sidebar Administrative --- */
.pedidos-sidebar {
  width: 300px;
  background: white;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
}

.brand-logo {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2);
}

.brand-text h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 1px;
  margin: 0;
}

.brand-text span {
  font-size: 0.7rem;
  color: var(--accent-color);
  font-weight: 700;
  text-transform: uppercase;
}

.sidebar-divider {
  height: 1px;
  background: var(--border-color);
  margin-bottom: 30px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 14px 18px;
  background: transparent;
  border: none;
  border-radius: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.nav-item:hover {
  background: #f1f5f9;
  color: var(--text-primary);
}

.nav-item.active {
  background: #ecfdf5;
  color: var(--accent-color);
}

.icon-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #f1f5f9;
  font-size: 1rem;
  transition: all 0.2s;
}

.nav-item.active .icon-box {
  background: var(--accent-color);
  color: white;
}

.view-toggle-btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  background: var(--accent-color);
  color: white;
  border: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.2s;
}

.view-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.4);
}

/* --- Main Content --- */
.pedidos-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.content-header {
  padding: 30px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 5px 0 0 0;
}

.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.8rem;
  font-weight: 500;
}

.header-breadcrumb .current {
  color: var(--accent-color);
  font-weight: 700;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.add-btn.premium {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 14px 28px;
  border-radius: 14px;
  border: none;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(16, 185, 129, 0.25);
  transition: all 0.2s;
}

.add-btn.premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
}

.secondary-btn {
  background: white;
  border: 2px solid #3b82f6;
  color: #3b82f6;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(59, 130, 246, 0.15);
}

/* --- Custom Scrollbar --- */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}

.content-body {
  flex: 1;
  padding: 30px 40px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.section-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

/* --- Split Layout & Cards --- */
.split-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  flex: 1;
  height: 100%;
  overflow: hidden;
  min-height: 0;
}

.list-panel {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  height: 100%;
  min-height: 0;
}

.panel-header {
  padding: 22px 30px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
}

.action-icon-btn.premium {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2);
}

.action-icon-btn.secondary {
  background: #eff6ff;
  color: #3b82f6;
  border: 1px solid #dbeafe;
}

.action-icon-btn:hover {
  transform: translateY(-1px) scale(1.05);
  filter: brightness(1.1);
}

.item-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 20px 40px 20px;
  overflow-y: auto !important;
  flex: 1;
  height: 0;
  min-height: 0;
}

.list-item-premium {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.list-item-premium:hover {
  background: #f8fafc;
  border-color: var(--accent-color);
  transform: translateX(4px);
}

.list-item-premium.active {
  background: #eff6ff;
  border: 2px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.item-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.list-item-premium.active .item-icon-box {
  background: #3b82f6;
  color: white;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-name {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.item-category-badge {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #3b82f6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-grid {
  padding: 20px 20px 40px 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  overflow-y: auto !important;
  align-content: start;
  flex: 1;
  height: 0;
  min-height: 0;
}

.grid-item-compact {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: var(--shadow-sm);
}

.grid-item-compact i {
  font-size: 1.2rem;
  margin-bottom: 2px;
}

.grid-item-compact span {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.grid-item-compact:hover {
  background: #f8fafc;
  border-color: var(--accent-color);
  color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.grid-item-compact.active {
  background: #ecfdf5;
  border-color: var(--accent-color);
  color: var(--accent-color);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
}

.grid-item-compact.occupied {
  border-color: #fca5a5;
  color: #ef4444;
}

.grid-item-compact.occupied .table-icon {
  color: #ef4444;
}

.detail-panel {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-detail-card {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  padding: 30px;
  box-shadow: var(--shadow-md);
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.status-indicator-premium {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator-premium.disponible { background: #d1fae5; color: #065f46; }
.status-indicator-premium.ocupado { background: #fee2e2; color: #991b1b; }

/* --- Table Styling --- */
.epicure-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
}

.epicure-table th {
  padding: 12px 20px;
  text-align: left;
  font-size: 0.7rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.epicure-table td {
  padding: 16px 20px;
  background: white;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  transition: all 0.2s;
}

.epicure-table tr:hover td {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.epicure-table td:first-child { border-radius: 12px 0 0 12px; }
.epicure-table td:last-child { border-radius: 0 12px 12px 0; }

.id-tag { color: var(--accent-color); font-weight: 700; font-family: monospace; }

.item-chip {
  display: inline-block;
  padding: 4px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 2px;
  color: #475569;
}

.status-badge { padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 700; }
.status-badge.preparando { background: #dbeafe; color: #1e40af; }
.status-badge.pendiente { background: #fef3c7; color: #92400e; }
.status-badge.servido { background: #d1fae5; color: #065f46; }

/* --- Vista Cliente --- */
.vista-cliente-wrapper {
  background: #f8fafc;
  min-height: 100%;
}

.cliente-hero {
  padding: 40px;
  background: white;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar-premium input {
  width: 350px;
  padding: 14px 20px 14px 50px;
  background: #f1f5f9;
  border: 1px solid var(--border-color);
  border-radius: 30px;
  color: var(--text-primary);
}

.product-card-premium {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.product-card-premium:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.cart-panel-premium {
  background: white;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  padding: 25px;
  box-shadow: var(--shadow-lg);
  position: sticky;
  top: 20px;
}

.checkout-btn {
  background: var(--accent-color);
  color: white;
  padding: 16px;
  border-radius: 14px;
  width: 100%;
  border: none;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.2);
}

/* Modal Styling */
.modal-overlay {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
}

.glass-modal {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  box-shadow: var(--shadow-lg);
}

.premium-input, .premium-select {
  background: #f8fafc;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 10px;
}

/* Animations */
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1200px) {
  .pedidos-sidebar { width: 80px; padding: 20px 10px; }
  .brand-text, .nav-item span { display: none; }
  .split-layout { grid-template-columns: 1fr; }
}
</style>
