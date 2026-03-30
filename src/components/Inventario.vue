<template>
  <div class="inventario-container">
    <!-- Modern Inventory Navbar -->
    <nav class="inventory-navbar">
      <div class="navbar-tabs">
        <button 
          v-for="tab in ['productos', 'ingredientes', 'stock', 'reportes']" 
          :key="tab"
          class="tab-btn"
          :class="{ active: currentSection === tab }"
          @click="currentSection = tab"
        >
          {{ tab.toUpperCase() }}
        </button>
      </div>
    </nav>

    <!-- Header Section with Actions (Example for Productos) -->
    <header class="inventory-header" v-if="currentSection === 'productos'">
      <div class="header-content">
        <h1 class="header-title">Categorías de Productos</h1>
        <div class="header-actions">
          <button @click="toggleAddCategoryForm('productos')" class="btn-action-green">
            <i class="fas fa-plus-circle"></i> Agregar Categoría
          </button>
          <button @click="toggleDeleteCategoryForm('productos')" class="btn-action-red">
            <i class="fas fa-trash-alt"></i> Eliminar Categoría
          </button>
        </div>
        <div class="header-actions-right">
          <button @click="toggleAddProductForm" class="btn-action-blue">
            <i class="fas fa-file-invoice"></i> Agregar Producto
          </button>
        </div>
      </div>
    </header>

    <!-- Header Section for Ingredientes -->
    <header class="inventory-header" v-if="currentSection === 'ingredientes'">
      <div class="header-content">
        <h1 class="header-title">Categorías de Ingredientes</h1>
        <div class="header-actions">
          <button @click="toggleAddCategoryForm('ingredientes')" class="btn-action-green">
            <i class="fas fa-plus-circle"></i> Agregar Categoría
          </button>
          <button @click="toggleDeleteCategoryForm('ingredientes')" class="btn-action-red">
            <i class="fas fa-trash-alt"></i> Eliminar Categoría
          </button>
        </div>
        <div class="header-actions-right">
          <button @click="toggleAddIngredientForm" class="btn-action-blue">
            <i class="fas fa-carrot"></i> Agregar Ingrediente
          </button>
        </div>
      </div>
    </header>

    <!-- Header Section for Stock -->
    <header class="inventory-header" v-if="currentSection === 'stock'">
      <div class="header-content">
        <h1 class="header-title">Gestión de Stock</h1>
      </div>
    </header>

    <!-- Header Section for Reportes -->
    <header class="inventory-header" v-if="currentSection === 'reportes'">
      <div class="header-content">
        <h1 class="header-title">Reportes e Inteligencia</h1>
        <div class="header-actions">
          <button @click="generateReport" class="btn-action-blue">
            <i class="fas fa-chart-bar"></i> Generar Reporte General
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Layout (Productos) -->
    <div v-if="currentSection === 'productos'" class="inventory-main-content animate-fade-in">
      <aside class="inventory-sidebar">
        <div class="sidebar-nav">
          <button 
            v-for="cat in productCategories" 
            :key="cat"
            class="sidebar-nav-item"
            :class="{ active: selectedProductCategory === cat }"
            @click="selectProductCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </aside>

      <section class="inventory-view-area">
        <div v-if="!selectedProductCategory" class="empty-state-placeholder">
          <div class="empty-placeholder-content">
            <div class="placeholder-icon">
              <i class="fas fa-box-open"></i>
            </div>
            <h2>Seleccione una categoría para gestionar sus productos</h2>
            <p>Espacio de trabajo optimizado para Epicure Pro</p>
          </div>
        </div>
        <div v-else class="item-list">
          <div class="view-header">
            <h2>{{ selectedProductCategory }}</h2>
          </div>
          <div class="items-grid">
            <div
              v-for="(item, index) in products[selectedProductCategory]"
              :key="item.name"
              class="item-card-modern"
            >
              <div class="item-card-inner">
                <span class="item-name">{{ item.name }}</span>
                <div class="item-actions">
                  <button @click="editProduct(index)" class="btn-mini-edit"><i class="fas fa-edit"></i></button>
                  <button @click="deleteProduct(index)" class="btn-mini-delete"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Similar Layout for Ingredientes -->
    <div v-else-if="currentSection === 'ingredientes'" class="inventory-main-content animate-fade-in">
      <aside class="inventory-sidebar">
        <div class="sidebar-nav">
          <button 
            v-for="cat in ingredientCategories" 
            :key="cat"
            class="sidebar-nav-item"
            :class="{ active: selectedIngredientCategory === cat }"
            @click="selectIngredientCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </aside>

      <section class="inventory-view-area">
        <div v-if="!selectedIngredientCategory" class="empty-state-placeholder">
          <div class="empty-placeholder-content">
            <div class="placeholder-icon">
              <i class="fas fa-leaf"></i>
            </div>
            <h2>Seleccione una categoría para gestionar sus ingredientes</h2>
            <p>Espacio de trabajo optimizado para Epicure Pro</p>
          </div>
        </div>
        <div v-else class="item-list">
          <div class="view-header">
            <h2>{{ selectedIngredientCategory }}</h2>
          </div>
          <div class="items-grid">
            <div
              v-for="(item, index) in ingredients[selectedIngredientCategory]"
              :key="item.name"
              class="item-card-modern"
            >
              <div class="item-card-inner">
                <span class="item-name">{{ item.name }}</span>
                <div class="item-actions">
                  <button @click="editIngredient(index)" class="btn-mini-edit"><i class="fas fa-edit"></i></button>
                  <button @click="deleteIngredient(index)" class="btn-mini-delete"><i class="fas fa-trash"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Contenido de la sección de stock -->
    <div v-else-if="currentSection === 'stock'" class="inventory-main-content animate-fade-in">
      <aside class="inventory-sidebar">
        <div class="sidebar-nav">
          <div class="nav-group">
            <h3 class="nav-group-title">PRODUCTOS</h3>
            <button 
              v-for="cat in productCategories" 
              :key="cat"
              class="sidebar-nav-item"
              :class="{ active: selectedStockProductCategory === cat }"
              @click="selectStockProductCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
          <div class="nav-group" style="margin-top: 20px;">
            <h3 class="nav-group-title">INGREDIENTES</h3>
            <button 
              v-for="cat in ingredientCategories" 
              :key="cat"
              class="sidebar-nav-item"
              :class="{ active: selectedStockIngredientCategory === cat }"
              @click="selectStockIngredientCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
        </div>
      </aside>

      <section class="inventory-view-area">
        <div v-if="!selectedStockProductCategory && !selectedStockIngredientCategory" class="empty-state-placeholder">
          <div class="empty-placeholder-content">
            <div class="placeholder-icon">
              <i class="fas fa-layer-group"></i>
            </div>
            <h2>Seleccione una categoría para ver el stock</h2>
          </div>
        </div>
        <div v-else class="item-list">
          <div class="view-header">
            <h2>Stock: {{ selectedStockProductCategory || selectedStockIngredientCategory }}</h2>
          </div>
          <table class="quantity-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Stock Actual</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in (selectedStockProductCategory ? products[selectedStockProductCategory] : ingredients[selectedStockIngredientCategory])" :key="item.name">
                <td>{{ item.name }}</td>
                <td><span class="quantity-badge-modern">{{ item.quantity }} units</span></td>
                <td>
                  <button v-if="selectedStockProductCategory" @click="editStockProduct(index)" class="btn-mini-edit"><i class="fas fa-edit"></i></button>
                  <button v-else @click="editStockIngredient(index)" class="btn-mini-edit"><i class="fas fa-edit"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- Contenido de la sección de reportes -->
    <div v-else-if="currentSection === 'reportes'" class="inventory-main-content animate-fade-in">
      <aside class="inventory-sidebar">
        <div class="sidebar-nav">
          <button class="sidebar-nav-item" @click="showProductsModal = true">
            PRODUCTOS COMPLETOS
          </button>
          <button class="sidebar-nav-item" @click="showIngredientsModal = true">
            INGREDIENTES COMPLETOS
          </button>
          <button class="sidebar-nav-item" @click="showLowStockModal = true">
            ALERTAS CRÍTICAS
          </button>
        </div>
      </aside>

      <section class="inventory-view-area">
        <div class="report-stats">
          <div class="stat-card" @click="showProductsModal = true">
            <div class="stat-icon"><i class="fas fa-boxes"></i></div>
            <div class="stat-info">
              <span class="stat-number">{{ totalProducts }}</span>
              <span class="stat-label">Productos</span>
            </div>
          </div>
          <div class="stat-card" @click="showIngredientsModal = true">
            <div class="stat-icon"><i class="fas fa-leaf"></i></div>
            <div class="stat-info">
              <span class="stat-number">{{ totalIngredients }}</span>
              <span class="stat-label">Ingredientes</span>
            </div>
          </div>
          <div class="stat-card" :class="{ 'warning': lowStockProducts > 0 }" @click="showLowStockModal = true">
            <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
            <div class="stat-info">
              <span class="stat-number">{{ lowStockProducts }}</span>
              <span class="stat-label">Stock Bajo</span>
            </div>
          </div>
        </div>
      </section>
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

// Helper to get icons for tabs
const getTabIcon = (tab) => {
  const icons = {
    productos: 'fas fa-box',
    ingredientes: 'fas fa-leaf',
    stock: 'fas fa-cubes',
    reportes: 'fas fa-chart-bar'
  };
  return icons[tab] || 'fas fa-circle';
};

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
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary-emerald: #56cf44;
  --primary-blue: #0061f2;
  --primary-red: #e53e3e;
  --bg-light: #f8fafc;
  --text-dark: #1e293b;
  --text-grey: #64748b;
  --border-light: #e2e8f0;
  --white: #ffffff;
}

.inventario-container {
  font-family: 'Outfit', sans-serif;
  background-color: var(--white);
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* --- Navbar Tabs --- */
.inventory-navbar {
  padding: 15px 40px;
  border-bottom: 1px solid var(--border-light);
}

.navbar-tabs {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 8px 24px;
  border-radius: 10px;
  border: 1px solid var(--border-light);
  background: var(--white);
  color: var(--text-grey);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f1f5f9;
}

.tab-btn.active {
  background: #f1f5f9;
  color: var(--text-dark);
  border-color: #cbd5e0;
}

/* --- Header Section --- */
.inventory-header {
  padding: 20px 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-right: auto;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.header-actions-right {
  margin-left: auto;
}

/* Button Styles */
.btn-action-green, .btn-action-red, .btn-action-blue {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-action-green { background: var(--primary-emerald); }
.btn-action-red { background: var(--primary-red); }
.btn-action-blue { background: var(--primary-blue); }

.btn-action-green:hover, .btn-action-red:hover, .btn-action-blue:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* --- Main Layout --- */
.inventory-main-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  flex: 1;
  background: #f8fafc;
  border-top: 1px solid var(--border-light);
  overflow: hidden;
}

/* --- Sidebar --- */
.inventory-sidebar {
  padding: 24px;
  background: #f8fafc;
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  height: 100%;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-nav-item {
  width: 100%;
  padding: 16px 20px;
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  text-align: left;
  font-weight: 700;
  color: var(--text-dark);
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.sidebar-nav-item:hover {
  border-color: var(--primary-blue);
  transform: translateX(4px);
}

.sidebar-nav-item.active {
  border-color: var(--primary-blue);
  background: #f0f7ff;
  color: var(--primary-blue);
}

/* --- View Area --- */
.inventory-view-area {
  padding: 40px;
  background: var(--white);
  overflow-y: auto;
  height: 100%;
}

.empty-state-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--border-light);
  border-radius: 20px;
}

.empty-placeholder-content {
  text-align: center;
  color: #94a3b8;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-placeholder-content h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-grey);
}

/* --- Items List & Grid --- */
.item-list h2 {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 24px;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.item-card-modern {
  background: var(--white);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.2s;
}

.item-card-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.item-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn-mini-edit, .btn-mini-delete {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-mini-edit { background: #f1f5f9; color: var(--text-grey); }
.btn-mini-delete { background: #fef2f2; color: var(--primary-red); }

.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Custom Scrollbar for Sidebar */
.inventory-sidebar::-webkit-scrollbar { width: 6px; }
.inventory-sidebar::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 10px; }

/* --- Report Styles --- */
.report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.stat-card {
  background: var(--white);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-blue);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: var(--primary-blue);
  transition: all 0.3s;
}

.stat-card:hover .stat-icon {
  background: var(--primary-blue);
  color: white;
  transform: scale(1.1) rotate(-5deg);
}

.stat-card.warning .stat-icon {
  color: var(--primary-red);
  background: #fff1f2;
}

.stat-card.warning:hover .stat-icon {
  background: var(--primary-red);
  color: white;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text-dark);
  line-height: 1;
}

.stat-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-grey);
  margin-top: 4px;
}

/* --- Modal Improvements --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content, .report-modal-content, .alerts-modal-content {
  background: var(--white);
  padding: 40px;
  border-radius: 28px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-light);
  max-width: 550px;
  width: 100%;
  animation: modalScaleUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

@keyframes modalScaleUp {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-content h3, .report-modal-content h3, .alerts-modal-content h3 {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.modal-content input, .modal-content select {
  width: 100%;
  padding: 16px 20px;
  border-radius: 14px;
  border: 1px solid var(--border-light);
  background: #f8fafc;
  font-family: inherit;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.2s;
  box-sizing: border-box;
}

.modal-content input:focus, .modal-content select:focus {
  outline: none;
  border-color: var(--primary-blue);
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 97, 242, 0.1);
}

.modal-buttons {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.modal-buttons button {
  flex: 1;
  padding: 16px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-buttons button:first-child {
  background: var(--primary-blue);
  color: white;
  border: none;
}

.modal-buttons button:last-child {
  background: #f1f5f9;
  color: var(--text-grey);
  border: 1px solid var(--border-light);
}

/* --- Alerts Modal Specifics --- */
.alerts-modal-options {
  display: grid;
  gap: 16px;
  margin-top: 24px;
}

.alert-option {
  padding: 20px;
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-radius: 18px;
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.alert-option:hover {
  background: white;
  border-color: var(--primary-blue);
  transform: translateX(6px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.option-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-blue);
  font-size: 1.25rem;
}

/* --- Table Refinement --- */
.quantity-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 10px;
}

.quantity-table th {
  text-align: left;
  padding: 0 24px 10px;
  color: var(--text-grey);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quantity-table td {
  padding: 20px 24px;
  background: #f8fafc;
  border: 1px solid var(--border-light);
  border-style: solid none;
}

.quantity-table tr td:first-child {
  border-left: 1px solid var(--border-light);
  border-radius: 16px 0 0 16px;
  font-weight: 700;
}

.quantity-table tr td:last-child {
  border-right: 1px solid var(--border-light);
  border-radius: 0 16px 16px 0;
}

.quantity-badge-modern {
  background: #e0f2fe;
  color: #0369a1;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.btn-mini-edit { background: #f1f5f9; color: var(--text-grey); transition: all 0.2s; }
.btn-mini-edit:hover { background: #e2e8f0; color: var(--text-dark); }
</style>
