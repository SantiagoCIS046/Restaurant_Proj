<template>
  <div class="pedidos-container">
    <div class="button-bar">
      <button
        @click="toggleView"
        class="view-toggle-btn"
        :class="{ 'client-view': vistaCliente }"
      >
        {{ vistaCliente ? "👨‍💼 Vista Administrativa" : "🛒 Vista Cliente" }}
      </button>
      <template v-if="!vistaCliente">
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
      </template>
    </div>

    <!-- VISTA CLIENTE -->
    <div v-if="vistaCliente" class="vista-cliente">
      <div class="cliente-header">
        <h1>🍽️ Realiza tu Pedido</h1>
        <p class="subtitle">Selecciona tus productos favoritos</p>
      </div>

      <div class="cliente-layout">
        <!-- Panel de Categorías y Productos -->
        <div class="productos-panel">
          <!-- Barra de búsqueda y filtros -->
          <div class="search-filter-bar">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Buscar productos..."
              class="search-input"
            />
            <select v-model="selectedCategory" class="category-filter">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- Grid de productos -->
          <div class="productos-grid">
            <div
              v-for="producto in productosFiltrados"
              :key="producto.id"
              class="producto-card"
              :class="{ 'sin-stock': producto.quantity === 0 }"
            >
              <div class="producto-badge" v-if="producto.quantity === 0">
                Agotado
              </div>
              <div
                class="producto-badge disponible"
                v-else-if="producto.quantity < 5"
              >
                ¡Últimas unidades!
              </div>
              <div class="producto-info">
                <h3 class="producto-nombre">{{ producto.name }}</h3>
                <p class="producto-ingredientes">
                  {{ producto.ingredients.join(", ") }}
                </p>
                <div class="producto-footer">
                  <span class="producto-precio"
                    >${{ producto.price.toLocaleString() }} COP</span
                  >
                  <span class="producto-stock"
                    >Stock: {{ producto.quantity }}</span
                  >
                </div>
              </div>
              <div class="producto-actions">
                <button
                  @click="agregarAlCarrito(producto)"
                  :disabled="producto.quantity === 0"
                  class="btn-agregar"
                >
                  <span v-if="producto.quantity > 0">➕ Agregar</span>
                  <span v-else>Sin Stock</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Panel del Carrito -->
        <div
          class="carrito-panel"
          :class="{ 'carrito-visible': carrito.length > 0 }"
        >
          <div class="carrito-header">
            <h2>🛒 Tu Pedido</h2>
            <button
              v-if="carrito.length > 0"
              @click="vaciarCarrito"
              class="btn-vaciar"
            >
              🗑️ Vaciar
            </button>
          </div>

          <div v-if="carrito.length === 0" class="carrito-vacio">
            <p>Tu carrito está vacío</p>
            <p class="carrito-vacio-subtitle">Agrega productos para comenzar</p>
          </div>

          <div v-else class="carrito-items">
            <div v-for="item in carrito" :key="item.id" class="carrito-item">
              <div class="item-info">
                <h4>{{ item.name }}</h4>
                <p class="item-precio">
                  ${{ item.price.toLocaleString() }} COP
                </p>
              </div>
              <div class="item-controls">
                <button @click="disminuirCantidad(item)" class="btn-cantidad">
                  -
                </button>
                <span class="item-cantidad">{{ item.cantidad }}</span>
                <button @click="aumentarCantidad(item)" class="btn-cantidad">
                  +
                </button>
                <button @click="eliminarDelCarrito(item)" class="btn-eliminar">
                  🗑️
                </button>
              </div>
              <div class="item-subtotal">
                ${{ (item.price * item.cantidad).toLocaleString() }} COP
              </div>
            </div>
          </div>

          <div v-if="carrito.length > 0" class="carrito-resumen">
            <div class="resumen-linea">
              <span>Subtotal:</span>
              <span>${{ calcularSubtotal().toLocaleString() }} COP</span>
            </div>
            <div class="resumen-linea">
              <span>IVA (19%):</span>
              <span>${{ calcularIVA().toLocaleString() }} COP</span>
            </div>
            <div class="resumen-linea total">
              <span>Total:</span>
              <span>${{ calcularTotal().toLocaleString() }} COP</span>
            </div>
            <button
              @click="mostrarFormularioPedido = true"
              class="btn-confirmar"
            >
              ✅ Confirmar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Formulario de Pedido -->
    <div
      v-if="mostrarFormularioPedido"
      class="modal-overlay"
      @click.self="mostrarFormularioPedido = false"
    >
      <div class="modal-content pedido-modal">
        <span class="close" @click="mostrarFormularioPedido = false"
          >&times;</span
        >
        <h2>📝 Confirmar Pedido</h2>

        <form @submit.prevent="confirmarPedido">
          <!-- Tipo de Pedido -->
          <div class="form-group">
            <label>Tipo de Pedido:</label>
            <div class="tipo-pedido-options">
              <button
                type="button"
                @click="pedidoForm.tipo = 'mesa'"
                :class="{ active: pedidoForm.tipo === 'mesa' }"
                class="tipo-btn"
              >
                🪑 Mesa
              </button>
              <button
                type="button"
                @click="pedidoForm.tipo = 'mostrador'"
                :class="{ active: pedidoForm.tipo === 'mostrador' }"
                class="tipo-btn"
              >
                🏪 Mostrador
              </button>
              <button
                type="button"
                @click="pedidoForm.tipo = 'domicilio'"
                :class="{ active: pedidoForm.tipo === 'domicilio' }"
                class="tipo-btn"
              >
                🏠 Domicilio
              </button>
            </div>
          </div>

          <!-- Selector de Mesa (si tipo es mesa) -->
          <div v-if="pedidoForm.tipo === 'mesa'" class="form-group">
            <label for="mesa-select">Seleccionar Mesa:</label>
            <select id="mesa-select" v-model="pedidoForm.mesaId" required>
              <option value="">Seleccione una mesa...</option>
              <option
                v-for="mesa in mesasDisponibles"
                :key="mesa.id"
                :value="mesa.id"
              >
                {{ mesa.id.toUpperCase() }} - Capacidad: {{ mesa.capacidad }} -
                {{ mesa.ubicacion }}
              </option>
            </select>
          </div>

          <!-- Dirección (si tipo es domicilio) -->
          <div v-if="pedidoForm.tipo === 'domicilio'" class="form-group">
            <label for="direccion">Dirección de Entrega:</label>
            <input
              id="direccion"
              v-model="pedidoForm.direccion"
              type="text"
              placeholder="Calle, número, apartamento..."
              required
            />
          </div>

          <!-- Datos del Cliente -->
          <div class="form-row">
            <div class="form-group">
              <label for="cliente-nombre">Nombre:</label>
              <input
                id="cliente-nombre"
                v-model="pedidoForm.cliente.nombre"
                type="text"
                required
              />
            </div>
            <div class="form-group">
              <label for="cliente-telefono">Teléfono:</label>
              <input
                id="cliente-telefono"
                v-model="pedidoForm.cliente.telefono"
                type="tel"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="cliente-email">Email:</label>
            <input
              id="cliente-email"
              v-model="pedidoForm.cliente.email"
              type="email"
              required
            />
          </div>

          <!-- Método de Pago -->
          <div class="form-group">
            <label for="metodo-pago">Método de Pago:</label>
            <select id="metodo-pago" v-model="pedidoForm.metodoPago" required>
              <option value="">Seleccione método...</option>
              <option value="Efectivo">💵 Efectivo</option>
              <option value="Tarjeta de Crédito">💳 Tarjeta de Crédito</option>
              <option value="Tarjeta de Débito">💳 Tarjeta de Débito</option>
              <option value="Transferencia">🏦 Transferencia</option>
            </select>
          </div>

          <!-- Notas -->
          <div class="form-group">
            <label for="notas">Notas Especiales:</label>
            <textarea
              id="notas"
              v-model="pedidoForm.notas"
              rows="3"
              placeholder="Alergias, preferencias, instrucciones especiales..."
            ></textarea>
          </div>

          <!-- Resumen del Pedido -->
          <div class="pedido-resumen-modal">
            <h3>Resumen del Pedido</h3>
            <div class="resumen-items">
              <div v-for="item in carrito" :key="item.id" class="resumen-item">
                <span>{{ item.cantidad }}x {{ item.name }}</span>
                <span
                  >${{
                    (item.price * item.cantidad).toLocaleString()
                  }}
                  COP</span
                >
              </div>
            </div>
            <div class="resumen-total">
              <strong>Total a Pagar:</strong>
              <strong>${{ calcularTotal().toLocaleString() }} COP</strong>
            </div>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="mostrarFormularioPedido = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">
              ✅ Confirmar y Pagar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Confirmación Exitosa -->
    <div
      v-if="mostrarConfirmacion"
      class="modal-overlay"
      @click.self="cerrarConfirmacion"
    >
      <div class="modal-content confirmacion-modal">
        <div class="confirmacion-icon">✅</div>
        <h2>¡Pedido Confirmado!</h2>
        <p class="numero-orden">
          Número de Orden: <strong>{{ ultimoPedidoId }}</strong>
        </p>
        <p>Tu pedido ha sido registrado exitosamente.</p>
        <p class="confirmacion-detalle">
          Total: ${{ calcularTotal().toLocaleString() }} COP
        </p>
        <button @click="cerrarConfirmacion" class="btn-cerrar-confirmacion">
          Aceptar
        </button>
      </div>
    </div>

    <!-- VISTA ADMINISTRATIVA (código existente) -->
    <template v-if="!vistaCliente">
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
            <div
              v-for="supplier in suppliers"
              :key="supplier"
              class="supplier-item-wrapper"
            >
              <button
                class="category-btn"
                :class="{ active: selectedSupplier === supplier }"
                @click="selectSupplier(supplier)"
              >
                {{ supplier }}
              </button>
              <button
                class="info-btn"
                @click="viewSupplierInfo(supplier)"
                title="Ver información del proveedor"
              >
                ℹ️
              </button>
            </div>
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
                  <td :class="order.status.toLowerCase()">
                    {{ order.status }}
                  </td>
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
                  <td :class="order.status.toLowerCase()">
                    {{ order.status }}
                  </td>
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
                  <td :class="order.status.toLowerCase()">
                    {{ order.status }}
                  </td>
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
    </template>

    <!-- MODALES ADMINISTRATIVOS -->
    <!-- Modal Agregar Mesa -->
    <div
      v-if="showAddTableModal"
      class="modal-overlay"
      @click.self="showAddTableModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddTableModal = false">&times;</span>
        <h2>➕ Agregar Mesa</h2>
        <form @submit.prevent="addNewTable">
          <div class="form-group">
            <label for="table-name">Nombre de la Mesa:</label>
            <input
              id="table-name"
              v-model="newTableName"
              type="text"
              placeholder="Ej: Mesa 10"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddTableModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Pedido -->
    <div
      v-if="showAddOrderModal"
      class="modal-overlay"
      @click.self="showAddOrderModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddOrderModal = false">&times;</span>
        <h2>➕ Agregar Pedido</h2>
        <form @submit.prevent="addNewOrder">
          <div class="form-group">
            <label for="order-items">Items (separados por comas):</label>
            <input
              id="order-items"
              v-model="newOrderForm.items"
              type="text"
              placeholder="Ej: Pizza, Coca Cola, Ensalada"
              required
            />
          </div>
          <div class="form-group">
            <label for="order-total">Total:</label>
            <input
              id="order-total"
              v-model.number="newOrderForm.total"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddOrderModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Proveedor -->
    <div
      v-if="showAddSupplierModal"
      class="modal-overlay"
      @click.self="showAddSupplierModal = false"
    >
      <div class="modal-content supplier-add-modal">
        <span class="close" @click="showAddSupplierModal = false">&times;</span>
        <h2>➕ Agregar Proveedor</h2>
        <form @submit.prevent="addNewSupplier">
          <div class="form-group">
            <label for="new-supplier-name">Nombre del Proveedor:</label>
            <input
              id="new-supplier-name"
              v-model="newSupplierForm.name"
              type="text"
              placeholder="Ej: Distribuidora XYZ"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-supplier-email">Email:</label>
            <input
              id="new-supplier-email"
              v-model="newSupplierForm.contact.email"
              type="email"
              placeholder="contacto@proveedor.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-supplier-phone">Teléfono:</label>
            <input
              id="new-supplier-phone"
              v-model="newSupplierForm.contact.phone"
              type="tel"
              placeholder="+57 300 123 4567"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-supplier-address">Dirección:</label>
            <input
              id="new-supplier-address"
              v-model="newSupplierForm.contact.address"
              type="text"
              placeholder="Calle, número, ciudad"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-supplier-products"
              >Productos (separados por comas):</label
            >
            <input
              id="new-supplier-products"
              v-model="newSupplierForm.products"
              type="text"
              placeholder="Ej: Coca Cola, Sprite, Fanta"
              required
            />
          </div>

          <div class="form-group">
            <label for="new-supplier-notes">Notas:</label>
            <textarea
              id="new-supplier-notes"
              v-model="newSupplierForm.notes"
              rows="3"
              placeholder="Información adicional sobre el proveedor..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="newSupplierForm.active" />
              Proveedor Activo
            </label>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="showAddSupplierModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">
              Agregar Proveedor
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Pedido a Proveedor -->
    <div
      v-if="showAddSupplierOrderModal"
      class="modal-overlay"
      @click.self="showAddSupplierOrderModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddSupplierOrderModal = false"
          >&times;</span
        >
        <h2>➕ Nuevo Pedido a Proveedor</h2>
        <form @submit.prevent="addNewSupplierOrder">
          <div class="form-group">
            <label for="supplier-order-items"
              >Items (separados por comas):</label
            >
            <input
              id="supplier-order-items"
              v-model="newSupplierOrderForm.items"
              type="text"
              placeholder="Ej: Coca Cola x20, Sprite x15"
              required
            />
          </div>
          <div class="form-group">
            <label for="supplier-order-date">Fecha:</label>
            <input
              id="supplier-order-date"
              v-model="newSupplierOrderForm.date"
              type="date"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddSupplierOrderModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Categoría de Material -->
    <div
      v-if="showAddMaterialCategoryModal"
      class="modal-overlay"
      @click.self="showAddMaterialCategoryModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddMaterialCategoryModal = false"
          >&times;</span
        >
        <h2>➕ Agregar Categoría de Material</h2>
        <form @submit.prevent="addNewMaterialCategory">
          <div class="form-group">
            <label for="material-category">Nombre de la Categoría:</label>
            <input
              id="material-category"
              v-model="newMaterialCategory"
              type="text"
              placeholder="Ej: Cubiertos"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddMaterialCategoryModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Pedido de Material -->
    <div
      v-if="showAddMaterialOrderModal"
      class="modal-overlay"
      @click.self="showAddMaterialOrderModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddMaterialOrderModal = false"
          >&times;</span
        >
        <h2>➕ Nuevo Pedido de Material</h2>
        <form @submit.prevent="addNewMaterialOrder">
          <div class="form-group">
            <label for="material-name">Material:</label>
            <input
              id="material-name"
              v-model="newMaterialOrderForm.material"
              type="text"
              placeholder="Ej: Servilletas"
              required
            />
          </div>
          <div class="form-group">
            <label for="material-quantity">Cantidad:</label>
            <input
              id="material-quantity"
              v-model.number="newMaterialOrderForm.quantity"
              type="number"
              placeholder="0"
              required
            />
          </div>
          <div class="form-group">
            <label for="material-supplier">Proveedor:</label>
            <input
              id="material-supplier"
              v-model="newMaterialOrderForm.supplier"
              type="text"
              placeholder="Ej: Papelera XYZ"
              required
            />
          </div>
          <div class="form-group">
            <label for="material-date">Fecha:</label>
            <input
              id="material-date"
              v-model="newMaterialOrderForm.date"
              type="date"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddMaterialOrderModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Categoría de Inventario -->
    <div
      v-if="showAddInventoryCategoryModal"
      class="modal-overlay"
      @click.self="showAddInventoryCategoryModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddInventoryCategoryModal = false"
          >&times;</span
        >
        <h2>➕ Agregar Categoría de Inventario</h2>
        <form @submit.prevent="addNewInventoryCategory">
          <div class="form-group">
            <label for="inventory-category">Nombre de la Categoría:</label>
            <input
              id="inventory-category"
              v-model="newInventoryCategory"
              type="text"
              placeholder="Ej: Lácteos"
              required
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddInventoryCategoryModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Agregar Solicitud de Inventario -->
    <div
      v-if="showAddInventoryRequestModal"
      class="modal-overlay"
      @click.self="showAddInventoryRequestModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showAddInventoryRequestModal = false"
          >&times;</span
        >
        <h2>➕ Nueva Solicitud de Inventario</h2>
        <form @submit.prevent="addNewInventoryRequest">
          <div class="form-group">
            <label for="inventory-item">Item:</label>
            <input
              id="inventory-item"
              v-model="newInventoryRequestForm.item"
              type="text"
              placeholder="Ej: Coca Cola"
              required
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="inventory-current">Stock Actual:</label>
              <input
                id="inventory-current"
                v-model.number="newInventoryRequestForm.currentStock"
                type="number"
                placeholder="0"
                required
              />
            </div>
            <div class="form-group">
              <label for="inventory-requested">Cantidad Solicitada:</label>
              <input
                id="inventory-requested"
                v-model.number="newInventoryRequestForm.requested"
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>
          <div class="form-group">
            <label for="inventory-reason">Razón:</label>
            <textarea
              id="inventory-reason"
              v-model="newInventoryRequestForm.reason"
              rows="3"
              placeholder="Ej: Stock bajo, reabastecimiento semanal..."
              required
            ></textarea>
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddInventoryRequestModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Ver Información del Proveedor -->
    <div
      v-if="showSupplierInfoModal"
      class="modal-overlay"
      @click.self="showSupplierInfoModal = false"
    >
      <div class="modal-content supplier-info-modal">
        <span class="close" @click="showSupplierInfoModal = false"
          >&times;</span
        >
        <div class="supplier-info-header">
          <h2>🏢 {{ currentSupplierInfo?.name }}</h2>
          <span
            class="supplier-status-badge"
            :class="{ active: currentSupplierInfo?.active }"
          >
            {{ currentSupplierInfo?.active ? "✓ Activo" : "✗ Inactivo" }}
          </span>
        </div>

        <div class="supplier-info-content">
          <!-- Información de Contacto -->
          <div class="info-section">
            <h3>📞 Información de Contacto</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">{{
                  currentSupplierInfo?.contact.email
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Teléfono:</span>
                <span class="info-value">{{
                  currentSupplierInfo?.contact.phone
                }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Dirección:</span>
                <span class="info-value">{{
                  currentSupplierInfo?.contact.address
                }}</span>
              </div>
            </div>
          </div>

          <!-- Productos Suministrados -->
          <div class="info-section">
            <h3>📦 Productos Suministrados</h3>
            <div class="products-tags">
              <span
                v-for="product in currentSupplierInfo?.products"
                :key="product"
                class="product-tag"
              >
                {{ product }}
              </span>
            </div>
          </div>

          <!-- Información de Pedidos -->
          <div class="info-section">
            <h3>📋 Información de Pedidos</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Último Pedido:</span>
                <span class="info-value">{{
                  currentSupplierInfo?.lastOrder
                }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Total Pedidos:</span>
                <span class="info-value">{{
                  getSupplierOrderCount(currentSupplierInfo?.name)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Notas -->
          <div class="info-section">
            <h3>📝 Notas</h3>
            <p class="supplier-notes">{{ currentSupplierInfo?.notes }}</p>
          </div>
        </div>

        <div class="supplier-info-actions">
          <button class="btn-edit-supplier" @click="editSupplierInfo">
            ✏️ Editar Información
          </button>
          <button class="btn-close-info" @click="showSupplierInfoModal = false">
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Editar Información del Proveedor -->
    <div
      v-if="showEditSupplierInfoModal"
      class="modal-overlay"
      @click.self="showEditSupplierInfoModal = false"
    >
      <div class="modal-content supplier-edit-modal">
        <span class="close" @click="showEditSupplierInfoModal = false"
          >&times;</span
        >
        <h2>✏️ Editar Información del Proveedor</h2>

        <form @submit.prevent="saveSupplierInfo">
          <div class="form-group">
            <label for="edit-supplier-name">Nombre del Proveedor:</label>
            <input
              id="edit-supplier-name"
              v-model="editSupplierForm.name"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-supplier-email">Email:</label>
            <input
              id="edit-supplier-email"
              v-model="editSupplierForm.contact.email"
              type="email"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-supplier-phone">Teléfono:</label>
            <input
              id="edit-supplier-phone"
              v-model="editSupplierForm.contact.phone"
              type="tel"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-supplier-address">Dirección:</label>
            <input
              id="edit-supplier-address"
              v-model="editSupplierForm.contact.address"
              type="text"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-supplier-products"
              >Productos (separados por comas):</label
            >
            <input
              id="edit-supplier-products"
              v-model="editSupplierProductsString"
              type="text"
              placeholder="Ej: Coca Cola, Sprite, Fanta"
              required
            />
          </div>

          <div class="form-group">
            <label for="edit-supplier-notes">Notas:</label>
            <textarea
              id="edit-supplier-notes"
              v-model="editSupplierForm.notes"
              rows="3"
              placeholder="Información adicional sobre el proveedor..."
            ></textarea>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="editSupplierForm.active" />
              Proveedor Activo
            </label>
          </div>

          <div class="form-actions">
            <button
              type="button"
              @click="showEditSupplierInfoModal = false"
              class="btn-cancelar"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-confirmar-pedido">
              Guardar Cambios
            </button>
          </div>
        </form>
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

// Datos detallados de proveedores
const suppliersData = ref([
  {
    id: 1,
    name: "Distribuidora ABC",
    contact: {
      email: "contacto@distribuidoraabc.com",
      phone: "+57 300 123 4567",
      address: "Calle 45 #23-12, Bogotá",
    },
    products: ["Coca Cola", "Sprite", "Fanta", "Agua"],
    lastOrder: "2024-01-15",
    active: true,
    notes: "Proveedor principal de bebidas. Entrega los lunes y jueves.",
  },
  {
    id: 2,
    name: "Verduras Frescas",
    contact: {
      email: "ventas@verdurasfrescas.com",
      phone: "+57 310 987 6543",
      address: "Carrera 30 #15-20, Bogotá",
    },
    products: ["Lechuga", "Tomate", "Cebolla", "Zanahoria"],
    lastOrder: "2024-01-10",
    active: true,
    notes: "Productos orgánicos. Entrega diaria en la mañana.",
  },
  {
    id: 3,
    name: "Carnes Premium",
    contact: {
      email: "info@carnespremium.com",
      phone: "+57 320 456 7890",
      address: "Avenida 68 #40-50, Bogotá",
    },
    products: ["Res", "Pollo", "Cerdo", "Pescado"],
    lastOrder: "2024-01-08",
    active: true,
    notes: "Carnes de alta calidad. Certificación INVIMA.",
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

// Estados para modales administrativos
const showAddTableModal = ref(false);
const showAddOrderModal = ref(false);
const showAddSupplierModal = ref(false);
const showAddSupplierOrderModal = ref(false);
const showAddMaterialCategoryModal = ref(false);
const showAddMaterialOrderModal = ref(false);
const showAddInventoryCategoryModal = ref(false);
const showAddInventoryRequestModal = ref(false);

// Formularios para agregar
const newTableName = ref("");
const newOrderForm = ref({ items: "", total: 0 });
const newSupplierForm = ref({
  name: "",
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  products: "",
  notes: "",
  active: true,
});
const newSupplierOrderForm = ref({ items: "", date: "" });
const newMaterialCategory = ref("");
const newMaterialOrderForm = ref({
  material: "",
  quantity: 0,
  supplier: "",
  date: "",
});
const newInventoryCategory = ref("");
const newInventoryRequestForm = ref({
  item: "",
  currentStock: 0,
  requested: 0,
  reason: "",
});

// Funciones para abrir/cerrar modales
const toggleAddTableForm = () => {
  showAddTableModal.value = !showAddTableModal.value;
  addToLog("Acción", "Abrir formulario para agregar mesa", "Pedidos Mesa");
};

const toggleAddOrderForm = () => {
  showAddOrderModal.value = !showAddOrderModal.value;
  addToLog("Acción", "Abrir formulario para agregar pedido", "Pedidos Mesa");
};

const toggleAddSupplierForm = () => {
  showAddSupplierModal.value = !showAddSupplierModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para agregar proveedor",
    "Pedidos Proveedores"
  );
};

const toggleAddSupplierOrderForm = () => {
  showAddSupplierOrderModal.value = !showAddSupplierOrderModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para nuevo pedido a proveedor",
    "Pedidos Proveedores"
  );
};

const toggleAddMaterialCategoryForm = () => {
  showAddMaterialCategoryModal.value = !showAddMaterialCategoryModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para agregar categoría de material",
    "Pedidos Materiales"
  );
};

const toggleAddMaterialOrderForm = () => {
  showAddMaterialOrderModal.value = !showAddMaterialOrderModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para nuevo pedido de material",
    "Pedidos Materiales"
  );
};

const toggleAddInventoryCategoryForm = () => {
  showAddInventoryCategoryModal.value = !showAddInventoryCategoryModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para agregar categoría de inventario",
    "Pedidos Inventario"
  );
};

const toggleAddInventoryRequestForm = () => {
  showAddInventoryRequestModal.value = !showAddInventoryRequestModal.value;
  addToLog(
    "Acción",
    "Abrir formulario para nueva solicitud de inventario",
    "Pedidos Inventario"
  );
};

// Funciones para agregar elementos
const addNewTable = () => {
  if (newTableName.value.trim()) {
    const newTable = newTableName.value.trim().toUpperCase();
    if (!tables.value.includes(newTable)) {
      tables.value.push(newTable);
      addToLog("Creación", `Nueva mesa agregada: ${newTable}`, "Pedidos Mesa");
      newTableName.value = "";
      showAddTableModal.value = false;
    } else {
      alert("Esta mesa ya existe");
    }
  }
};

const addNewOrder = () => {
  if (
    selectedTable.value &&
    newOrderForm.value.items &&
    newOrderForm.value.total > 0
  ) {
    const newOrder = {
      id: mesaOrders.value.length + 1,
      table: selectedTable.value,
      items: newOrderForm.value.items.split(",").map((item) => item.trim()),
      status: "Pendiente",
      total: parseFloat(newOrderForm.value.total),
    };
    mesaOrders.value.push(newOrder);
    addToLog(
      "Creación",
      `Nuevo pedido agregado para ${selectedTable.value}`,
      "Pedidos Mesa"
    );
    newOrderForm.value = { items: "", total: 0 };
    showAddOrderModal.value = false;
  } else {
    alert("Por favor completa todos los campos y selecciona una mesa");
  }
};

const addNewSupplier = () => {
  const form = newSupplierForm.value;

  if (
    form.name.trim() &&
    form.contact.email &&
    form.contact.phone &&
    form.contact.address &&
    form.products
  ) {
    const supplierName = form.name.trim();

    // Verificar si el proveedor ya existe
    if (suppliers.value.includes(supplierName)) {
      alert("Este proveedor ya existe");
      return;
    }

    // Convertir productos de string a array
    const productsArray = form.products
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Crear nuevo proveedor con ID único
    const newSupplier = {
      id: suppliersData.value.length + 1,
      name: supplierName,
      contact: {
        email: form.contact.email,
        phone: form.contact.phone,
        address: form.contact.address,
      },
      products: productsArray,
      lastOrder: new Date().toISOString().split("T")[0],
      active: form.active,
      notes: form.notes || "",
    };

    // Agregar a la lista de datos detallados
    suppliersData.value.push(newSupplier);

    // Agregar a la lista simple de nombres
    suppliers.value.push(supplierName);

    addToLog(
      "Creación",
      `Nuevo proveedor agregado: ${supplierName}`,
      "Pedidos Proveedores"
    );

    // Limpiar formulario
    newSupplierForm.value = {
      name: "",
      contact: {
        email: "",
        phone: "",
        address: "",
      },
      products: "",
      notes: "",
      active: true,
    };

    showAddSupplierModal.value = false;
  } else {
    alert("Por favor completa todos los campos requeridos");
  }
};

const addNewSupplierOrder = () => {
  if (
    selectedSupplier.value &&
    newSupplierOrderForm.value.items &&
    newSupplierOrderForm.value.date
  ) {
    const newOrder = {
      id: supplierOrders.value.length + 1,
      supplier: selectedSupplier.value,
      items: newSupplierOrderForm.value.items
        .split(",")
        .map((item) => item.trim()),
      status: "Pendiente",
      date: newSupplierOrderForm.value.date,
    };
    supplierOrders.value.push(newOrder);
    addToLog(
      "Creación",
      `Nuevo pedido a proveedor: ${selectedSupplier.value}`,
      "Pedidos Proveedores"
    );
    newSupplierOrderForm.value = { items: "", date: "" };
    showAddSupplierOrderModal.value = false;
  } else {
    alert("Por favor completa todos los campos y selecciona un proveedor");
  }
};

const addNewMaterialCategory = () => {
  if (newMaterialCategory.value.trim()) {
    const category = newMaterialCategory.value.trim();
    if (!materialCategories.value.includes(category)) {
      materialCategories.value.push(category);
      addToLog(
        "Creación",
        `Nueva categoría de material: ${category}`,
        "Pedidos Materiales"
      );
      newMaterialCategory.value = "";
      showAddMaterialCategoryModal.value = false;
    } else {
      alert("Esta categoría ya existe");
    }
  }
};

const addNewMaterialOrder = () => {
  const form = newMaterialOrderForm.value;
  if (form.material && form.quantity > 0 && form.supplier && form.date) {
    const newOrder = {
      id: materialOrders.value.length + 1,
      material: form.material,
      quantity: parseInt(form.quantity),
      supplier: form.supplier,
      status: "Pendiente",
      date: form.date,
    };
    materialOrders.value.push(newOrder);
    addToLog(
      "Creación",
      `Nuevo pedido de material: ${form.material}`,
      "Pedidos Materiales"
    );
    newMaterialOrderForm.value = {
      material: "",
      quantity: 0,
      supplier: "",
      date: "",
    };
    showAddMaterialOrderModal.value = false;
  } else {
    alert("Por favor completa todos los campos");
  }
};

const addNewInventoryCategory = () => {
  if (newInventoryCategory.value.trim()) {
    const category = newInventoryCategory.value.trim();
    if (!inventoryCategories.value.includes(category)) {
      inventoryCategories.value.push(category);
      addToLog(
        "Creación",
        `Nueva categoría de inventario: ${category}`,
        "Pedidos Inventario"
      );
      newInventoryCategory.value = "";
      showAddInventoryCategoryModal.value = false;
    } else {
      alert("Esta categoría ya existe");
    }
  }
};

const addNewInventoryRequest = () => {
  const form = newInventoryRequestForm.value;
  if (form.item && form.requested > 0 && form.reason) {
    const newRequest = {
      id: inventoryOrders.value.length + 1,
      item: form.item,
      currentStock: parseInt(form.currentStock),
      requested: parseInt(form.requested),
      reason: form.reason,
      status: "Pendiente",
    };
    inventoryOrders.value.push(newRequest);
    addToLog(
      "Creación",
      `Nueva solicitud de inventario: ${form.item}`,
      "Pedidos Inventario"
    );
    newInventoryRequestForm.value = {
      item: "",
      currentStock: 0,
      requested: 0,
      reason: "",
    };
    showAddInventoryRequestModal.value = false;
  } else {
    alert("Por favor completa todos los campos requeridos");
  }
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

// ===== VISTA CLIENTE =====
const vistaCliente = ref(false);
const searchQuery = ref("");
const selectedCategory = ref("");
const carrito = ref([]);
const mostrarFormularioPedido = ref(false);
const mostrarConfirmacion = ref(false);
const ultimoPedidoId = ref("");

// Categorías de productos
const categorias = ref([
  "Bebidas",
  "Entradas",
  "Adicionales",
  "Comida de Mar",
  "Nuestros Pescados",
  "Cocina Tipica",
  "Res",
  "Cerdo",
  "Pastas",
  "Aves",
  "Vegetales",
  "Postres",
  "Ensaladas",
]);

// Productos (simulando datos del menú)
const productos = ref([
  {
    id: 1,
    name: "Coca Cola",
    category: "Bebidas",
    quantity: 10,
    price: 2500,
    ingredients: ["Agua", "Azúcar", "Gas"],
  },
  {
    id: 2,
    name: "Sprite",
    category: "Bebidas",
    quantity: 5,
    price: 2500,
    ingredients: ["Agua", "Azúcar", "Gas", "Limón"],
  },
  {
    id: 3,
    name: "Empanadas",
    category: "Entradas",
    quantity: 20,
    price: 3000,
    ingredients: ["Harina", "Carne", "Cebolla", "Papa"],
  },
  {
    id: 4,
    name: "Patacones",
    category: "Entradas",
    quantity: 15,
    price: 4000,
    ingredients: ["Plátano", "Aceite", "Sal"],
  },
  {
    id: 5,
    name: "Arroz",
    category: "Adicionales",
    quantity: 30,
    price: 2000,
    ingredients: ["Arroz", "Agua", "Sal"],
  },
  {
    id: 6,
    name: "Frijoles",
    category: "Adicionales",
    quantity: 25,
    price: 2500,
    ingredients: ["Frijoles", "Agua", "Cebolla", "Ajo"],
  },
  {
    id: 7,
    name: "Ceviche de Camarón",
    category: "Comida de Mar",
    quantity: 10,
    price: 15000,
    ingredients: ["Camarón", "Limón", "Cebolla", "Cilantro", "Ají"],
  },
  {
    id: 8,
    name: "Mojarra Frita",
    category: "Nuestros Pescados",
    quantity: 8,
    price: 12000,
    ingredients: ["Mojarra", "Aceite", "Sal", "Limón"],
  },
  {
    id: 9,
    name: "Bandeja Paisa",
    category: "Cocina Tipica",
    quantity: 5,
    price: 18000,
    ingredients: [
      "Carne",
      "Chicharrón",
      "Arroz",
      "Frijoles",
      "Plátano",
      "Huevo",
      "Arepa",
    ],
  },
  {
    id: 10,
    name: "Churrasco",
    category: "Res",
    quantity: 12,
    price: 14000,
    ingredients: ["Res", "Sal", "Pimienta", "Aceite"],
  },
  {
    id: 11,
    name: "Lechona",
    category: "Cerdo",
    quantity: 6,
    price: 16000,
    ingredients: ["Cerdo", "Arroz", "Papa", "Cebolla", "Ajo"],
  },
  {
    id: 12,
    name: "Spaghetti Carbonara",
    category: "Pastas",
    quantity: 10,
    price: 10000,
    ingredients: ["Pasta", "Huevo", "Queso", "Panceta", "Crema"],
  },
  {
    id: 13,
    name: "Pollo con Papas",
    category: "Aves",
    quantity: 15,
    price: 11000,
    ingredients: ["Pollo", "Papa", "Aceite", "Sal", "Especias"],
  },
  {
    id: 14,
    name: "Ensalada Mixta",
    category: "Vegetales",
    quantity: 20,
    price: 5000,
    ingredients: [
      "Lechuga",
      "Tomate",
      "Pepino",
      "Zanahoria",
      "Vinagre",
      "Aceite",
    ],
  },
  {
    id: 15,
    name: "Tres Leches",
    category: "Postres",
    quantity: 10,
    price: 6000,
    ingredients: ["Harina", "Leche", "Azúcar", "Huevos", "Vainilla"],
  },
  {
    id: 16,
    name: "Ensalada César",
    category: "Ensaladas",
    quantity: 12,
    price: 7000,
    ingredients: ["Lechuga", "Pollo", "Queso", "Croutons", "Aderezo César"],
  },
]);

// Formulario de pedido
const pedidoForm = ref({
  tipo: "mesa",
  mesaId: "",
  direccion: "",
  cliente: {
    nombre: "",
    telefono: "",
    email: "",
  },
  metodoPago: "",
  notas: "",
});

// Computed
const productosFiltrados = computed(() => {
  let filtered = productos.value;

  if (selectedCategory.value) {
    filtered = filtered.filter((p) => p.category === selectedCategory.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.ingredients.some((i) => i.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const mesasDisponibles = computed(() => {
  const data = localStorage.getItem("mesasRestaurante");
  if (data) {
    const mesas = JSON.parse(data);
    return mesas.filter((m) => m.estado === "disponible");
  }
  return [];
});

// Funciones de la vista cliente
const toggleView = () => {
  vistaCliente.value = !vistaCliente.value;
};

const agregarAlCarrito = (producto) => {
  const itemExistente = carrito.value.find((item) => item.id === producto.id);

  if (itemExistente) {
    if (itemExistente.cantidad < producto.quantity) {
      itemExistente.cantidad++;
    } else {
      alert("No hay suficiente stock disponible");
    }
  } else {
    carrito.value.push({
      ...producto,
      cantidad: 1,
    });
  }
};

const eliminarDelCarrito = (item) => {
  const index = carrito.value.findIndex((i) => i.id === item.id);
  if (index > -1) {
    carrito.value.splice(index, 1);
  }
};

const aumentarCantidad = (item) => {
  const producto = productos.value.find((p) => p.id === item.id);
  if (item.cantidad < producto.quantity) {
    item.cantidad++;
  } else {
    alert("No hay suficiente stock disponible");
  }
};

const disminuirCantidad = (item) => {
  if (item.cantidad > 1) {
    item.cantidad--;
  } else {
    eliminarDelCarrito(item);
  }
};

const vaciarCarrito = () => {
  if (confirm("¿Estás seguro de vaciar el carrito?")) {
    carrito.value = [];
  }
};

const calcularSubtotal = () => {
  return carrito.value.reduce(
    (total, item) => total + item.price * item.cantidad,
    0
  );
};

const calcularIVA = () => {
  return Math.round(calcularSubtotal() * 0.19);
};

const calcularTotal = () => {
  return calcularSubtotal() + calcularIVA();
};

const confirmarPedido = () => {
  // Validar formulario
  if (pedidoForm.value.tipo === "mesa" && !pedidoForm.value.mesaId) {
    alert("Por favor selecciona una mesa");
    return;
  }

  if (pedidoForm.value.tipo === "domicilio" && !pedidoForm.value.direccion) {
    alert("Por favor ingresa la dirección de entrega");
    return;
  }

  // Generar ID del pedido
  const pedidoId = `PED${Date.now()}`;
  ultimoPedidoId.value = pedidoId;

  // Crear objeto del pedido
  const nuevoPedido = {
    id: pedidoId,
    tipo: pedidoForm.value.tipo,
    mesaId: pedidoForm.value.mesaId,
    direccion: pedidoForm.value.direccion,
    cliente: { ...pedidoForm.value.cliente },
    items: carrito.value.map((item) => ({
      id: item.id,
      name: item.name,
      cantidad: item.cantidad,
      price: item.price,
      subtotal: item.price * item.cantidad,
    })),
    subtotal: calcularSubtotal(),
    iva: calcularIVA(),
    total: calcularTotal(),
    metodoPago: pedidoForm.value.metodoPago,
    notas: pedidoForm.value.notas,
    estado: "Pendiente",
    fecha: new Date().toISOString(),
  };

  // Guardar pedido en localStorage
  const pedidosGuardados = JSON.parse(
    localStorage.getItem("pedidosClientes") || "[]"
  );
  pedidosGuardados.push(nuevoPedido);
  localStorage.setItem("pedidosClientes", JSON.stringify(pedidosGuardados));

  // Actualizar inventario de productos
  carrito.value.forEach((item) => {
    const producto = productos.value.find((p) => p.id === item.id);
    if (producto) {
      producto.quantity -= item.cantidad;
    }
  });

  // Si es pedido de mesa, actualizar estado de la mesa
  if (pedidoForm.value.tipo === "mesa" && pedidoForm.value.mesaId) {
    const mesasData = JSON.parse(
      localStorage.getItem("mesasRestaurante") || "[]"
    );
    const mesa = mesasData.find((m) => m.id === pedidoForm.value.mesaId);
    if (mesa) {
      mesa.estado = "ocupada";
      localStorage.setItem("mesasRestaurante", JSON.stringify(mesasData));
    }
  }

  // Crear/actualizar cliente
  actualizarCliente(nuevoPedido);

  // Mostrar confirmación
  mostrarFormularioPedido.value = false;
  mostrarConfirmacion.value = true;

  // Limpiar carrito y formulario
  carrito.value = [];
  pedidoForm.value = {
    tipo: "mesa",
    mesaId: "",
    direccion: "",
    cliente: { nombre: "", telefono: "", email: "" },
    metodoPago: "",
    notas: "",
  };
};

const actualizarCliente = (pedido) => {
  const clientesData = JSON.parse(
    localStorage.getItem("clientesRestaurante") || "[]"
  );
  let cliente = clientesData.find((c) => c.email === pedido.cliente.email);

  if (!cliente) {
    cliente = {
      id: `cliente${clientesData.length + 1}`,
      nombre: pedido.cliente.nombre,
      email: pedido.cliente.email,
      telefono: pedido.cliente.telefono,
      pedidos: [],
      pagos: [],
      totalPagos: 0,
      fechaRegistro: new Date().toISOString(),
    };
    clientesData.push(cliente);
  }

  // Agregar pedido al historial del cliente
  cliente.pedidos.push({
    id: pedido.id,
    fecha: pedido.fecha,
    tipo: pedido.tipo,
    total: pedido.total,
    estado: pedido.estado,
  });

  // Agregar pago
  cliente.pagos.push({
    id: `pago${pedido.id}`,
    pedidoId: pedido.id,
    monto: pedido.total,
    fecha: pedido.fecha,
    metodo: pedido.metodoPago,
  });

  cliente.totalPagos += pedido.total;

  localStorage.setItem("clientesRestaurante", JSON.stringify(clientesData));
};

const cerrarConfirmacion = () => {
  mostrarConfirmacion.value = false;
  ultimoPedidoId.value = "";
};

// ===== FUNCIONALIDAD DE INFORMACIÓN DE PROVEEDORES =====
const showSupplierInfoModal = ref(false);
const showEditSupplierInfoModal = ref(false);
const currentSupplierInfo = ref(null);
const editSupplierForm = ref({
  id: null,
  name: "",
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  products: [],
  lastOrder: "",
  active: true,
  notes: "",
});
const editSupplierProductsString = ref("");

// Función para ver información del proveedor
const viewSupplierInfo = (supplierName) => {
  const supplier = suppliersData.value.find((s) => s.name === supplierName);
  if (supplier) {
    currentSupplierInfo.value = supplier;
    showSupplierInfoModal.value = true;
    addToLog(
      "Visualización",
      `Ver información del proveedor: ${supplierName}`,
      "Pedidos Proveedores"
    );
  }
};

// Función para obtener el conteo de pedidos de un proveedor
const getSupplierOrderCount = (supplierName) => {
  return supplierOrders.value.filter((order) => order.supplier === supplierName)
    .length;
};

// Función para editar información del proveedor
const editSupplierInfo = () => {
  if (currentSupplierInfo.value) {
    editSupplierForm.value = {
      ...currentSupplierInfo.value,
      contact: { ...currentSupplierInfo.value.contact },
      products: [...currentSupplierInfo.value.products],
    };
    editSupplierProductsString.value =
      currentSupplierInfo.value.products.join(", ");
    showSupplierInfoModal.value = false;
    showEditSupplierInfoModal.value = true;
    addToLog(
      "Acción",
      `Editar información del proveedor: ${currentSupplierInfo.value.name}`,
      "Pedidos Proveedores"
    );
  }
};

// Función para guardar cambios del proveedor
const saveSupplierInfo = () => {
  if (editSupplierForm.value.id) {
    const index = suppliersData.value.findIndex(
      (s) => s.id === editSupplierForm.value.id
    );

    if (index !== -1) {
      // Convertir string de productos a array
      const productsArray = editSupplierProductsString.value
        .split(",")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Actualizar el nombre en la lista de suppliers si cambió
      const oldName = suppliersData.value[index].name;
      const newName = editSupplierForm.value.name;

      if (oldName !== newName) {
        const supplierIndex = suppliers.value.indexOf(oldName);
        if (supplierIndex !== -1) {
          suppliers.value[supplierIndex] = newName;
        }

        // Actualizar nombre en los pedidos existentes
        supplierOrders.value.forEach((order) => {
          if (order.supplier === oldName) {
            order.supplier = newName;
          }
        });

        // Actualizar selectedSupplier si es el que se está editando
        if (selectedSupplier.value === oldName) {
          selectedSupplier.value = newName;
        }
      }

      // Actualizar datos del proveedor
      suppliersData.value[index] = {
        ...editSupplierForm.value,
        products: productsArray,
      };

      currentSupplierInfo.value = suppliersData.value[index];

      addToLog(
        "Actualización",
        `Información actualizada del proveedor: ${newName}`,
        "Pedidos Proveedores"
      );

      showEditSupplierInfoModal.value = false;
      showSupplierInfoModal.value = true;
    }
  }
};
</script>
=======

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

/* === ESTILOS VISTA CLIENTE === */
.view-toggle-btn {
  background: #38a169 !important;
  font-weight: 600;
}

.view-toggle-btn.client-view {
  background: #3182ce !important;
}

.vista-cliente {
  position: fixed;
  top: 100px;
  left: 0;
  width: 100%;
  height: calc(100vh - 100px);
  background: #f7fafc;
  overflow-y: auto;
  padding: 2rem;
}

.cliente-header {
  text-align: center;
  margin-bottom: 2rem;
}

.cliente-header h1 {
  font-size: 2.5rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #718096;
}

.cliente-layout {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.productos-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3182ce;
}

.category-filter {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  min-width: 200px;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.producto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #3182ce;
}

.producto-card.sin-stock {
  opacity: 0.6;
  background: #f7fafc;
}

.producto-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.producto-badge.disponible {
  background: #ed8936;
}

.producto-info {
  flex: 1;
  margin-bottom: 1rem;
}

.producto-nombre {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.producto-ingredientes {
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.producto-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.producto-precio {
  font-size: 1.5rem;
  font-weight: 700;
  color: #38a169;
}

.producto-stock {
  font-size: 0.875rem;
  color: #718096;
}

.producto-actions {
  margin-top: auto;
}

.btn-agregar {
  width: 100%;
  padding: 0.75rem;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-agregar:hover:not(:disabled) {
  background: #2f855a;
}

.btn-agregar:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

/* Carrito */
.carrito-panel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 120px;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
}

.carrito-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.carrito-header h2 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0;
}

.btn-vaciar {
  padding: 0.5rem 1rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-vaciar:hover {
  background: #c53030;
}

.carrito-vacio {
  text-align: center;
  padding: 3rem 1rem;
  color: #a0aec0;
}

.carrito-vacio p {
  margin: 0.5rem 0;
}

.carrito-vacio-subtitle {
  font-size: 0.875rem;
}

.carrito-items {
  margin-bottom: 1.5rem;
}

.carrito-item {
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item-info h4 {
  font-size: 1rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.item-precio {
  font-size: 0.875rem;
  color: #718096;
  margin: 0;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
}

.btn-cantidad {
  width: 32px;
  height: 32px;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cantidad:hover {
  background: #2c5282;
}

.item-cantidad {
  padding: 0.5rem 1rem;
  background: #edf2f7;
  border-radius: 6px;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

.btn-eliminar {
  margin-left: auto;
  padding: 0.5rem 0.75rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-eliminar:hover {
  background: #c53030;
}

.item-subtotal {
  text-align: right;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.carrito-resumen {
  border-top: 2px solid #e2e8f0;
  padding-top: 1rem;
}

.resumen-linea {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: #4a5568;
}

.resumen-linea.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #e2e8f0;
}

.btn-confirmar {
  width: 100%;
  padding: 1rem;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}

.btn-confirmar:hover {
  background: #2f855a;
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.pedido-modal {
  max-width: 700px;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  line-height: 1;
}

.close:hover {
  color: #2d3748;
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2d3748;
  font-size: 1.75rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3182ce;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.tipo-pedido-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.tipo-btn {
  padding: 1rem;
  background: #edf2f7;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tipo-btn:hover {
  background: #e2e8f0;
}

.tipo-btn.active {
  background: #3182ce;
  color: white;
  border-color: #3182ce;
}

.pedido-resumen-modal {
  background: #f7fafc;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.pedido-resumen-modal h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2d3748;
}

.resumen-items {
  margin-bottom: 1rem;
}

.resumen-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.resumen-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  padding-top: 1rem;
  border-top: 2px solid #cbd5e0;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancelar {
  padding: 0.75rem 1.5rem;
  background: #e2e8f0;
  color: #2d3748;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancelar:hover {
  background: #cbd5e0;
}

.btn-confirmar-pedido {
  padding: 0.75rem 1.5rem;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-confirmar-pedido:hover {
  background: #2f855a;
}

/* Modal de Confirmación */
.confirmacion-modal {
  text-align: center;
  max-width: 500px;
}

.confirmacion-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.confirmacion-modal h2 {
  color: #38a169;
  margin-bottom: 1rem;
}

.numero-orden {
  font-size: 1.125rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.confirmacion-detalle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 1rem 0;
}

.btn-cerrar-confirmacion {
  padding: 0.75rem 2rem;
  background: #38a169;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s;
}

.btn-cerrar-confirmacion:hover {
  background: #2f855a;
}

/* Responsive */
@media (max-width: 1024px) {
  .cliente-layout {
    grid-template-columns: 1fr;
  }

  .carrito-panel {
    position: relative;
    top: 0;
    max-height: none;
  }
}

@media (max-width: 768px) {
  .button-bar {
    flex-direction: column;
    gap: 0.5rem;
  }

  .vista-cliente {
    padding: 1rem;
  }

  .cliente-header h1 {
    font-size: 2rem;
  }

  .search-filter-bar {
    flex-direction: column;
  }

  .category-filter {
    min-width: 100%;
  }

  .productos-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .tipo-pedido-options {
    grid-template-columns: 1fr;
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

/* === ESTILOS PARA INFORMACIÓN DE PROVEEDORES === */
.supplier-item-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: -1.5rem;
}

.supplier-item-wrapper .category-btn {
  flex: 1;
  margin-bottom: 0;
}

.info-btn {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.info-btn:hover {
  background: #2c5282;
  transform: scale(1.1);
}

/* Modal de Información del Proveedor */
.supplier-info-modal {
  max-width: 700px;
}

.supplier-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.supplier-info-header h2 {
  margin: 0;
  color: #2d3748;
  font-size: 1.75rem;
}

.supplier-status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: #fed7d7;
  color: #c53030;
}

.supplier-status-badge.active {
  background: #c6f6d5;
  color: #22543d;
}

.supplier-info-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.info-section h3 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.125rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-value {
  font-size: 1rem;
  color: #2d3748;
  font-weight: 500;
}

.products-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #cbd5e0;
}

.supplier-notes {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.9375rem;
}

.supplier-info-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e2e8f0;
}

.btn-edit-supplier {
  padding: 0.75rem 1.5rem;
  background: #3182ce;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-edit-supplier:hover {
  background: #2c5282;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(49, 130, 206, 0.3);
}

.btn-close-info {
  padding: 0.75rem 1.5rem;
  background: #e2e8f0;
  color: #2d3748;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-close-info:hover {
  background: #cbd5e0;
}

/* Modal de Agregar Proveedor */
.supplier-add-modal {
  max-width: 650px;
}

/* Modal de Edición del Proveedor */
.supplier-edit-modal {
  max-width: 650px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  color: #2d3748;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
  cursor: pointer;
  transform: scale(1.2);
}

/* Responsive para proveedores */
@media (max-width: 768px) {
  .supplier-item-wrapper {
    flex-direction: column;
    align-items: stretch;
    gap: 0.25rem;
  }

  .info-btn {
    width: 100%;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .supplier-info-actions {
    flex-direction: column;
  }

  .btn-edit-supplier,
  .btn-close-info {
    width: 100%;
  }
}
</style>
