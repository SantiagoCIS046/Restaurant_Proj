<template>
  <div class="inventario-container">
<!-- Barra de botones para navegar entre secciones del inventario -->
    <div class="button-bar">
      <button @click="currentSection = 'productos'">Productos</button>
      <button @click="currentSection = 'ingredientes'">Ingredientes</button>
      <button @click="currentSection = 'stock'">Stock</button>
      <button @click="currentSection = 'reportes'">Reportes</button>
    </div>

    <!-- Contenido de la sección de productos -->
    <div v-if="currentSection === 'productos'" class="productos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Categorías de Productos</h1>
          <div class="header-buttons">
            <button
              class="add-category-btn"
              @click="toggleAddCategoryForm('productos')"
            >
              ➕ Agregar Categoría
            </button>
            <button
              class="delete-category-btn"
              @click="toggleDeleteCategoryForm('productos')"
            >
              🗑️ Eliminar Categoría
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="category in productCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedProductCategory === category }"
            @click="selectProductCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddProductForm">
          Agregar Producto
        </button>
        <div v-if="selectedProductCategory" class="item-list">
          <h2>{{ selectedProductCategory }}</h2>
          <ul>
            <li
              v-for="(item, index) in products[selectedProductCategory]"
              :key="item.name"
              class="item-row"
            >
              <span class="item-name">{{ index + 1 }}. {{ item.name }}</span>
              <div class="item-actions">
                <button
                  @click="editProduct(index)"
                  class="edit-btn"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteProduct(index)"
                  class="delete-btn"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Contenido de la sección de ingredientes -->
    <div v-else-if="currentSection === 'ingredientes'" class="productos-page">
      <div class="left-side">
        <div class="header-row">
          <h1 class="title">Categorías de Ingredientes</h1>
          <div class="header-buttons">
            <button
              class="add-category-btn"
              @click="toggleAddCategoryForm('ingredientes')"
            >
              ➕ Agregar Categoría
            </button>
            <button
              class="delete-category-btn"
              @click="toggleDeleteCategoryForm('ingredientes')"
            >
              🗑️ Eliminar Categoría
            </button>
          </div>
        </div>
        <div class="category-list">
          <button
            v-for="category in ingredientCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedIngredientCategory === category }"
            @click="selectIngredientCategory(category)"
          >
            {{ category }} ({{ ingredients[category].length }})
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddIngredientForm">
          Agregar Ingrediente
        </button>
        <div v-if="selectedIngredientCategory" class="item-list">
          <h2>{{ selectedIngredientCategory }}</h2>
          <ul>
            <li
              v-for="(item, index) in ingredients[selectedIngredientCategory]"
              :key="item.name"
              class="item-row"
            >
              <span class="item-name">{{ index + 1 }}. {{ item.name }}</span>
              <div class="item-actions">
                <button
                  @click="editIngredient(index)"
                  class="edit-btn"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteIngredient(index)"
                  class="delete-btn"
                  title="Eliminar"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Contenido de la sección de stock -->
    <div v-else-if="currentSection === 'stock'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Stock</h1>
        <div class="stock-categories">
          <div class="category-section">
            <h3 class="section-title">Productos</h3>
            <div class="category-list">
              <button
                v-for="category in productCategories"
                :key="category"
                class="category-btn"
                :class="{ active: selectedStockProductCategory === category }"
                @click="selectStockProductCategory(category)"
              >
                {{ category }} ({{ products[category].length }})
              </button>
            </div>
          </div>
          <div class="category-section">
            <h3 class="section-title">Ingredientes</h3>
            <div class="category-list">
              <button
                v-for="category in ingredientCategories"
                :key="category"
                class="category-btn"
                :class="{
                  active: selectedStockIngredientCategory === category,
                }"
                @click="selectStockIngredientCategory(category)"
              >
                {{ category }} ({{ ingredients[category].length }})
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <div v-if="selectedStockProductCategory" class="item-list">
          <h2>{{ selectedStockProductCategory }} (Productos)</h2>
          <table class="quantity-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in products[selectedStockProductCategory]"
                :key="item.name"
              >
                <td>{{ index + 1 }}. {{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                  <button
                    @click="editStockProduct(index)"
                    class="edit-btn"
                    title="Editar Cantidad"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else-if="selectedStockIngredientCategory" class="item-list">
          <h2>{{ selectedStockIngredientCategory }} (Ingredientes)</h2>
          <table class="quantity-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in ingredients[
                  selectedStockIngredientCategory
                ]"
                :key="item.name"
              >
                <td>{{ index + 1 }}. {{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td>
                  <button
                    @click="editStockIngredient(index)"
                    class="edit-btn"
                    title="Editar Cantidad"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="stock-welcome">
          <h2>Bienvenido a la sección de Stock</h2>
          <p>
            Selecciona una categoría de productos o ingredientes del lado
            izquierdo para ver las cantidades disponibles.
          </p>
        </div>
      </div>
    </div>

    <!-- Contenido de la sección de reportes -->
    <div v-else-if="currentSection === 'reportes'" class="productos-page">
      <div class="left-side">
        <div
          v-if="lowStockAlerts.length > 0"
          class="alert-notification"
          @click="showAlerts = !showAlerts"
        >
          Alertas de Stock Bajo: {{ lowStockAlerts.length }} (Haz clic para ver)
        </div>
        <h1 class="title">Reportes de Inventario</h1>
        <div class="category-list">
          <button class="category-btn active" @click="generateReport">
            Generar Reporte General
          </button>
          <button class="category-btn" @click="showProductsReport">
            📊 Reporte de Productos
          </button>
          <button class="category-btn" @click="showIngredientsReport">
            📊 Reporte de Ingredientes
          </button>
          <button class="category-btn" @click="showLowStockReport">
            📊 Reporte de Stock Bajo
          </button>
          <button class="category-btn" @click="showCategoriesReport">
            📊 Reporte de Categorías
          </button>
          <button class="category-btn" @click="showInventoryValueReport">
            💰 Reporte de Valor de Inventario
          </button>
          <button class="category-btn" @click="showMovementReport">
            📈 Reporte de Movimientos
          </button>
          <button class="category-btn" @click="showSupplierReport">
            🏢 Reporte de Proveedores
          </button>
          <button class="category-btn" @click="showExpirationReport">
            ⏰ Reporte de Vencimientos
          </button>
          <button class="category-btn" @click="alertStock">
            ⚠️ Alertar ({{ lowStockAlerts.length }})
          </button>
          <button class="category-btn" @click="exportReport">
            📄 Exportar Reporte
          </button>
        </div>
      </div>
      <div class="right-side">
        <div class="report-content">
          <div class="report-header">
            <h2>Reporte de Inventario</h2>
            <p class="report-description">
              Información general del estado actual del inventario
            </p>
          </div>

          <div class="report-stats">
            <div class="stat-card" @click="showProductsModal = true">
              <div class="stat-icon">
                <i class="fas fa-boxes"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ totalProducts }}</div>
                <div class="stat-label">Total Productos</div>
              </div>
            </div>

            <div class="stat-card" @click="showIngredientsModal = true">
              <div class="stat-icon">
                <i class="fas fa-leaf"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ totalIngredients }}</div>
                <div class="stat-label">Total Ingredientes</div>
              </div>
            </div>

            <div class="stat-card warning" @click="showLowStockModal = true">
              <div class="stat-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ lowStockProducts }}</div>
                <div class="stat-label">Stock Bajo</div>
              </div>
            </div>
          </div>

          <div class="report-details">
            <div class="detail-section">
              <h4>Productos por Categoría</h4>
              <ul class="category-summary">
                <li
                  v-for="(count, category) in productCategoryCounts"
                  :key="category"
                >
                  {{ category }}: {{ count }} productos
                </li>
              </ul>
            </div>
            <div class="detail-section">
              <h4>Ingredientes por Categoría</h4>
              <ul class="category-summary">
                <li
                  v-for="(count, category) in ingredientCategoryCounts"
                  :key="category"
                >
                  {{ category }}: {{ count }} ingredientes
                </li>
              </ul>
            </div>
          </div>
          
          <div class="report-actions">
            <button class="generate-report-btn" @click="generateReport">
              <i class="fas fa-chart-bar"></i>
              Generar Reporte Detallado
            </button>
          </div>
        </div>
        <div v-if="showAlerts" class="alerts-display">
          <div class="alerts-header">
            <h3>Alertas de Stock Bajo</h3>
            <span class="alerts-count">{{ lowStockAlerts.length }} items</span>
          </div>
          <div class="alerts-list">
            <div
              v-for="alert in lowStockAlerts"
              :key="alert.name"
              class="alert-card"
              :class="{
                'low-stock': alert.quantity < 5,
                'medium-stock': alert.quantity >= 5 && alert.quantity < 10,
              }"
            >
              <div class="alert-info">
                <div class="alert-name">{{ alert.name }}</div>
                <div class="alert-type">{{ alert.type }}</div>
              </div>
              <div class="alert-quantity">
                <span class="quantity-value">{{ alert.quantity }}</span>
                <span class="quantity-unit">unidades</span>
              </div>
              <div class="alert-status">
                <span v-if="alert.quantity < 5" class="status-critical"
                  >Crítico</span
                >
                <span v-else class="status-warning">Bajo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar producto -->
    <div
      v-if="showAddProductForm"
      class="modal-overlay"
      @click="toggleAddProductForm"
    >
      <div class="modal-content" @click.stop>
        <h3>Agregar Producto</h3>
        <select v-model="newProduct.category">
          <option disabled value="">Selecciona una categoría</option>
          <option
            v-for="category in productCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <input v-model="newProduct.name" placeholder="Nombre del producto" />
        <input
          v-model.number="newProduct.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="addProduct">Agregar</button>
          <button @click="toggleAddProductForm">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para editar producto -->
    <div
      v-if="showEditProductForm"
      class="modal-overlay"
      @click="showEditProductForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Producto</h3>
        <input v-model="newProduct.name" placeholder="Nombre del producto" />
        <input
          v-model.number="newProduct.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="updateProduct">Actualizar</button>
          <button @click="showEditProductForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar ingrediente -->
    <div
      v-if="showAddIngredientForm"
      class="modal-overlay"
      @click="toggleAddIngredientForm"
    >
      <div class="modal-content" @click.stop>
        <h3>Agregar Ingrediente</h3>
        <select v-model="newIngredient.category">
          <option disabled value="">Selecciona una categoría</option>
          <option
            v-for="category in ingredientCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <input
          v-model="newIngredient.name"
          placeholder="Nombre del ingrediente"
        />
        <input
          v-model.number="newIngredient.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="addIngredient">Agregar</button>
          <button @click="toggleAddIngredientForm">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para editar ingrediente -->
    <div
      v-if="showEditIngredientForm"
      class="modal-overlay"
      @click="showEditIngredientForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Ingrediente</h3>
        <input
          v-model="newIngredient.name"
          placeholder="Nombre del ingrediente"
        />
        <input
          v-model.number="newIngredient.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="updateIngredient">Actualizar</button>
          <button @click="showEditIngredientForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar categoría -->
    <div
      v-if="showAddCategoryForm"
      class="modal-overlay"
      @click="showAddCategoryForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Agregar Nueva Categoría</h3>
        <input
          v-model="newCategory.name"
          placeholder="Nombre de la categoría"
        />
        <div class="modal-buttons">
          <button @click="addCategory">Agregar</button>
          <button @click="showAddCategoryForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para eliminar categoría -->
    <div
      v-if="showDeleteCategoryForm"
      class="modal-overlay"
      @click="showDeleteCategoryForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Eliminar Categoría</h3>
        <p>Selecciona la categoría que deseas eliminar:</p>
        <select v-model="selectedCategoryToDelete">
          <option disabled value="">Selecciona una categoría</option>
          <option
            v-for="category in deleteType === 'productos'
              ? productCategories
              : ingredientCategories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <div class="modal-buttons">
          <button @click="deleteCategory(deleteType, selectedCategoryToDelete)">
            Eliminar
          </button>
          <button @click="showDeleteCategoryForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para alertas -->
    <div
      v-if="showAlertsModal"
      class="modal-overlay"
      @click="showAlertsModal = false"
    >
      <div class="alerts-modal-content" @click.stop>
        <div class="alerts-modal-header">
          <div class="alerts-modal-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="alerts-modal-title">
            <h3>Alertas de Stock Bajo</h3>
            <p class="alerts-modal-subtitle">
              Tienes {{ lowStockAlerts.length }} items con stock bajo
            </p>
          </div>
        </div>
        <div class="alerts-modal-body">
          <p class="alerts-modal-description">
            ¿Qué acción deseas realizar con las alertas de stock bajo?
          </p>
          <div class="alerts-modal-options">
            <div class="alert-option" @click="updateAlerts">
              <div class="option-icon">
                <i class="fas fa-edit"></i>
              </div>
              <div class="option-content">
                <h4>Actualizar Cantidades</h4>
                <p>
                  Modificar las cantidades de productos e ingredientes con stock
                  bajo
                </p>
              </div>
            </div>
            <div class="alert-option" @click="markAlertsAsViewed">
              <div class="option-icon">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="option-content">
                <h4>Marcar como Vistas</h4>
                <p>
                  Ocultar las alertas temporalmente sin modificar cantidades
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="alerts-modal-footer">
          <button class="cancel-btn" @click="showAlertsModal = false">
            <i class="fas fa-times"></i>
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para actualizar reportes -->
    <div
      v-if="showUpdateReportsModal"
      class="modal-overlay"
      @click="showUpdateReportsModal = false"
    >
      <div class="modal-content large-modal" @click.stop>
        <h3>Actualizar Cantidades de Reportes</h3>
        <p>
          Edita las cantidades de los productos e ingredientes con stock bajo:
        </p>
        <div class="update-list">
          <div
            v-for="(item, index) in updateQuantities"
            :key="item.name"
            class="update-item"
          >
            <span class="update-name">{{ item.name }} ({{ item.type }})</span>
            <input
              v-model.number="item.newQuantity"
              type="number"
              class="update-input"
              :min="0"
            />
          </div>
        </div>
        <div class="modal-buttons">
          <button @click="applyUpdates">Actualizar Cantidades</button>
          <button @click="showUpdateReportsModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para editar stock -->
    <div
      v-if="showEditStockForm"
      class="modal-overlay"
      @click="showEditStockForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Cantidad de Stock</h3>
        <p>{{ editStockItem.name }}</p>
        <input
          v-model.number="editStockItem.quantity"
          type="number"
          placeholder="Nueva cantidad"
          :min="0"
        />
        <div class="modal-buttons">
          <button @click="updateStock">Actualizar</button>
          <button @click="showEditStockForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para productos -->
    <div
      v-if="showProductsModal"
      class="modal-overlay"
      @click="showProductsModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-boxes"></i>
          </div>
          <div class="report-modal-title">
            <h3>Lista Completa de Productos</h3>
            <p class="report-modal-subtitle">
              Total: {{ totalProducts }} productos
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="products-list">
            <div
              v-for="(categoryItems, categoryName) in products"
              :key="categoryName"
              class="category-section-modal"
            >
              <h4 class="category-title-modal">{{ categoryName }}</h4>
              <div class="items-grid">
                <div
                  v-for="item in categoryItems"
                  :key="item.name"
                  class="item-card"
                  :class="{ 'low-stock': item.quantity < 10 }"
                >
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-quantity">Cantidad: {{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="close-btn" @click="showProductsModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para ingredientes -->
    <div
      v-if="showIngredientsModal"
      class="modal-overlay"
      @click="showIngredientsModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-leaf"></i>
          </div>
          <div class="report-modal-title">
            <h3>Lista Completa de Ingredientes</h3>
            <p class="report-modal-subtitle">
              Total: {{ totalIngredients }} ingredientes
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="ingredients-list">
            <div
              v-for="(categoryItems, categoryName) in ingredients"
              :key="categoryName"
              class="category-section-modal"
            >
              <h4 class="category-title-modal">{{ categoryName }}</h4>
              <div class="items-grid">
                <div
                  v-for="item in categoryItems"
                  :key="item.name"
                  class="item-card"
                  :class="{ 'low-stock': item.quantity < 10 }"
                >
                  <div class="item-name">{{ item.name }}</div>
                  <div class="item-quantity">Cantidad: {{ item.quantity }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="close-btn" @click="showIngredientsModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para stock bajo -->
    <div
      v-if="showLowStockModal"
      class="modal-overlay"
      @click="showLowStockModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="report-modal-title">
            <h3>Items con Stock Bajo</h3>
            <p class="report-modal-subtitle">
              Total: {{ lowStockAlerts.length }} items requieren atención
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="low-stock-modal-list">
            <div
              v-for="alert in lowStockAlerts"
              :key="alert.name"
              class="alert-card-modal"
              :class="{
                critical: alert.quantity < 5,
                warning: alert.quantity >= 5 && alert.quantity < 10,
              }"
            >
              <div class="alert-info-modal">
                <div class="alert-name-modal">{{ alert.name }}</div>
                <div class="alert-type-modal">{{ alert.type }}</div>
              </div>
              <div class="alert-quantity-modal">
                <span class="quantity-value-modal">{{ alert.quantity }}</span>
                <span class="quantity-unit-modal">unidades</span>
              </div>
              <div class="alert-status-modal">
                <span v-if="alert.quantity < 5" class="status-critical-modal"
                  >Crítico</span
                >
                <span v-else class="status-warning-modal">Bajo</span>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="update-btn" @click="updateAlerts">
            <i class="fas fa-edit"></i>
            Actualizar Cantidades
          </button>
          <button class="close-btn" @click="showLowStockModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte general -->
    <div
      v-if="showReportModal"
      class="modal-overlay"
      @click="showReportModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-chart-bar"></i>
          </div>
          <div class="report-modal-title">
            <h3>Reporte General de Inventario</h3>
            <p class="report-modal-subtitle">
              Generado el {{ reportData.generatedAt }}
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-boxes"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ reportData.summary.totalProducts }}</h4>
                  <p>Total Productos</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-leaf"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ reportData.summary.totalIngredients }}</h4>
                  <p>Total Ingredientes</p>
                </div>
              </div>
              <div class="summary-card warning">
                <div class="summary-icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ reportData.summary.lowStockAlerts }}</h4>
                  <p>Alertas Stock Bajo</p>
                </div>
              </div>
            </div>
          </div>

          <div class="report-sections">
            <!-- Reporte de Productos -->
            <div class="report-section">
              <h4>📦 Reporte de Productos</h4>
              <div class="detailed-category-breakdown">
                <div
                  v-for="(
                    categoryData, categoryName
                  ) in reportData.productsByCategory"
                  :key="categoryName"
                  class="detailed-category-section"
                >
                  <h5 class="detailed-category-title">{{ categoryName }}</h5>
                  <div class="detailed-items-list">
                    <div
                      v-for="item in categoryData.items"
                      :key="item.name"
                      class="detailed-item"
                      :class="{ 'low-stock': item.quantity < 10 }"
                    >
                      <span class="detailed-item-name">{{ item.name }}</span>
                      <span class="detailed-item-quantity"
                        >Cantidad: {{ item.quantity }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Ingredientes -->
            <div class="report-section">
              <h4>🥕 Reporte de Ingredientes</h4>
              <div class="detailed-category-breakdown">
                <div
                  v-for="(
                    categoryData, categoryName
                  ) in reportData.ingredientsByCategory"
                  :key="categoryName"
                  class="detailed-category-section"
                >
                  <h5 class="detailed-category-title">{{ categoryName }}</h5>
                  <div class="detailed-items-list">
                    <div
                      v-for="item in categoryData.items"
                      :key="item.name"
                      class="detailed-item"
                      :class="{ 'low-stock': item.quantity < 10 }"
                    >
                      <span class="detailed-item-name">{{ item.name }}</span>
                      <span class="detailed-item-quantity"
                        >Cantidad: {{ item.quantity }}</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Stock -->
            <div class="report-section">
              <h4>📊 Reporte de Stock</h4>
              <div class="stock-report-content">
                <div class="stock-section">
                  <h5>Productos por Categoría</h5>
                  <div class="stock-items">
                    <div
                      v-for="(categoryItems, categoryName) in reportData
                        .stockReport.products"
                      :key="categoryName"
                      class="stock-category"
                    >
                      <h6>{{ categoryName }}</h6>
                      <div class="stock-items-list">
                        <div
                          v-for="item in categoryItems"
                          :key="item.name"
                          class="stock-item"
                          :class="{ 'low-stock': item.quantity < 10 }"
                        >
                          <span class="stock-item-name">{{ item.name }}</span>
                          <span class="stock-item-quantity">{{
                            item.quantity
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="stock-section">
                  <h5>Ingredientes por Categoría</h5>
                  <div class="stock-items">
                    <div
                      v-for="(categoryItems, categoryName) in reportData
                        .stockReport.ingredients"
                      :key="categoryName"
                      class="stock-category"
                    >
                      <h6>{{ categoryName }}</h6>
                      <div class="stock-items-list">
                        <div
                          v-for="item in categoryItems"
                          :key="item.name"
                          class="stock-item"
                          :class="{ 'low-stock': item.quantity < 10 }"
                        >
                          <span class="stock-item-name">{{ item.name }}</span>
                          <span class="stock-item-quantity">{{
                            item.quantity
                          }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Categorías -->
            <div class="report-section">
              <h4>📂 Reporte de Categorías</h4>
              <div class="categories-report-content">
                <div class="categories-section">
                  <h5>Categorías de Productos</h5>
                  <div class="categories-list">
                    <div
                      v-for="(count, category) in reportData.categoriesReport
                        .productCategoryCounts"
                      :key="category"
                      class="category-stat"
                    >
                      <span class="category-name">{{ category }}</span>
                      <span class="category-count">{{ count }} productos</span>
                    </div>
                  </div>
                  <div class="largest-category">
                    <strong>Categoría más grande:</strong>
                    {{ reportData.categoriesReport.largestProductCategory }}
                  </div>
                </div>
                <div class="categories-section">
                  <h5>Categorías de Ingredientes</h5>
                  <div class="categories-list">
                    <div
                      v-for="(count, category) in reportData.categoriesReport
                        .ingredientCategoryCounts"
                      :key="category"
                      class="category-stat"
                    >
                      <span class="category-name">{{ category }}</span>
                      <span class="category-count"
                        >{{ count }} ingredientes</span
                      >
                    </div>
                  </div>
                  <div class="largest-category">
                    <strong>Categoría más grande:</strong>
                    {{ reportData.categoriesReport.largestIngredientCategory }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Valor de Inventario -->
            <div class="report-section">
              <h4>💰 Reporte de Valor de Inventario</h4>
              <div class="value-report-content">
                <div class="value-summary">
                  <div class="value-item">
                    <span class="value-label">Valor Total:</span>
                    <span class="value-amount">{{
                      reportData.inventoryValueReport.summary.totalValue
                    }}</span>
                  </div>
                  <div class="value-item">
                    <span class="value-label">Valor de Productos:</span>
                    <span class="value-amount">{{
                      reportData.inventoryValueReport.summary.productValue
                    }}</span>
                  </div>
                  <div class="value-item">
                    <span class="value-label">Valor de Ingredientes:</span>
                    <span class="value-amount">{{
                      reportData.inventoryValueReport.summary.ingredientValue
                    }}</span>
                  </div>
                </div>
                <div class="value-breakdown">
                  <div class="value-section">
                    <h5>Valor por Categoría de Productos</h5>
                    <div class="value-list">
                      <div
                        v-for="(data, category) in reportData
                          .inventoryValueReport.productsByCategory"
                        :key="category"
                        class="value-category"
                      >
                        <span class="value-category-name">{{ category }}</span>
                        <span class="value-category-amount">{{
                          data.value
                        }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="value-section">
                    <h5>Valor por Categoría de Ingredientes</h5>
                    <div class="value-list">
                      <div
                        v-for="(data, category) in reportData
                          .inventoryValueReport.ingredientsByCategory"
                        :key="category"
                        class="value-category"
                      >
                        <span class="value-category-name">{{ category }}</span>
                        <span class="value-category-amount">{{
                          data.value
                        }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Movimientos -->
            <div class="report-section">
              <h4>📈 Reporte de Movimientos</h4>
              <div class="movements-report-content">
                <div class="movements-summary">
                  <div class="movement-stat">
                    <span class="stat-label">Total Entradas:</span>
                    <span class="stat-value">{{
                      reportData.movementReport.summary.totalEntries
                    }}</span>
                  </div>
                  <div class="movement-stat">
                    <span class="stat-label">Total Salidas:</span>
                    <span class="stat-value">{{
                      reportData.movementReport.summary.totalExits
                    }}</span>
                  </div>
                  <div class="movement-stat">
                    <span class="stat-label">Total Movimientos:</span>
                    <span class="stat-value">{{
                      reportData.movementReport.summary.totalItems
                    }}</span>
                  </div>
                </div>
                <div class="movements-list">
                  <h5>Historial de Movimientos</h5>
                  <div class="movements-items">
                    <div
                      v-for="movement in reportData.movementReport.movements"
                      :key="movement.date + movement.item"
                      class="movement-item"
                      :class="{
                        entry: movement.type === 'Entrada',
                        exit: movement.type === 'Salida',
                      }"
                    >
                      <div class="movement-info">
                        <div class="movement-date">{{ movement.date }}</div>
                        <div class="movement-details">
                          <span class="movement-item-name">{{
                            movement.item
                          }}</span>
                          <span class="movement-category"
                            >({{ movement.category }})</span
                          >
                        </div>
                      </div>
                      <div class="movement-quantity">
                        <span
                          class="quantity-badge"
                          :class="movement.type.toLowerCase()"
                        >
                          {{ movement.type === "Entrada" ? "+" : "-"
                          }}{{ movement.quantity }}
                        </span>
                      </div>
                      <div class="movement-reason">
                        <span class="reason-text">{{ movement.reason }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Proveedores -->
            <div class="report-section">
              <h4>🏢 Reporte de Proveedores</h4>
              <div class="suppliers-report-content">
                <div class="suppliers-summary">
                  <div class="supplier-stat">
                    <span class="stat-label">Total Proveedores:</span>
                    <span class="stat-value">{{
                      reportData.supplierReport.summary.totalSuppliers
                    }}</span>
                  </div>
                  <div class="supplier-stat">
                    <span class="stat-label">Proveedores Activos:</span>
                    <span class="stat-value">{{
                      reportData.supplierReport.summary.activeSuppliers
                    }}</span>
                  </div>
                </div>
                <div class="suppliers-list">
                  <h5>Lista de Proveedores</h5>
                  <div class="suppliers-items">
                    <div
                      v-for="supplier in reportData.supplierReport.suppliers"
                      :key="supplier.name"
                      class="supplier-item"
                    >
                      <div class="supplier-info">
                        <div class="supplier-name">{{ supplier.name }}</div>
                        <div class="supplier-contact">
                          {{ supplier.contact }}
                        </div>
                      </div>
                      <div class="supplier-products">
                        <div class="products-label">Productos:</div>
                        <div class="products-list">
                          <span
                            v-for="product in supplier.products"
                            :key="product"
                            class="product-tag"
                          >
                            {{ product }}
                          </span>
                        </div>
                      </div>
                      <div class="supplier-last-order">
                        <div class="last-order-label">Último pedido:</div>
                        <div class="last-order-date">
                          {{ supplier.lastOrder }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reporte de Vencimientos -->
            <div class="report-section">
              <h4>⏰ Reporte de Vencimientos</h4>
              <div class="expirations-report-content">
                <div class="expirations-summary">
                  <div class="expiration-stat">
                    <span class="stat-label">Items Críticos (≤3 días):</span>
                    <span class="stat-value">{{
                      reportData.expirationReport.summary.criticalItems
                    }}</span>
                  </div>
                  <div class="expiration-stat">
                    <span class="stat-label"
                      >Items de Advertencia (≤7 días):</span
                    >
                    <span class="stat-value">{{
                      reportData.expirationReport.summary.warningItems
                    }}</span>
                  </div>
                  <div class="expiration-stat">
                    <span class="stat-label">Total Próximos a Vencer:</span>
                    <span class="stat-value">{{
                      reportData.expirationReport.summary.totalExpiring
                    }}</span>
                  </div>
                </div>
                <div class="expiring-items-list">
                  <h5>Items Próximos a Vencer</h5>
                  <div class="expiring-items">
                    <div
                      v-for="item in reportData.expirationReport.expiringItems"
                      :key="item.name"
                      class="expiring-item"
                      :class="{
                        critical: item.daysUntilExpiration <= 3,
                        warning:
                          item.daysUntilExpiration > 3 &&
                          item.daysUntilExpiration <= 7,
                      }"
                    >
                      <div class="item-info">
                        <div class="item-name">{{ item.name }}</div>
                        <div class="item-category">{{ item.category }}</div>
                      </div>
                      <div class="item-quantity">
                        <span class="quantity">{{ item.quantity }}</span>
                        <span class="unit">unidades</span>
                      </div>
                      <div class="expiration-info">
                        <div class="expiration-date">
                          {{ item.expirationDate }}
                        </div>
                        <div class="days-remaining">
                          <span
                            class="days-badge"
                            :class="{
                              critical: item.daysUntilExpiration <= 3,
                              warning:
                                item.daysUntilExpiration > 3 &&
                                item.daysUntilExpiration <= 7,
                            }"
                          >
                            {{ item.daysUntilExpiration }} días
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alertas -->
            <div class="report-section">
              <h4>⚠️ Alertas de Stock Bajo</h4>
              <div class="alerts-report-content">
                <div class="alerts-summary">
                  <div class="alert-stat">
                    <span class="stat-label">Total Alertas:</span>
                    <span class="stat-value">{{
                      reportData.alertsReport.length
                    }}</span>
                  </div>
                </div>
                <div class="alerts-list">
                  <h5>Items con Stock Bajo</h5>
                  <div class="alerts-items">
                    <div
                      v-for="alert in reportData.alertsReport"
                      :key="alert.name"
                      class="alert-card"
                      :class="{
                        'low-stock': alert.quantity < 5,
                        'medium-stock':
                          alert.quantity >= 5 && alert.quantity < 10,
                      }"
                    >
                      <div class="alert-info">
                        <div class="alert-name">{{ alert.name }}</div>
                        <div class="alert-type">{{ alert.type }}</div>
                      </div>
                      <div class="alert-quantity">
                        <span class="quantity-value">{{ alert.quantity }}</span>
                        <span class="quantity-unit">unidades</span>
                      </div>
                      <div class="alert-status">
                        <span v-if="alert.quantity < 5" class="status-critical"
                          >Crítico</span
                        >
                        <span v-else class="status-warning">Bajo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <div class="export-options">
            <label for="export-format">Formato de Exportación:</label>
            <select
              id="export-format"
              v-model="exportFormat"
              class="export-select"
            >
              <option value="pdf">Factura (PDF)</option>
              <option value="txt">Texto (TXT)</option>
            </select>
            <button class="export-btn" @click="exportReportData(exportFormat)">
              <i class="fas fa-download"></i>
              Exportar Reporte
            </button>
          </div>
          <button class="close-btn" @click="showReportModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte de categorías -->
    <div
      v-if="showCategoriesModal"
      class="modal-overlay"
      @click="showCategoriesModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-tags"></i>
          </div>
          <div class="report-modal-title">
            <h3>Reporte de Categorías</h3>
            <p class="report-modal-subtitle">
              Resumen completo por categorías de productos e ingredientes
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="categories-report">
            <div class="report-section">
              <h4>Productos por Categoría</h4>
              <div class="category-breakdown">
                <div
                  v-for="(count, category) in productCategoryCounts"
                  :key="category"
                  class="category-item"
                >
                  <div class="category-info">
                    <span class="category-name">{{ category }}</span>
                    <span class="category-count">{{ count }} productos</span>
                  </div>
                  <div class="category-stats">
                    <span class="category-percentage">
                      {{ ((count / totalProducts) * 100).toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h4>Ingredientes por Categoría</h4>
              <div class="category-breakdown">
                <div
                  v-for="(count, category) in ingredientCategoryCounts"
                  :key="category"
                  class="category-item"
                >
                  <div class="category-info">
                    <span class="category-name">{{ category }}</span>
                    <span class="category-count">{{ count }} ingredientes</span>
                  </div>
                  <div class="category-stats">
                    <span class="category-percentage">
                      {{ ((count / totalIngredients) * 100).toFixed(1) }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h4>Estadísticas Generales</h4>
              <div class="stats-overview">
                <div class="stat-item">
                  <div class="stat-label">Total de Categorías de Productos</div>
                  <div class="stat-value">{{ productCategories.length }}</div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">
                    Total de Categorías de Ingredientes
                  </div>
                  <div class="stat-value">
                    {{ ingredientCategories.length }}
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">Categoría más grande (Productos)</div>
                  <div class="stat-value">
                    {{ getLargestCategory(productCategoryCounts) }}
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-label">
                    Categoría más grande (Ingredientes)
                  </div>
                  <div class="stat-value">
                    {{ getLargestCategory(ingredientCategoryCounts) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="close-btn" @click="showCategoriesModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte de valor de inventario -->
    <div
      v-if="showInventoryValueModal"
      class="modal-overlay"
      @click="showInventoryValueModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="report-modal-title">
            <h3>{{ inventoryValueReport.title }}</h3>
            <p class="report-modal-subtitle">
              Generado el {{ inventoryValueReport.generatedAt }}
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ inventoryValueReport.summary.totalValue }}</h4>
                  <p>Valor Total del Inventario</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-boxes"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ inventoryValueReport.summary.productValue }}</h4>
                  <p>Valor de Productos</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-leaf"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ inventoryValueReport.summary.ingredientValue }}</h4>
                  <p>Valor de Ingredientes</p>
                </div>
              </div>
            </div>
          </div>

          <div class="report-sections">
            <div class="report-section">
              <h4>Valor por Categoría de Productos</h4>
              <div class="category-breakdown">
                <div
                  v-for="(
                    categoryData, categoryName
                  ) in inventoryValueReport.productsByCategory"
                  :key="categoryName"
                  class="category-item"
                >
                  <div class="category-info">
                    <span class="category-name">{{ categoryName }}</span>
                    <span class="category-count"
                      >{{ categoryData.count }} productos</span
                    >
                  </div>
                  <div class="category-stats">
                    <span class="category-value">{{ categoryData.value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="report-section">
              <h4>Valor por Categoría de Ingredientes</h4>
              <div class="category-breakdown">
                <div
                  v-for="(
                    categoryData, categoryName
                  ) in inventoryValueReport.ingredientsByCategory"
                  :key="categoryName"
                  class="category-item"
                >
                  <div class="category-info">
                    <span class="category-name">{{ categoryName }}</span>
                    <span class="category-count"
                      >{{ categoryData.count }} ingredientes</span
                    >
                  </div>
                  <div class="category-stats">
                    <span class="category-value">{{ categoryData.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="export-btn" @click="exportInventoryValueReport">
            <i class="fas fa-download"></i>
            Exportar Reporte
          </button>
          <button class="close-btn" @click="showInventoryValueModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte de movimientos -->
    <div
      v-if="showMovementModal"
      class="modal-overlay"
      @click="showMovementModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-exchange-alt"></i>
          </div>
          <div class="report-modal-title">
            <h3>{{ movementReport.title }}</h3>
            <p class="report-modal-subtitle">
              Generado el {{ movementReport.generatedAt }}
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-arrow-up"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ movementReport.summary.totalEntries }}</h4>
                  <p>Total Entradas</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-arrow-down"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ movementReport.summary.totalExits }}</h4>
                  <p>Total Salidas</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-list"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ movementReport.summary.totalItems }}</h4>
                  <p>Total Movimientos</p>
                </div>
              </div>
            </div>
          </div>

          <div class="report-sections">
            <div class="report-section">
              <h4>Historial de Movimientos</h4>
              <div class="movements-list">
                <div
                  v-for="movement in movementReport.movements"
                  :key="movement.date + movement.item"
                  class="movement-item"
                  :class="{
                    entry: movement.type === 'Entrada',
                    exit: movement.type === 'Salida',
                  }"
                >
                  <div class="movement-info">
                    <div class="movement-date">{{ movement.date }}</div>
                    <div class="movement-details">
                      <span class="movement-item-name">{{
                        movement.item
                      }}</span>
                      <span class="movement-category"
                        >({{ movement.category }})</span
                      >
                    </div>
                  </div>
                  <div class="movement-quantity">
                    <span
                      class="quantity-badge"
                      :class="movement.type.toLowerCase()"
                    >
                      {{ movement.type === "Entrada" ? "+" : "-"
                      }}{{ movement.quantity }}
                    </span>
                  </div>
                  <div class="movement-reason">
                    <span class="reason-text">{{ movement.reason }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="export-btn" @click="exportMovementReport">
            <i class="fas fa-download"></i>
            Exportar Reporte
          </button>
          <button class="close-btn" @click="showMovementModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte de proveedores -->
    <div
      v-if="showSupplierModal"
      class="modal-overlay"
      @click="showSupplierModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon">
            <i class="fas fa-truck"></i>
          </div>
          <div class="report-modal-title">
            <h3>{{ supplierReport.title }}</h3>
            <p class="report-modal-subtitle">
              Generado el {{ supplierReport.generatedAt }}
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <div class="summary-grid">
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-building"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ supplierReport.summary.totalSuppliers }}</h4>
                  <p>Total Proveedores</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-check-circle"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ supplierReport.summary.activeSuppliers }}</h4>
                  <p>Proveedores Activos</p>
                </div>
              </div>
            </div>
          </div>

          <div class="report-sections">
            <div class="report-section">
              <h4>Lista de Proveedores</h4>
              <div class="suppliers-list">
                <div
                  v-for="supplier in supplierReport.suppliers"
                  :key="supplier.name"
                  class="supplier-item"
                >
                  <div class="supplier-info">
                    <div class="supplier-name">{{ supplier.name }}</div>
                    <div class="supplier-contact">{{ supplier.contact }}</div>
                  </div>
                  <div class="supplier-products">
                    <div class="products-label">Productos:</div>
                    <div class="products-list">
                      <span
                        v-for="product in supplier.products"
                        :key="product"
                        class="product-tag"
                      >
                        {{ product }}
                      </span>
                    </div>
                  </div>
                  <div class="supplier-last-order">
                    <div class="last-order-label">Último pedido:</div>
                    <div class="last-order-date">{{ supplier.lastOrder }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="export-btn" @click="exportSupplierReport">
            <i class="fas fa-download"></i>
            Exportar Reporte
          </button>
          <button class="close-btn" @click="showSupplierModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para reporte de vencimientos -->
    <div
      v-if="showExpirationModal"
      class="modal-overlay"
      @click="showExpirationModal = false"
    >
      <div class="report-modal-content" @click.stop>
        <div class="report-modal-header">
          <div class="report-modal-icon warning">
            <i class="fas fa-clock"></i>
          </div>
          <div class="report-modal-title">
            <h3>{{ expirationReport.title }}</h3>
            <p class="report-modal-subtitle">
              Generado el {{ expirationReport.generatedAt }}
            </p>
          </div>
        </div>
        <div class="report-modal-body">
          <div class="report-summary">
            <div class="summary-grid">
              <div class="summary-card warning">
                <div class="summary-icon">
                  <i class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ expirationReport.summary.criticalItems }}</h4>
                  <p>Items Críticos (≤3 días)</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ expirationReport.summary.warningItems }}</h4>
                  <p>Items de Advertencia (≤7 días)</p>
                </div>
              </div>
              <div class="summary-card">
                <div class="summary-icon">
                  <i class="fas fa-calendar-times"></i>
                </div>
                <div class="summary-content">
                  <h4>{{ expirationReport.summary.totalExpiring }}</h4>
                  <p>Total Próximos a Vencer</p>
                </div>
              </div>
            </div>
          </div>

          <div class="report-sections">
            <div class="report-section">
              <h4>Items Próximos a Vencer</h4>
              <div class="expiring-items-list">
                <div
                  v-for="item in expirationReport.expiringItems"
                  :key="item.name"
                  class="expiring-item"
                  :class="{
                    critical: item.daysUntilExpiration <= 3,
                    warning:
                      item.daysUntilExpiration > 3 &&
                      item.daysUntilExpiration <= 7,
                  }"
                >
                  <div class="item-info">
                    <div class="item-name">{{ item.name }}</div>
                    <div class="item-category">{{ item.category }}</div>
                  </div>
                  <div class="item-quantity">
                    <span class="quantity">{{ item.quantity }}</span>
                    <span class="unit">unidades</span>
                  </div>
                  <div class="expiration-info">
                    <div class="expiration-date">{{ item.expirationDate }}</div>
                    <div class="days-remaining">
                      <span
                        class="days-badge"
                        :class="{
                          critical: item.daysUntilExpiration <= 3,
                          warning:
                            item.daysUntilExpiration > 3 &&
                            item.daysUntilExpiration <= 7,
                        }"
                      >
                        {{ item.daysUntilExpiration }} días
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="report-modal-footer">
          <button class="export-btn" @click="exportExpirationReport">
            <i class="fas fa-download"></i>
            Exportar Reporte
          </button>
          <button class="close-btn" @click="showExpirationModal = false">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import jsPDF from "jspdf";
import "jspdf-autotable";

const currentSection = ref("productos");
const productCategories = ref([
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
const products = ref({
  Bebidas: [
    { name: "Coca Cola", quantity: 10 },
    { name: "Sprite", quantity: 5 },
  ],
  Entradas: [
    { name: "Empanadas", quantity: 20 },
    { name: "Patacones", quantity: 15 },
  ],
  Adicionales: [
    { name: "Arroz", quantity: 30 },
    { name: "Frijoles", quantity: 25 },
  ],
  "Comida de Mar": [{ name: "Ceviche de Camarón", quantity: 10 }],
  "Nuestros Pescados": [{ name: "Mojarra Frita", quantity: 8 }],
  "Cocina Tipica": [{ name: "Bandeja Paisa", quantity: 5 }],
  Res: [{ name: "Churrasco", quantity: 12 }],
  Cerdo: [{ name: "Lechona", quantity: 6 }],
  Pastas: [{ name: "Spaghetti Carbonara", quantity: 10 }],
  Aves: [{ name: "Pollo con Papas", quantity: 15 }],
  Vegetales: [{ name: "Ensalada Mixta", quantity: 20 }],
  Postres: [{ name: "Tres Leches", quantity: 10 }],
  Ensaladas: [{ name: "Ensalada César", quantity: 12 }],
});
const ingredientCategories = ref([
  "Verduras",
  "Frutas",
  "Carnes",
  "Lácteos",
  "Especias",
  "Granos",
  "Aceites",
  "Condimentos",
]);
const ingredients = ref({
  Verduras: [
    { name: "Lechuga", quantity: 20 },
    { name: "Tomate", quantity: 15 },
  ],
  Frutas: [],
  Carnes: [],
  Lácteos: [],
  Especias: [],
  Granos: [],
  Aceites: [],
  Condimentos: [],
});
const selectedProductCategory = ref("");
const selectedIngredientCategory = ref("");
const selectedStockCategory = ref("");
const selectedStockProductCategory = ref("");
const selectedStockIngredientCategory = ref("");
const showAddProductForm = ref(false);
const showAddIngredientForm = ref(false);
const showEditProductForm = ref(false);
const showEditIngredientForm = ref(false);
const showAddCategoryForm = ref(false);
const showDeleteCategoryForm = ref(false);
const newProduct = ref({ category: "", name: "", quantity: 0 });
const newIngredient = ref({ category: "", name: "", quantity: 0 });
const newCategory = ref({ name: "", type: "" });
const editingProductIndex = ref(-1);
const editingIngredientIndex = ref(-1);
const selectedCategoryToDelete = ref("");
const deleteType = ref("");
const showAlerts = ref(false);
const storedAlerts = ref([]);
const showAlertsModal = ref(false);
const showUpdateReportsModal = ref(false);
const updateQuantities = ref([]);
const showEditStockForm = ref(false);
const editStockItem = ref({ name: "", quantity: 0 });
const editingStockIndex = ref(-1);
const editingStockType = ref("");
const showReportModal = ref(false);
const reportData = ref({});
const showProductsModal = ref(false);
const showIngredientsModal = ref(false);
const showLowStockModal = ref(false);
const showCategoriesModal = ref(false);
const showInventoryValueModal = ref(false);
const inventoryValueReport = ref({});
const showMovementModal = ref(false);
const movementReport = ref({});
const showSupplierModal = ref(false);
const supplierReport = ref({});
const showExpirationModal = ref(false);
const expirationReport = ref({});
const exportFormat = ref("pdf");

const totalProducts = computed(() => {
  let total = 0;
  for (const category in products.value) {
    total += products.value[category].length;
  }
  return total;
});

const totalIngredients = computed(() => {
  let total = 0;
  for (const category in ingredients.value) {
    total += ingredients.value[category].length;
  }
  return total;
});

const lowStockProducts = computed(() => {
  let count = 0;
  for (const category in products.value) {
    count += products.value[category].filter(
      (item) => item.quantity < 5
    ).length;
  }
  return count;
});

const lowStockAlerts = computed(() => {
  const alerts = [];
  // Check products
  for (const category in products.value) {
    products.value[category].forEach((item) => {
      if (item.quantity < 10) {
        alerts.push({
          name: item.name,
          quantity: item.quantity,
          type: "Producto",
        });
      }
    });
  }
  // Check ingredients
  for (const category in ingredients.value) {
    ingredients.value[category].forEach((item) => {
      if (item.quantity < 10) {
        alerts.push({
          name: item.name,
          quantity: item.quantity,
          type: "Ingrediente",
        });
      }
    });
  }
  return alerts;
});

const productCategoryCounts = computed(() => {
  const counts = {};
  for (const category in products.value) {
    counts[category] = products.value[category].length;
  }
  return counts;
});

const ingredientCategoryCounts = computed(() => {
  const counts = {};
  for (const category in ingredients.value) {
    counts[category] = ingredients.value[category].length;
  }
  return counts;
});

const selectProductCategory = (category) => {
  selectedProductCategory.value = category;
};

const selectIngredientCategory = (category) => {
  selectedIngredientCategory.value = category;
};

const selectStockCategory = (category) => {
  selectedStockCategory.value = category;
};

const selectStockProductCategory = (category) => {
  selectedStockProductCategory.value = category;
  selectedStockIngredientCategory.value = "";
};

const selectStockIngredientCategory = (category) => {
  selectedStockIngredientCategory.value = category;
  selectedStockProductCategory.value = "";
};

const toggleAddProductForm = () => {
  showAddProductForm.value = !showAddProductForm.value;
};

const toggleAddIngredientForm = () => {
  showAddIngredientForm.value = !showAddIngredientForm.value;
};

const addProduct = () => {
  if (newProduct.value.category && newProduct.value.name) {
    products.value[newProduct.value.category].push({
      name: newProduct.value.name,
      quantity: newProduct.value.quantity,
    });
    newProduct.value = { category: "", name: "", quantity: 0 };
    showAddProductForm.value = false;
  }
};

const addIngredient = () => {
  if (newIngredient.value.category && newIngredient.value.name) {
    ingredients.value[newIngredient.value.category].push({
      name: newIngredient.value.name,
      quantity: newIngredient.value.quantity,
    });
    newIngredient.value = { category: "", name: "", quantity: 0 };
    showAddIngredientForm.value = false;
  }
};

const editProduct = (index) => {
  const item = products.value[selectedProductCategory.value][index];
  newProduct.value = { ...item, category: selectedProductCategory.value };
  editingProductIndex.value = index;
  showEditProductForm.value = true;
};

const editIngredient = (index) => {
  const item = ingredients.value[selectedIngredientCategory.value][index];
  newIngredient.value = { ...item, category: selectedIngredientCategory.value };
  editingIngredientIndex.value = index;
  showEditIngredientForm.value = true;
};

const updateProduct = () => {
  if (editingProductIndex.value >= 0) {
    products.value[selectedProductCategory.value][editingProductIndex.value] = {
      name: newProduct.value.name,
      quantity: newProduct.value.quantity,
    };
    showEditProductForm.value = false;
    editingProductIndex.value = -1;
  }
};

const updateIngredient = () => {
  if (editingIngredientIndex.value >= 0) {
    ingredients.value[selectedIngredientCategory.value][
      editingIngredientIndex.value
    ] = {
      name: newIngredient.value.name,
      quantity: newIngredient.value.quantity,
    };
    showEditIngredientForm.value = false;
    editingIngredientIndex.value = -1;
  }
};

const deleteProduct = (index) => {
  products.value[selectedProductCategory.value].splice(index, 1);
};

const deleteIngredient = (index) => {
  ingredients.value[selectedIngredientCategory.value].splice(index, 1);
};

const toggleAddCategoryForm = (type) => {
  newCategory.value.type = type;
  showAddCategoryForm.value = !showAddCategoryForm.value;
};

const toggleDeleteCategoryForm = (type) => {
  deleteType.value = type;
  showDeleteCategoryForm.value = !showDeleteCategoryForm.value;
  selectedCategoryToDelete.value = "";
};

const addCategory = () => {
  if (newCategory.value.name && newCategory.value.type) {
    if (newCategory.value.type === "productos") {
      productCategories.value.push(newCategory.value.name);
      products.value[newCategory.value.name] = [];
    } else if (newCategory.value.type === "ingredientes") {
      ingredientCategories.value.push(newCategory.value.name);
      ingredients.value[newCategory.value.name] = [];
    }
    newCategory.value = { name: "", type: "" };
    showAddCategoryForm.value = false;
  }
};

const deleteCategory = (type, category) => {
  if (category) {
    if (type === "productos") {
      const index = productCategories.value.indexOf(category);
      if (index > -1) {
        productCategories.value.splice(index, 1);
        delete products.value[category];
      }
    } else if (type === "ingredientes") {
      const index = ingredientCategories.value.indexOf(category);
      if (index > -1) {
        ingredientCategories.value.splice(index, 1);
        delete ingredients.value[category];
      }
    }
    selectedCategoryToDelete.value = "";
    showDeleteCategoryForm.value = false;
  }
};

const generateReport = () => {
  // Generate comprehensive report data including all report types
  const report = {
    generatedAt: new Date().toLocaleString(),
    summary: {
      totalProducts: totalProducts.value,
      totalIngredients: totalIngredients.value,
      lowStockProducts: lowStockProducts.value,
      lowStockAlerts: lowStockAlerts.value.length,
    },
    productsByCategory: {},
    ingredientsByCategory: {},
    stockReport: {},
    categoriesReport: {},
    inventoryValueReport: {},
    movementReport: {},
    supplierReport: {},
    expirationReport: {},
    alertsReport: lowStockAlerts.value,
  };

  // Products by category
  for (const category in products.value) {
    report.productsByCategory[category] = {
      count: products.value[category].length,
      items: products.value[category],
      lowStockCount: products.value[category].filter(
        (item) => item.quantity < 10
      ).length,
    };
  }

  // Ingredients by category
  for (const category in ingredients.value) {
    report.ingredientsByCategory[category] = {
      count: ingredients.value[category].length,
      items: ingredients.value[category],
      lowStockCount: ingredients.value[category].filter(
        (item) => item.quantity < 10
      ).length,
    };
  }

  // Stock report - all items with quantities
  report.stockReport = {
    products: products.value,
    ingredients: ingredients.value,
  };

  // Categories report
  report.categoriesReport = {
    productCategories: productCategories.value,
    ingredientCategories: ingredientCategories.value,
    productCategoryCounts: productCategoryCounts.value,
    ingredientCategoryCounts: ingredientCategoryCounts.value,
    largestProductCategory: getLargestCategory(productCategoryCounts.value),
    largestIngredientCategory: getLargestCategory(
      ingredientCategoryCounts.value
    ),
  };

  // Inventory value report
  const productValue = Object.values(products.value).reduce(
    (total, category) => {
      return (
        total +
        category.reduce(
          (catTotal, item) => catTotal + item.quantity * (item.price || 0),
          0
        )
      );
    },
    0
  );

  const ingredientValue = Object.values(ingredients.value).reduce(
    (total, category) => {
      return (
        total +
        category.reduce(
          (catTotal, item) => catTotal + item.quantity * (item.price || 0),
          0
        )
      );
    },
    0
  );

  const totalValue = productValue + ingredientValue;

  report.inventoryValueReport = {
    title: "Reporte de Valor de Inventario",
    generatedAt: new Date().toLocaleString(),
    summary: {
      totalValue: totalValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      productValue: productValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      ingredientValue: ingredientValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
    },
    productsByCategory: {},
    ingredientsByCategory: {},
  };

  // Group products by category with values
  for (const category in products.value) {
    const categoryValue = products.value[category].reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    );
    report.inventoryValueReport.productsByCategory[category] = {
      count: products.value[category].length,
      value: categoryValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      items: products.value[category].map((item) => ({
        ...item,
        value: (item.quantity * (item.price || 0)).toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      })),
    };
  }

  // Group ingredients by category with values
  for (const category in ingredients.value) {
    const categoryValue = ingredients.value[category].reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    );
    report.inventoryValueReport.ingredientsByCategory[category] = {
      count: ingredients.value[category].length,
      value: categoryValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      items: ingredients.value[category].map((item) => ({
        ...item,
        value: (item.quantity * (item.price || 0)).toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      })),
    };
  }

  // Movement report
  report.movementReport = {
    title: "Reporte de Movimientos de Inventario",
    generatedAt: new Date().toLocaleString(),
    movements: [
      {
        date: "2024-01-15",
        type: "Entrada",
        item: "Coca Cola",
        category: "Producto",
        quantity: 10,
        reason: "Compra inicial",
      },
      {
        date: "2024-01-16",
        type: "Salida",
        item: "Empanadas",
        category: "Producto",
        quantity: 5,
        reason: "Venta",
      },
      {
        date: "2024-01-17",
        type: "Entrada",
        item: "Lechuga",
        category: "Ingrediente",
        quantity: 20,
        reason: "Reabastecimiento",
      },
      {
        date: "2024-01-18",
        type: "Salida",
        item: "Sprite",
        category: "Producto",
        quantity: 3,
        reason: "Venta",
      },
      {
        date: "2024-01-19",
        type: "Entrada",
        item: "Tomate",
        category: "Ingrediente",
        quantity: 15,
        reason: "Compra semanal",
      },
    ],
    summary: {
      totalEntries: 3,
      totalExits: 2,
      totalItems: 5,
    },
  };

  // Supplier report
  report.supplierReport = {
    title: "Reporte de Proveedores",
    generatedAt: new Date().toLocaleString(),
    suppliers: [
      {
        name: "Distribuidora ABC",
        products: ["Coca Cola", "Sprite"],
        contact: "abc@supplier.com",
        lastOrder: "2024-01-10",
      },
      {
        name: "Verduras Frescas S.A.",
        products: ["Lechuga", "Tomate"],
        contact: "frescas@supplier.com",
        lastOrder: "2024-01-12",
      },
      {
        name: "Carnes Premium",
        products: ["Pollo", "Res"],
        contact: "premium@carnes.com",
        lastOrder: "2024-01-08",
      },
    ],
    summary: {
      totalSuppliers: 3,
      activeSuppliers: 3,
    },
  };

  // Expiration report
  report.expirationReport = {
    title: "Reporte de Vencimientos",
    generatedAt: new Date().toLocaleString(),
    expiringItems: [
      {
        name: "Leche",
        category: "Ingrediente",
        quantity: 5,
        expirationDate: "2024-01-25",
        daysUntilExpiration: 5,
      },
      {
        name: "Queso",
        category: "Ingrediente",
        quantity: 3,
        expirationDate: "2024-01-28",
        daysUntilExpiration: 8,
      },
      {
        name: "Yogurt",
        category: "Producto",
        quantity: 10,
        expirationDate: "2024-01-30",
        daysUntilExpiration: 10,
      },
      {
        name: "Carne Molida",
        category: "Ingrediente",
        quantity: 2,
        expirationDate: "2024-01-22",
        daysUntilExpiration: 2,
      },
    ],
    summary: {
      criticalItems: 1,
      warningItems: 1,
      totalExpiring: 4,
    },
  };

  reportData.value = report;
  showReportModal.value = true;
};

const alertStock = () => {
  showAlertsModal.value = true;
};

const updateAlerts = () => {
  showUpdateReportsModal.value = true;
  showAlertsModal.value = false;
  updateQuantities.value = lowStockAlerts.value.map((alert) => ({
    ...alert,
    newQuantity: alert.quantity,
  }));
};

const markAlertsAsViewed = () => {
  showAlerts.value = false;
  showAlertsModal.value = false;
  console.log("Alerts marked as viewed");
};

const applyUpdates = () => {
  updateQuantities.value.forEach((item) => {
    if (item.type === "Producto") {
      // Find and update the product
      for (const category in products.value) {
        const productIndex = products.value[category].findIndex(
          (p) => p.name === item.name
        );
        if (productIndex !== -1) {
          products.value[category][productIndex].quantity = item.newQuantity;
          break;
        }
      }
    } else if (item.type === "Ingrediente") {
      // Find and update the ingredient
      for (const category in ingredients.value) {
        const ingredientIndex = ingredients.value[category].findIndex(
          (i) => i.name === item.name
        );
        if (ingredientIndex !== -1) {
          ingredients.value[category][ingredientIndex].quantity =
            item.newQuantity;
          break;
        }
      }
    }
  });
  showUpdateReportsModal.value = false;
  showAlerts.value = false; // Hide alerts since quantities have been updated
  console.log("Quantities updated successfully");
};

const exportReportData = (format) => {
  if (format === "pdf") {
    // Create PDF document
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("FACTURA DE INVENTARIO", 20, 30);
    doc.setFontSize(12);
    doc.text(`Generado: ${reportData.value.generatedAt}`, 20, 45);

    let yPosition = 60;

    // Summary
    doc.setFontSize(14);
    doc.text("RESUMEN GENERAL", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(
      `- Total Productos: ${reportData.value.summary.totalProducts}`,
      20,
      yPosition
    );
    yPosition += 8;
    doc.text(
      `- Total Ingredientes: ${reportData.value.summary.totalIngredients}`,
      20,
      yPosition
    );
    yPosition += 8;
    doc.text(
      `- Alertas Stock Bajo: ${reportData.value.summary.lowStockAlerts}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Products by Category
    doc.setFontSize(14);
    doc.text("📦 PRODUCTOS POR CATEGORÍA", 20, yPosition);
    yPosition += 10;

    const productTableData = [];
    for (const [category, data] of Object.entries(
      reportData.value.productsByCategory
    )) {
      productTableData.push([category, data.count, data.lowStockCount || 0]);
      data.items.forEach((item) => {
        productTableData.push([`  ${item.name}`, item.quantity, ""]);
      });
    }

    doc.autoTable({
      startY: yPosition,
      head: [["Categoría/Producto", "Cantidad", "Stock Bajo"]],
      body: productTableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [49, 130, 206] },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Ingredients by Category
    doc.setFontSize(14);
    doc.text("🥕 INGREDIENTES POR CATEGORÍA", 20, yPosition);
    yPosition += 10;

    const ingredientTableData = [];
    for (const [category, data] of Object.entries(
      reportData.value.ingredientsByCategory
    )) {
      ingredientTableData.push([category, data.count, data.lowStockCount || 0]);
      data.items.forEach((item) => {
        ingredientTableData.push([`  ${item.name}`, item.quantity, ""]);
      });
    }

    doc.autoTable({
      startY: yPosition,
      head: [["Categoría/Ingrediente", "Cantidad", "Stock Bajo"]],
      body: ingredientTableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [56, 161, 105] },
    });

    yPosition = doc.lastAutoTable.finalY + 15;

    // Inventory Value
    doc.setFontSize(14);
    doc.text("💰 VALOR DEL INVENTARIO", 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(
      `Valor Total: ${reportData.value.inventoryValueReport.summary.totalValue}`,
      20,
      yPosition
    );
    yPosition += 8;
    doc.text(
      `Valor de Productos: ${reportData.value.inventoryValueReport.summary.productValue}`,
      20,
      yPosition
    );
    yPosition += 8;
    doc.text(
      `Valor de Ingredientes: ${reportData.value.inventoryValueReport.summary.ingredientValue}`,
      20,
      yPosition
    );

    // Movement Report
    yPosition += 15;
    doc.setFontSize(14);
    doc.text("📈 MOVIMIENTOS DE INVENTARIO", 20, yPosition);
    yPosition += 10;

    const movementTableData = reportData.value.movementReport.movements.map(
      (movement) => [
        movement.date,
        movement.type,
        movement.item,
        movement.category,
        movement.quantity,
        movement.reason,
      ]
    );

    doc.autoTable({
      startY: yPosition,
      head: [["Fecha", "Tipo", "Item", "Categoría", "Cantidad", "Razón"]],
      body: movementTableData,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [102, 126, 234] },
    });

    // Save PDF
    doc.save(
      `factura_inventario_${new Date().toISOString().split("T")[0]}.pdf`
    );
  } else {
    // Export as TXT (existing code)
    // Create a comprehensive formatted text report
    let reportText = `FACTURA DE INVENTARIO\n`;
    reportText += `Generado: ${reportData.value.generatedAt}\n\n`;

    reportText += `RESUMEN GENERAL:\n`;
    reportText += `- Total Productos: ${reportData.value.summary.totalProducts}\n`;
    reportText += `- Total Ingredientes: ${reportData.value.summary.totalIngredients}\n`;
    reportText += `- Alertas Stock Bajo: ${reportData.value.summary.lowStockAlerts}\n\n`;

    // Productos por Categoría
    reportText += `📦 PRODUCTOS POR CATEGORÍA:\n`;
    for (const [category, data] of Object.entries(
      reportData.value.productsByCategory
    )) {
      reportText += `\n${category.toUpperCase()} (${data.count} productos`;
      if (data.lowStockCount > 0) {
        reportText += `, ${data.lowStockCount} bajo stock`;
      }
      reportText += `):\n`;
      data.items.forEach((item) => {
        reportText += `  - ${item.name}: ${item.quantity} unidades\n`;
      });
    }

    // Ingredientes por Categoría
    reportText += `\n🥕 INGREDIENTES POR CATEGORÍA:\n`;
    for (const [category, data] of Object.entries(
      reportData.value.ingredientsByCategory
    )) {
      reportText += `\n${category.toUpperCase()} (${data.count} ingredientes`;
      if (data.lowStockCount > 0) {
        reportText += `, ${data.lowStockCount} bajo stock`;
      }
      reportText += `):\n`;
      data.items.forEach((item) => {
        reportText += `  - ${item.name}: ${item.quantity} unidades\n`;
      });
    }

    // Stock Report
    reportText += `\n📊 REPORTE DE STOCK:\n`;
    reportText += `\nPRODUCTOS:\n`;
    for (const [category, items] of Object.entries(
      reportData.value.stockReport.products
    )) {
      reportText += `\n${category}:\n`;
      items.forEach((item) => {
        reportText += `  - ${item.name}: ${item.quantity} unidades\n`;
      });
    }
    reportText += `\nINGREDIENTES:\n`;
    for (const [category, items] of Object.entries(
      reportData.value.stockReport.ingredients
    )) {
      reportText += `\n${category}:\n`;
      items.forEach((item) => {
        reportText += `  - ${item.name}: ${item.quantity} unidades\n`;
      });
    }

    // Categories Report
    reportText += `\n📂 REPORTE DE CATEGORÍAS:\n`;
    reportText += `\nCategorías de Productos:\n`;
    for (const [category, count] of Object.entries(
      reportData.value.categoriesReport.productCategoryCounts
    )) {
      reportText += `  - ${category}: ${count} productos\n`;
    }
    reportText += `\nCategorías de Ingredientes:\n`;
    for (const [category, count] of Object.entries(
      reportData.value.categoriesReport.ingredientCategoryCounts
    )) {
      reportText += `  - ${category}: ${count} ingredientes\n`;
    }
    reportText += `\nCategoría más grande (Productos): ${reportData.value.categoriesReport.largestProductCategory}\n`;
    reportText += `Categoría más grande (Ingredientes): ${reportData.value.categoriesReport.largestIngredientCategory}\n`;

    // Inventory Value Report
    reportText += `\n💰 VALOR DEL INVENTARIO:\n`;
    reportText += `Valor Total: ${reportData.value.inventoryValueReport.summary.totalValue}\n`;
    reportText += `Valor de Productos: ${reportData.value.inventoryValueReport.summary.productValue}\n`;
    reportText += `Valor de Ingredientes: ${reportData.value.inventoryValueReport.summary.ingredientValue}\n\n`;
    reportText += `Valor por Categoría de Productos:\n`;
    for (const [category, data] of Object.entries(
      reportData.value.inventoryValueReport.productsByCategory
    )) {
      reportText += `  - ${category}: ${data.value}\n`;
    }
    reportText += `\nValor por Categoría de Ingredientes:\n`;
    for (const [category, data] of Object.entries(
      reportData.value.inventoryValueReport.ingredientsByCategory
    )) {
      reportText += `  - ${category}: ${data.value}\n`;
    }

    // Movement Report
    reportText += `\n📈 MOVIMIENTOS DE INVENTARIO:\n`;
    reportText += `Total Entradas: ${reportData.value.movementReport.summary.totalEntries}\n`;
    reportText += `Total Salidas: ${reportData.value.movementReport.summary.totalExits}\n`;
    reportText += `Total Movimientos: ${reportData.value.movementReport.summary.totalItems}\n\n`;
    reportText += `Historial de Movimientos:\n`;
    reportData.value.movementReport.movements.forEach((movement, index) => {
      reportText += `${index + 1}. ${movement.date} - ${movement.type} - ${
        movement.item
      } (${movement.category}) - Cantidad: ${movement.quantity} - Razón: ${
        movement.reason
      }\n`;
    });

    // Supplier Report
    reportText += `\n🏢 PROVEEDORES:\n`;
    reportText += `Total Proveedores: ${reportData.value.supplierReport.summary.totalSuppliers}\n`;
    reportText += `Proveedores Activos: ${reportData.value.supplierReport.summary.activeSuppliers}\n\n`;
    reportText += `Lista de Proveedores:\n`;
    reportData.value.supplierReport.suppliers.forEach((supplier, index) => {
      reportText += `${index + 1}. ${supplier.name}\n`;
      reportText += `   Contacto: ${supplier.contact}\n`;
      reportText += `   Último pedido: ${supplier.lastOrder}\n`;
      reportText += `   Productos: ${supplier.products.join(", ")}\n\n`;
    });

    // Expiration Report
    reportText += `\n⏰ VENCIMIENTOS:\n`;
    reportText += `Items Críticos (≤3 días): ${reportData.value.expirationReport.summary.criticalItems}\n`;
    reportText += `Items de Advertencia (≤7 días): ${reportData.value.expirationReport.summary.warningItems}\n`;
    reportText += `Total Próximos a Vencer: ${reportData.value.expirationReport.summary.totalExpiring}\n\n`;
    reportText += `Items Próximos a Vencer:\n`;
    reportData.value.expirationReport.expiringItems.forEach((item, index) => {
      reportText += `${index + 1}. ${item.name} (${item.category})\n`;
      reportText += `   Cantidad: ${item.quantity} unidades\n`;
      reportText += `   Fecha de vencimiento: ${item.expirationDate}\n`;
      reportText += `   Días hasta vencimiento: ${item.daysUntilExpiration}\n\n`;
    });

    // Alerts Report
    reportText += `\n⚠️ ALERTAS DE STOCK BAJO:\n`;
    reportText += `Total Alertas: ${reportData.value.alertsReport.length}\n\n`;
    reportText += `Items con Stock Bajo:\n`;
    reportData.value.alertsReport.forEach((alert, index) => {
      reportText += `${index + 1}. ${alert.name} (${alert.type}): ${
        alert.quantity
      } unidades\n`;
    });

    // Create and download the file
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `factura_inventario_${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  console.log("Factura exported successfully");
};

const editStockProduct = (index) => {
  const item = products.value[selectedStockProductCategory.value][index];
  editStockItem.value = { ...item };
  editingStockIndex.value = index;
  editingStockType.value = "product";
  showEditStockForm.value = true;
};

const editStockIngredient = (index) => {
  const item = ingredients.value[selectedStockIngredientCategory.value][index];
  editStockItem.value = { ...item };
  editingStockIndex.value = index;
  editingStockType.value = "ingredient";
  showEditStockForm.value = true;
};

const updateStock = () => {
  if (editingStockType.value === "product" && editingStockIndex.value >= 0) {
    products.value[selectedStockProductCategory.value][
      editingStockIndex.value
    ].quantity = editStockItem.value.quantity;
  } else if (
    editingStockType.value === "ingredient" &&
    editingStockIndex.value >= 0
  ) {
    ingredients.value[selectedStockIngredientCategory.value][
      editingStockIndex.value
    ].quantity = editStockItem.value.quantity;
  }
  showEditStockForm.value = false;
  editingStockIndex.value = -1;
  editingStockType.value = "";
};

const showProductsReport = () => {
  showProductsModal.value = true;
};

const showIngredientsReport = () => {
  showIngredientsModal.value = true;
};

const showLowStockReport = () => {
  showLowStockModal.value = true;
};

const showCategoriesReport = () => {
  showCategoriesModal.value = true;
};

const getLargestCategory = (counts) => {
  let largest = "";
  let maxCount = 0;
  for (const [category, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      largest = category;
    }
  }
  return largest;
};

const showInventoryValueReport = () => {
  // Calculate inventory value based on products and ingredients
  const productValue = Object.values(products.value).reduce(
    (total, category) => {
      return (
        total +
        category.reduce(
          (catTotal, item) => catTotal + item.quantity * (item.price || 0),
          0
        )
      );
    },
    0
  );

  const ingredientValue = Object.values(ingredients.value).reduce(
    (total, category) => {
      return (
        total +
        category.reduce(
          (catTotal, item) => catTotal + item.quantity * (item.price || 0),
          0
        )
      );
    },
    0
  );

  const totalValue = productValue + ingredientValue;

  // Create modal content for inventory value report
  const reportContent = {
    title: "Reporte de Valor de Inventario",
    generatedAt: new Date().toLocaleString(),
    summary: {
      totalValue: totalValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      productValue: productValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      ingredientValue: ingredientValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
    },
    productsByCategory: {},
    ingredientsByCategory: {},
  };

  // Group products by category with values
  for (const category in products.value) {
    const categoryValue = products.value[category].reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    );
    reportContent.productsByCategory[category] = {
      count: products.value[category].length,
      value: categoryValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      items: products.value[category].map((item) => ({
        ...item,
        value: (item.quantity * (item.price || 0)).toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      })),
    };
  }

  // Group ingredients by category with values
  for (const category in ingredients.value) {
    const categoryValue = ingredients.value[category].reduce(
      (total, item) => total + item.quantity * (item.price || 0),
      0
    );
    reportContent.ingredientsByCategory[category] = {
      count: ingredients.value[category].length,
      value: categoryValue.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      }),
      items: ingredients.value[category].map((item) => ({
        ...item,
        value: (item.quantity * (item.price || 0)).toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      })),
    };
  }

  // Show modal with inventory value report
  showInventoryValueModal.value = true;
  inventoryValueReport.value = reportContent;
};

const showMovementReport = () => {
  // Simulate movement data (in a real app, this would come from a database)
  const movements = [
    {
      date: "2024-01-15",
      type: "Entrada",
      item: "Coca Cola",
      category: "Producto",
      quantity: 10,
      reason: "Compra inicial",
    },
    {
      date: "2024-01-16",
      type: "Salida",
      item: "Empanadas",
      category: "Producto",
      quantity: 5,
      reason: "Venta",
    },
    {
      date: "2024-01-17",
      type: "Entrada",
      item: "Lechuga",
      category: "Ingrediente",
      quantity: 20,
      reason: "Reabastecimiento",
    },
    {
      date: "2024-01-18",
      type: "Salida",
      item: "Sprite",
      category: "Producto",
      quantity: 3,
      reason: "Venta",
    },
    {
      date: "2024-01-19",
      type: "Entrada",
      item: "Tomate",
      category: "Ingrediente",
      quantity: 15,
      reason: "Compra semanal",
    },
  ];

  const reportContent = {
    title: "Reporte de Movimientos de Inventario",
    generatedAt: new Date().toLocaleString(),
    movements: movements,
    summary: {
      totalEntries: movements.filter((m) => m.type === "Entrada").length,
      totalExits: movements.filter((m) => m.type === "Salida").length,
      totalItems: movements.length,
    },
  };

  showMovementModal.value = true;
  movementReport.value = reportContent;
};

const showSupplierReport = () => {
  // Simulate supplier data
  const suppliers = [
    {
      name: "Distribuidora ABC",
      products: ["Coca Cola", "Sprite"],
      contact: "abc@supplier.com",
      lastOrder: "2024-01-10",
    },
    {
      name: "Verduras Frescas S.A.",
      products: ["Lechuga", "Tomate"],
      contact: "frescas@supplier.com",
      lastOrder: "2024-01-12",
    },
    {
      name: "Carnes Premium",
      products: ["Pollo", "Res"],
      contact: "premium@carnes.com",
      lastOrder: "2024-01-08",
    },
  ];

  const reportContent = {
    title: "Reporte de Proveedores",
    generatedAt: new Date().toLocaleString(),
    suppliers: suppliers,
    summary: {
      totalSuppliers: suppliers.length,
      activeSuppliers: suppliers.filter(
        (s) =>
          new Date(s.lastOrder) >
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length,
    },
  };

  showSupplierModal.value = true;
  supplierReport.value = reportContent;
};

const showExpirationReport = () => {
  // Simulate expiration data
  const expiringItems = [
    {
      name: "Leche",
      category: "Ingrediente",
      quantity: 5,
      expirationDate: "2024-01-25",
      daysUntilExpiration: 5,
    },
    {
      name: "Queso",
      category: "Ingrediente",
      quantity: 3,
      expirationDate: "2024-01-28",
      daysUntilExpiration: 8,
    },
    {
      name: "Yogurt",
      category: "Producto",
      quantity: 10,
      expirationDate: "2024-01-30",
      daysUntilExpiration: 10,
    },
    {
      name: "Carne Molida",
      category: "Ingrediente",
      quantity: 2,
      expirationDate: "2024-01-22",
      daysUntilExpiration: 2,
    },
  ];

  const reportContent = {
    title: "Reporte de Vencimientos",
    generatedAt: new Date().toLocaleString(),
    expiringItems: expiringItems,
    summary: {
      criticalItems: expiringItems.filter(
        (item) => item.daysUntilExpiration <= 3
      ).length,
      warningItems: expiringItems.filter(
        (item) => item.daysUntilExpiration <= 7
      ).length,
      totalExpiring: expiringItems.length,
    },
  };

  showExpirationModal.value = true;
  expirationReport.value = reportContent;
};

const exportInventoryValueReport = () => {
  let reportText = `${inventoryValueReport.value.title}\n`;
  reportText += `Generado: ${inventoryValueReport.value.generatedAt}\n\n`;

  reportText += `RESUMEN DE VALOR:\n`;
  reportText += `- Valor Total: ${inventoryValueReport.value.summary.totalValue}\n`;
  reportText += `- Valor de Productos: ${inventoryValueReport.value.summary.productValue}\n`;
  reportText += `- Valor de Ingredientes: ${inventoryValueReport.value.summary.ingredientValue}\n\n`;

  reportText += `VALOR POR CATEGORÍA DE PRODUCTOS:\n`;
  for (const [category, data] of Object.entries(
    inventoryValueReport.value.productsByCategory
  )) {
    reportText += `- ${category}: ${data.count} productos - ${data.value}\n`;
  }

  reportText += `\nVALOR POR CATEGORÍA DE INGREDIENTES:\n`;
  for (const [category, data] of Object.entries(
    inventoryValueReport.value.ingredientsByCategory
  )) {
    reportText += `- ${category}: ${data.count} ingredientes - ${data.value}\n`;
  }

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_valor_inventario_${
    new Date().toISOString().split("T")[0]
  }.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportMovementReport = () => {
  let reportText = `${movementReport.value.title}\n`;
  reportText += `Generado: ${movementReport.value.generatedAt}\n\n`;

  reportText += `RESUMEN DE MOVIMIENTOS:\n`;
  reportText += `- Total Entradas: ${movementReport.value.summary.totalEntries}\n`;
  reportText += `- Total Salidas: ${movementReport.value.summary.totalExits}\n`;
  reportText += `- Total Movimientos: ${movementReport.value.summary.totalItems}\n\n`;

  reportText += `HISTORIAL DE MOVIMIENTOS:\n`;
  movementReport.value.movements.forEach((movement, index) => {
    reportText += `${index + 1}. ${movement.date} - ${movement.type} - ${
      movement.item
    } (${movement.category}) - Cantidad: ${movement.quantity} - Razón: ${
      movement.reason
    }\n`;
  });

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_movimientos_${
    new Date().toISOString().split("T")[0]
  }.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportSupplierReport = () => {
  let reportText = `${supplierReport.value.title}\n`;
  reportText += `Generado: ${supplierReport.value.generatedAt}\n\n`;

  reportText += `RESUMEN DE PROVEEDORES:\n`;
  reportText += `- Total Proveedores: ${supplierReport.value.summary.totalSuppliers}\n`;
  reportText += `- Proveedores Activos: ${supplierReport.value.summary.activeSuppliers}\n\n`;

  reportText += `LISTA DE PROVEEDORES:\n`;
  supplierReport.value.suppliers.forEach((supplier, index) => {
    reportText += `${index + 1}. ${supplier.name}\n`;
    reportText += `   Contacto: ${supplier.contact}\n`;
    reportText += `   Último pedido: ${supplier.lastOrder}\n`;
    reportText += `   Productos: ${supplier.products.join(", ")}\n\n`;
  });

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_proveedores_${
    new Date().toISOString().split("T")[0]
  }.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportExpirationReport = () => {
  let reportText = `${expirationReport.value.title}\n`;
  reportText += `Generado: ${expirationReport.value.generatedAt}\n\n`;

  reportText += `RESUMEN DE VENCIMIENTOS:\n`;
  reportText += `- Items Críticos (≤3 días): ${expirationReport.value.summary.criticalItems}\n`;
  reportText += `- Items de Advertencia (≤7 días): ${expirationReport.value.summary.warningItems}\n`;
  reportText += `- Total Próximos a Vencer: ${expirationReport.value.summary.totalExpiring}\n\n`;

  reportText += `ITEMS PRÓXIMOS A VENCER:\n`;
  expirationReport.value.expiringItems.forEach((item, index) => {
    reportText += `${index + 1}. ${item.name} (${item.category})\n`;
    reportText += `   Cantidad: ${item.quantity} unidades\n`;
    reportText += `   Fecha de vencimiento: ${item.expirationDate}\n`;
    reportText += `   Días hasta vencimiento: ${item.daysUntilExpiration}\n\n`;
  });

  const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte_vencimientos_${
    new Date().toISOString().split("T")[0]
  }.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const exportReport = () => {
  generateReport();
  exportReportData("pdf");
};
</script>

<style scoped>
.inventario-container {
  position: relative;
  padding-top: 100px; /* Ajuste para la navbar fija */
  overflow: hidden;
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
  top: 48px; /* Adjust based on navbar height */
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

.productos-page {
  display: flex;
  position: fixed;
  top: 100px; /* Adjust based on navbar height */
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
  background: #edf2f7;
  border: 1px solid #cbd5e0;
  color: #4a5568;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: all 0.2s ease;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.category-btn:hover {
  background: #e2e8f0;
}

.category-btn.active {
  background: #3182ce;
  color: white;
  border-color: #2c5282;
}

.right-side {
  flex: 1;
  padding: 1rem;
  background: #ffffff;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.add-btn {
  background: #38a169;
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

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.item-name {
  flex: 1;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.edit-btn {
  background: #3182ce;
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-btn:hover {
  background: #2c5282;
}

.delete-btn {
  background: #ce3131;
  height: 28px;
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-btn:hover {
  background: #c53030;
}

.quantity-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.quantity-table th,
.quantity-table td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.quantity-table th {
  background: #f7fafc;
  font-weight: bold;
  color: #2d3748;
}

.report-content {
  padding: 1rem;
}

.report-header {
  text-align: center;
  margin-bottom: 2rem;
}

.report-header h2 {
  margin-bottom: 0.5rem;
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
}

.report-description {
  color: #718096;
  font-size: 1rem;
  line-height: 1.5;
}

.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card.warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #d69e2e;
  box-shadow: 0 4px 12px rgba(252, 182, 159, 0.3);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
}

.report-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.generate-report-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.generate-report-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: #2d3748;
}

.modal-content select,
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.modal-buttons button:first-child {
  background: #3182ce;
  color: white;
}

.modal-buttons button:first-child:hover {
  background: #2c5282;
}

.modal-buttons button:last-child {
  background: #e53e3e;
  color: white;
}

.modal-buttons button:last-child:hover {
  background: #c53030;
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
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}
.add-category-btn:hover {
  background-color: #239e0ec6;
}
.delete-category-btn {
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  padding: 0.35rem 0.5rem;
  font-size: 0.875rem;
  white-space: nowrap;
}
.delete-category-btn:hover {
  background-color: #c53030c6;
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alerts-section {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fef5e7;
  border: 1px solid #f6e05e;
  border-radius: 4px;
}

.alerts-section h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #d69e2e;
}

.alerts-section ul {
  list-style: none;
  padding: 0;
}

.alerts-section li {
  padding: 0.25rem 0;
  color: #744210;
}

.alert-notification {
  background: #e53e3e;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.alert-notification:hover {
  background: #c53030;
}

.alerts-display {
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef5e7 0%, #fff8e1 100%);
  border: 2px solid #f6e05e;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(246, 224, 94, 0.2);
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f6e05e;
}

.alerts-header h3 {
  margin: 0;
  color: #d69e2e;
  font-size: 1.25rem;
  font-weight: 600;
}

.alerts-count {
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(229, 62, 62, 0.3);
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.alert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.alert-card.low-stock {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.alert-card.medium-stock {
  border-left: 4px solid #dd6b20;
  background: linear-gradient(90deg, #fef5e7 0%, white 20%);
}

.alert-info {
  flex: 1;
}

.alert-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.alert-type {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.alert-quantity {
  text-align: center;
  margin-right: 1rem;
}

.quantity-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.quantity-unit {
  font-size: 0.75rem;
  color: #a0aec0;
  display: block;
  margin-top: 0.125rem;
}

.alert-status {
  text-align: right;
}

.status-critical {
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-warning {
  background: #dd6b20;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stock-categories {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-section {
  margin-bottom: 1rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.large-modal {
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.update-list {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.update-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.update-name {
  flex: 1;
  font-weight: bold;
}

.update-input {
  width: 80px;
  padding: 0.25rem;
  border: 1px solid #cbd5e0;
  border-radius: 4px;
  text-align: center;
}

.stock-welcome {
  text-align: center;
  padding: 2rem;
  color: #4a5568;
}

.stock-welcome h2 {
  margin-bottom: 1rem;
  color: #2d3748;
}

.stock-welcome p {
  font-size: 1rem;
  line-height: 1.5;
}

.alerts-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
}

.alerts-modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.alerts-modal-icon {
  background: linear-gradient(135deg, #fef5e7 0%, #fff8e1 100%);
  border: 2px solid #f6e05e;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d69e2e;
  font-size: 1.5rem;
}

.alerts-modal-title h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 600;
}

.alerts-modal-subtitle {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
}

.alerts-modal-body {
  margin-bottom: 2rem;
}

.alerts-modal-description {
  margin: 0 0 1.5rem 0;
  color: #4a5568;
  font-size: 1rem;
  line-height: 1.5;
}

.alerts-modal-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f7fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alert-option:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-icon {
  background: #3182ce;
  color: white;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.option-content h4 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.1rem;
  font-weight: 600;
}

.option-content p {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
  line-height: 1.4;
}

.alerts-modal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.report-modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 800px;
  max-width: 95%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
}

.report-modal-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.report-modal-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.report-modal-title h3 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
  font-size: 1.75rem;
  font-weight: 700;
}

.report-modal-subtitle {
  margin: 0;
  color: #718096;
  font-size: 0.875rem;
}

.report-modal-body {
  margin-bottom: 2rem;
}

.report-summary {
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
  transition: transform 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
}

.summary-card.warning {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  color: #d69e2e;
  box-shadow: 0 4px 12px rgba(252, 182, 159, 0.3);
}

.summary-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.summary-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.summary-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
  font-weight: 500;
}

.report-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.report-section {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.report-section h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
  font-size: 1.25rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.5rem;
}

.category-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.category-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1rem;
}

.category-count {
  font-size: 0.875rem;
  color: #718096;
}

.category-stats {
  text-align: right;
}

.low-stock-count {
  background: #fed7d7;
  color: #e53e3e;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.low-stock-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.low-stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.low-stock-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.low-stock-item.critical {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.item-type {
  font-size: 0.75rem;
  color: #718096;
  font-weight: 500;
}

.item-quantity {
  text-align: right;
}

.quantity {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.unit {
  font-size: 0.75rem;
  color: #a0aec0;
}

.report-modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
}

.export-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.close-btn {
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-section-modal {
  margin-bottom: 1.5rem;
}

.category-title-modal {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.item-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.item-card.low-stock {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.item-quantity {
  font-size: 0.875rem;
  color: #718096;
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.low-stock-modal-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-card-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.alert-card-modal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.alert-card-modal.critical {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.alert-card-modal.warning {
  border-left: 4px solid #dd6b20;
  background: linear-gradient(90deg, #fef5e7 0%, white 20%);
}

.alert-info-modal {
  flex: 1;
}

.alert-name-modal {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.alert-type-modal {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.alert-quantity-modal {
  text-align: center;
  margin-right: 1rem;
}

.quantity-value-modal {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.quantity-unit-modal {
  font-size: 0.75rem;
  color: #a0aec0;
  display: block;
  margin-top: 0.125rem;
}

.alert-status-modal {
  text-align: right;
}

.status-critical-modal {
  background: #e53e3e;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-warning-modal {
  background: #dd6b20;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.update-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.update-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.stats-overview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.stat-value {
  font-weight: 700;
  color: #3182ce;
  font-size: 1rem;
}

/* Styles for new report modals */
.category-value {
  font-weight: 600;
  color: #38a169;
  font-size: 0.875rem;
}

.movements-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.movement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.movement-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.movement-item.entry {
  border-left: 4px solid #38a169;
  background: linear-gradient(90deg, #f0fff4 0%, white 20%);
}

.movement-item.exit {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.movement-info {
  flex: 1;
}

.movement-date {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.movement-details {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.movement-item-name {
  font-weight: 500;
  color: #4a5568;
}

.movement-category {
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
}

.movement-quantity {
  text-align: right;
}

.quantity-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quantity-badge.entry {
  background: #38a169;
  color: white;
}

.quantity-badge.exit {
  background: #e53e3e;
  color: white;
}

.movement-reason {
  text-align: right;
  max-width: 150px;
}

.reason-text {
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
}

.suppliers-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.supplier-item {
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.supplier-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.supplier-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.supplier-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 1.1rem;
}

.supplier-contact {
  font-size: 0.875rem;
  color: #718096;
}

.supplier-products {
  margin-bottom: 1rem;
}

.products-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.product-tag {
  background: #edf2f7;
  color: #4a5568;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.supplier-last-order {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.last-order-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
}

.last-order-date {
  font-size: 0.875rem;
  color: #38a169;
  font-weight: 500;
}

.expiring-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expiring-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.expiring-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.expiring-item.critical {
  border-left: 4px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, white 20%);
}

.expiring-item.warning {
  border-left: 4px solid #dd6b20;
  background: linear-gradient(90deg, #fef5e7 0%, white 20%);
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.item-category {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.item-quantity {
  text-align: center;
  margin-right: 1rem;
}

.quantity {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
}

.unit {
  font-size: 0.75rem;
  color: #a0aec0;
}

.expiration-info {
  text-align: right;
}

.expiration-date {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.days-remaining {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.days-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.days-badge.critical {
  background: #e53e3e;
  color: white;
}

.days-badge.warning {
  background: #dd6b20;
  color: white;
}

.stock-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stock-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stock-section h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.stock-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stock-category {
  margin-bottom: 1rem;
}

.stock-category h6 {
  margin: 0 0 0.5rem 0;
  color: #4a5568;
  font-size: 0.9rem;
  font-weight: 600;
}

.stock-items-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stock-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.stock-item.low-stock {
  border-left: 3px solid #e53e3e;
  background: linear-gradient(90deg, #fef2f2 0%, #f8fafc 20%);
}

.stock-item-name {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.85rem;
}

.stock-item-quantity {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 500;
}

.categories-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categories-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.categories-section h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.category-stat .category-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.category-stat .category-count {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

.largest-category {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #edf2f7;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #4a5568;
}

.value-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.value-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.value-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.value-item .value-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.value-item .value-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: #38a169;
}

.value-breakdown {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.value-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.value-section h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.value-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.value-category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.value-category-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
}

.value-category-amount {
  font-size: 0.85rem;
  color: #38a169;
  font-weight: 600;
}

.movements-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movements-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.movement-stat {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.movement-stat .stat-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.movement-stat .stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3182ce;
}

.movements-list {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.movements-list h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.movements-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.suppliers-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.suppliers-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.supplier-stat {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.supplier-stat .stat-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.supplier-stat .stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3182ce;
}

.suppliers-list {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.suppliers-list h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.suppliers-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expirations-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.expirations-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.expiration-stat {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.expiration-stat .stat-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.expiration-stat .stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #3182ce;
}

.expiring-items-list {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.expiring-items-list h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.expiring-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alerts-report-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alerts-summary {
  display: flex;
  justify-content: center;
}

.alert-stat {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
  min-width: 150px;
}

.alert-stat .stat-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.alert-stat .stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #e53e3e;
}

.alerts-list {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.alerts-list h5 {
  margin: 0 0 0.75rem 0;
  color: #2d3748;
  font-size: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #3182ce;
  padding-bottom: 0.25rem;
}

.alerts-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>

ñ
