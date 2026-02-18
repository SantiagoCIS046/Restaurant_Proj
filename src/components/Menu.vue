<template>
  <div class="menu-container">

    <!-- Barra de botones para navegar entre secciones del inventario -->
    <div class="button-bar">
      <button @click="currentSection = 'productos'">Productos</button>
      <button @click="currentSection = 'ingredientes'">Ingredientes</button>
      <button @click="currentSection = 'cantProductos'">
        Cant. de productos
      </button>
      <button @click="currentSection = 'cantIngredientes'">
        Cant. de Ingredientes
      </button>
      <button @click="currentSection = 'listaPrecios'">Lista de precios</button>
    </div>
    <div v-if="currentSection === 'productos'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Productos</h1>
        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <button class="add-btn" @click="toggleAddForm">Agregar al Menú</button>
        <div v-if="selectedCategory" class="item-list">
          <h2>{{ selectedCategory }}</h2>
          <ul>
            <li
              v-for="(item, index) in filteredItems"
              :key="index"
              class="item-row"
              :class="{ 'low-stock': settings.notifications.lowStock && item.quantity < 5 }"
            >
              <div class="item-info">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-quantity"> ({{ item.quantity }})</span>
              </div>
              <div class="item-actions">
                <button
                  @click="editItem(index)"
                  class="edit-btn"
                  title="Editar"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="deleteItem(index)"
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
    <div v-if="currentSection === 'ingredientes'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Ingredientes</h1>
        <div class="category-list">
          <button
            v-for="category in ingredientCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedIngredientCategory === category }"
            @click="selectIngredientCategory(category)"
          >
            {{ category }}
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
              :key="item"
              class="item-row"
            >
              <span class="item-name">{{ index + 1 }}. {{ item }}</span>
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
    <!-- Modal para agregar artículo -->
    <div v-if="showAddForm" class="modal-overlay" @click="toggleAddForm">
      <div class="modal-content" @click.stop>
        <h3>Agregar Artículo</h3>
        <select v-model="newItem.category">
          <option disabled value="">Selecciona una categoría</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
        <input v-model="newItem.name" placeholder="Nombre del artículo" />
        <div class="modal-buttons">
          <button @click="addItem">Agregar</button>
          <button @click="toggleAddForm">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal para editar artículo -->
    <div
      v-if="showEditForm"
      class="modal-overlay"
      @click="showEditForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Artículo</h3>
        <input v-model="newItem.name" placeholder="Nombre del artículo" />
        <div class="modal-buttons">
          <button @click="updateItem">Actualizar</button>
          <button @click="showEditForm = false">Cancelar</button>
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
        <div class="modal-buttons">
          <button @click="updateIngredient">Actualizar</button>
          <button @click="showEditIngredientForm = false">Cancelar</button>
        </div>
      </div>
    </div>
    <!-- Sección Cantegorias de productos -->
    <div v-if="currentSection === 'cantProductos'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Productos</h1>
        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedCantCategory === category }"
            @click="selectCantCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <div class="top-buttons">
          <button @click="toggleEditMode" class="edit-mode-btn">Editar</button>
          <input
            v-model="searchQuery"
            placeholder="Buscar productos..."
            class="search-input-top"
          />
        </div>
        <div v-if="selectedCantCategory" class="item-list">
          <h2>{{ selectedCantCategory }}</h2>
          <table class="quantity-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th v-if="editMode">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredCantItems" :key="item.name">
                <td>{{ index + 1 }}. {{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td v-if="editMode">
                  <button
                    @click="editQuantity(index)"
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
      </div>
    </div>

    <!-- Modal para editar cantidad -->
    <div
      v-if="showEditQuantityForm"
      class="modal-overlay"
      @click="showEditQuantityForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Cantidad</h3>
        <p>{{ editingItem.category }} - {{ editingItem.name }}</p>
        <input
          v-model.number="editingItem.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="updateQuantity">Actualizar</button>
          <button @click="showEditQuantityForm = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Sección Cant. de ingredientes -->
    <div v-if="currentSection === 'cantIngredientes'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Ingredientes</h1>
        <div class="category-list">
          <button
            v-for="category in ingredientCategories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedCantIngredientCategory === category }"
            @click="selectCantIngredientCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <div class="top-buttons">
          <button @click="toggleEditIngredientMode" class="edit-mode-btn">
            Editar
          </button>
          <input
            v-model="searchIngredientQuery"
            placeholder="Buscar ingredientes..."
            class="search-input-top"
          />
        </div>
        <div v-if="selectedCantIngredientCategory" class="item-list">
          <h2>{{ selectedCantIngredientCategory }}</h2>
          <table class="quantity-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Cantidad</th>
                <th v-if="editIngredientMode">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(item, index) in filteredCantIngredients"
                :key="item.name"
              >
                <td>{{ index + 1 }}. {{ item.name }}</td>
                <td>{{ item.quantity }}</td>
                <td v-if="editIngredientMode">
                  <button
                    @click="editIngredientQuantity(index)"
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
      </div>
    </div>

    <!-- Modal para editar cantidad de ingrediente -->
    <div
      v-if="showEditIngredientQuantityForm"
      class="modal-overlay"
      @click="showEditIngredientQuantityForm = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Editar Cantidad</h3>
        <p>{{ editingIngredient.category }} - {{ editingIngredient.name }}</p>
        <input
          v-model.number="editingIngredient.quantity"
          type="number"
          placeholder="Cantidad"
        />
        <div class="modal-buttons">
          <button @click="updateIngredientQuantity">Actualizar</button>
          <button @click="showEditIngredientQuantityForm = false">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Sección Lista de precios -->
    <div v-if="currentSection === 'listaPrecios'" class="productos-page">
      <div class="left-side">
        <h1 class="title">Categorías de Productos</h1>
        <div class="category-list">
          <button
            v-for="category in categories"
            :key="category"
            class="category-btn"
            :class="{ active: selectedPriceCategory === category }"
            @click="selectPriceCategory(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>
      <div class="right-side" @wheel.prevent>
        <div v-if="selectedPriceCategory" class="item-list">
          <h2>{{ selectedPriceCategory }}</h2>
          <ul>
            <li
              v-for="(item, index) in items[selectedPriceCategory]"
              :key="item.name"
              class="price-item-row"
            >
              <div class="price-item-info" @click="showProductDetails(item)">
                <span class="item-name">{{ index + 1 }}. {{ item.name }}</span>
              </div>
              <div class="price-item-price">
                <span class="item-price"
                  >${{ item.price.toLocaleString() }} COP</span
                >
              </div>
              <div class="price-item-actions">
                <button
                  @click="showProductDetails(item)"
                  class="view-btn"
                  title="Ver detalles"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  @click="editPriceItem(index)"
                  class="edit-btn"
                  title="Editar producto"
                >
                  <i class="fas fa-edit"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Modal para detalles del producto -->
    <div
      v-if="showProductDetailsModal"
      class="modal-overlay"
      @click="closeProductDetails"
    >
      <div class="modal-content product-details-modal" @click.stop>
        <h3>{{ selectedProduct?.name }}</h3>
        <p>
          <strong>Precio:</strong> ${{
            selectedProduct?.price.toLocaleString()
          }}
          COP
        </p>
        <p>
          <strong>Cantidad disponible:</strong> {{ selectedProduct?.quantity }}
        </p>
        <p><strong>Ingredientes:</strong></p>
        <ul>
          <li
            v-for="ingredient in selectedProduct?.ingredients"
            :key="ingredient"
          >
            {{ ingredient }}
          </li>
        </ul>
        <div class="modal-buttons">
          <button @click="closeProductDetails">Cerrar</button>
        </div>
      </div>
    </div>
    
    <!-- Modal para editar producto -->
    <div
      v-if="showEditPriceForm"
      class="modal-overlay"
      @click="showEditPriceForm = false"
    >
      <div class="modal-content edit-product-modal" @click.stop>
        <h3>Editar Producto</h3>
        <div class="form-group">
          <label for="edit-name">Nombre del producto:</label>
          <input
            id="edit-name"
            v-model="editingPriceItem.name"
            placeholder="Nombre del producto"
          />
        </div>
        <div class="form-group">
          <label for="edit-price">Precio (COP):</label>
          <input
            id="edit-price"
            v-model.number="editingPriceItem.price"
            type="number"
            placeholder="Precio"
          />
        </div>
        <div class="form-group">
          <label for="edit-quantity">Cantidad:</label>
          <input
            id="edit-quantity"
            v-model.number="editingPriceItem.quantity"
            type="number"
            placeholder="Cantidad"
          />
        </div>
        <div class="form-group">
          <label for="edit-ingredients">Ingredientes:</label>
          <textarea
            id="edit-ingredients"
            v-model="editingPriceItem.ingredientsText"
            placeholder="Ingredientes (separados por comas)"
            rows="3"
          ></textarea>
        </div>
        <div class="modal-buttons">
          <button @click="updatePriceItem">Actualizar</button>
          <button @click="showEditPriceForm = false">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useSettings } from "../composables/useSettings";

const { settings } = useSettings();

// === Estado ===
const currentSection = ref("productos");
const categories = ref([
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

// Datos de productos e ingredientes
const items = ref({
  Bebidas: [
    {
      name: "Coca Cola",
      quantity: 10,
      price: 2500,
      ingredients: ["Agua", "Azúcar", "Gas"],
    },
    {
      name: "Sprite",
      quantity: 5,
      price: 2500,
      ingredients: ["Agua", "Azúcar", "Gas", "Limón"],
    },
  ],
  Entradas: [
    {
      name: "Empanadas",
      quantity: 20,
      price: 3000,
      ingredients: ["Harina", "Carne", "Cebolla", "Papa"],
    },
    {
      name: "Patacones",
      quantity: 15,
      price: 4000,
      ingredients: ["Plátano", "Aceite", "Sal"],
    },
  ],
  Adicionales: [
    {
      name: "Arroz",
      quantity: 30,
      price: 2000,
      ingredients: ["Arroz", "Agua", "Sal"],
    },
    {
      name: "Frijoles",
      quantity: 25,
      price: 2500,
      ingredients: ["Frijoles", "Agua", "Cebolla", "Ajo"],
    },
  ],
  "Com. de Mar": [
    {
      name: "Ceviche de Camarón",
      quantity: 10,
      price: 15000,
      ingredients: ["Camarón", "Limón", "Cebolla", "Cilantro", "Ají"],
    },
  ],
  "Nuestros Pescados": [
    {
      name: "Mojarra Frita",
      quantity: 8,
      price: 12000,
      ingredients: ["Mojarra", "Aceite", "Sal", "Limón"],
    },
  ],
  "Cocina Tipica": [
    {
      name: "Bandeja Paisa",
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
  ],
  Res: [
    {
      name: "Churrasco",
      quantity: 12,
      price: 14000,
      ingredients: ["Res", "Sal", "Pimienta", "Aceite"],
    },
  ],
  Cerdo: [
    {
      name: "Lechona",
      quantity: 6,
      price: 16000,
      ingredients: ["Cerdo", "Arroz", "Papa", "Cebolla", "Ajo"],
    },
  ],
  Pastas: [
    {
      name: "Spaghetti Carbonara",
      quantity: 10,
      price: 10000,
      ingredients: ["Pasta", "Huevo", "Queso", "Panceta", "Crema"],
    },
  ],
  Aves: [
    {
      name: "Pollo con Papas",
      quantity: 15,
      price: 11000,
      ingredients: ["Pollo", "Papa", "Aceite", "Sal", "Especias"],
    },
  ],
  Vegetales: [
    {
      name: "Ensalada Mixta",
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
  ],
  Postres: [
    {
      name: "Tres Leches",
      quantity: 10,
      price: 6000,
      ingredients: ["Harina", "Leche", "Azúcar", "Huevos", "Vainilla"],
    },
  ],
  Ensaladas: [
    {
      name: "Ensalada César",
      quantity: 12,
      price: 7000,
      ingredients: ["Lechuga", "Pollo", "Queso", "Croutons", "Aderezo César"],
    },
  ],
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

// Variables para la sección de productos e ingredientes
const selectedCategory = ref("");
const selectedIngredientCategory = ref("");
const selectedCantCategory = ref("");
const selectedCantIngredientCategory = ref("");
const selectedPriceCategory = ref("");
const showProductDetailsModal = ref(false);
const selectedProduct = ref(null);
const showEditPriceForm = ref(false);
const editingPriceItem = ref({
  name: "",
  price: 0,
  quantity: 0,
  ingredientsText: "",
});
const editingPriceIndex = ref(-1);
const newItem = ref({ category: "", name: "" });
const newIngredient = ref({ category: "", name: "" });
const showAddForm = ref(false);
const showAddIngredientForm = ref(false);
const editingIndex = ref(-1);
const editingIngredientIndex = ref(-1);
const showEditForm = ref(false);
const showEditIngredientForm = ref(false);

const selectCategory = (category) => {
  selectedCategory.value = category;
};

const addItem = () => {
  if (newItem.value.category && newItem.value.name) {
    items.value[newItem.value.category].push({
      name: newItem.value.name,
      quantity: 0,
    });
    newItem.value = { category: "", name: "" };
    showAddForm.value = false;
  }
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
};

const editItem = (index) => {
  editingIndex.value = index;
  newItem.value.name = items.value[selectedCategory.value][index].name;
  newItem.value.category = selectedCategory.value;
  showEditForm.value = true;
};

const updateItem = () => {
  if (newItem.value.name && editingIndex.value >= 0) {
    items.value[selectedCategory.value][editingIndex.value].name =
      newItem.value.name;
    newItem.value = { category: "", name: "" };
    editingIndex.value = -1;
    showEditForm.value = false;
  }
};

const deleteItem = (index) => {
  items.value[selectedCategory.value].splice(index, 1);
};

const selectIngredientCategory = (category) => {
  selectedIngredientCategory.value = category;
};

const addIngredient = () => {
  if (newIngredient.value.category && newIngredient.value.name) {
    ingredients.value[newIngredient.value.category].push({
      name: newIngredient.value.name,
      quantity: 0,
    });
    newIngredient.value = { category: "", name: "" };
    showAddIngredientForm.value = false;
  }
};

const toggleAddIngredientForm = () => {
  showAddIngredientForm.value = !showAddIngredientForm.value;
};

const editIngredient = (index) => {
  editingIngredientIndex.value = index;
  newIngredient.value.name =
    ingredients.value[selectedIngredientCategory.value][index].name;
  newIngredient.value.category = selectedIngredientCategory.value;
  showEditIngredientForm.value = true;
};

const updateIngredient = () => {
  if (newIngredient.value.name && editingIngredientIndex.value >= 0) {
    ingredients.value[selectedIngredientCategory.value][
      editingIngredientIndex.value
    ].name = newIngredient.value.name;
    newIngredient.value = { category: "", name: "" };
    editingIngredientIndex.value = -1;
    showEditIngredientForm.value = false;
  }
};

const deleteIngredient = (index) => {
  ingredients.value[selectedIngredientCategory.value].splice(index, 1);
};

// Variables para la sección Cant. de productos
const searchQuery = ref("");
const editMode = ref(false);
const searchMode = ref(false);
const showEditQuantityForm = ref(false);
const editingItem = ref({ category: "", name: "", quantity: 0 });
const editingQuantityIndex = ref(-1);

// Variables para la sección Cant. de ingredientes
const searchIngredientQuery = ref("");
const editIngredientMode = ref(false);
const showEditIngredientQuantityForm = ref(false);
const editingIngredient = ref({ category: "", name: "", quantity: 0 });
const editingIngredientQuantityIndex = ref(-1);

// Computed para filtrar items
const allItems = computed(() => {
  const result = [];
  for (const category in items.value) {
    items.value[category].forEach((item) => {
      result.push({ ...item, category });
    });
  }
  return result;
});

const filteredItems = computed(() => {
  if (!searchQuery.value) return allItems.value;
  return allItems.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Funciones para la sección Cant. de productos
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

const toggleSearchMode = () => {
  searchMode.value = !searchMode.value;
};

const editQuantity = (index) => {
  const item = filteredItems.value[index];
  editingItem.value = { ...item };
  editingQuantityIndex.value = index;
  showEditQuantityForm.value = true;
};

const selectCantCategory = (category) => {
  selectedCantCategory.value = category;
};

const filteredCantItems = computed(() => {
  if (!selectedCantCategory.value) return [];
  const categoryItems = items.value[selectedCantCategory.value];
  if (!searchQuery.value) return categoryItems;
  return categoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const updateQuantity = () => {
  if (editingQuantityIndex.value >= 0) {
    const item = filteredCantItems.value[editingQuantityIndex.value];
    const categoryItems = items.value[selectedCantCategory.value];
    const itemIndex = categoryItems.findIndex((i) => i.name === item.name);
    if (itemIndex >= 0) {
      categoryItems[itemIndex].quantity = editingItem.value.quantity;
    }
    showEditQuantityForm.value = false;
    editingQuantityIndex.value = -1;
  }
};

// Funciones para la sección Cant. de ingredientes
const toggleEditIngredientMode = () => {
  editIngredientMode.value = !editIngredientMode.value;
};

const editIngredientQuantity = (index) => {
  const item = filteredCantIngredients.value[index];
  editingIngredient.value = {
    ...item,
    category: selectedCantIngredientCategory.value,
  };
  editingIngredientQuantityIndex.value = index;
  showEditIngredientQuantityForm.value = true;
};

const selectCantIngredientCategory = (category) => {
  selectedCantIngredientCategory.value = category;
};

const filteredCantIngredients = computed(() => {
  if (!selectedCantIngredientCategory.value) return [];
  const categoryIngredients =
    ingredients.value[selectedCantIngredientCategory.value];
  if (!searchIngredientQuery.value) return categoryIngredients;
  return categoryIngredients.filter((item) =>
    item.name.toLowerCase().includes(searchIngredientQuery.value.toLowerCase())
  );
});

const updateIngredientQuantity = () => {
  if (editingIngredientQuantityIndex.value >= 0) {
    const item =
      filteredCantIngredients.value[editingIngredientQuantityIndex.value];
    const categoryIngredients =
      ingredients.value[selectedCantIngredientCategory.value];
    const itemIndex = categoryIngredients.findIndex(
      (i) => i.name === item.name
    );
    if (itemIndex >= 0) {
      categoryIngredients[itemIndex].quantity =
        editingIngredient.value.quantity;
    }
    showEditIngredientQuantityForm.value = false;
    editingIngredientQuantityIndex.value = -1;
  }
};

// Funciones para la sección Lista de precios
const selectPriceCategory = (category) => {
  selectedPriceCategory.value = category;
};

const showProductDetails = (item) => {
  selectedProduct.value = item;
  showProductDetailsModal.value = true;
};

const closeProductDetails = () => {
  showProductDetailsModal.value = false;
  selectedProduct.value = null;
};

const editPriceItem = (index) => {
  const item = items.value[selectedPriceCategory.value][index];
  editingPriceItem.value = {
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    ingredientsText: item.ingredients.join(", "),
  };
  editingPriceIndex.value = index;
  showEditPriceForm.value = true;
};

const updatePriceItem = () => {
  if (editingPriceIndex.value >= 0) {
    const item =
      items.value[selectedPriceCategory.value][editingPriceIndex.value];
    item.name = editingPriceItem.value.name;
    item.price = editingPriceItem.value.price;
    item.quantity = editingPriceItem.value.quantity;
    item.ingredients = editingPriceItem.value.ingredientsText
      .split(",")
      .map((i) => i.trim());
    showEditPriceForm.value = false;
    editingPriceIndex.value = -1;
  }
};
</script>

<style scoped>
.menu-container {
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
  background: var(--bg-card);
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
  background: var(--bg-input);
  border-right: 1px solid var(--border-color);
  border-radius: 10px 0 0 10px;
  overflow-y: auto;
}

.title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--text-primary);
}


.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Reduced gap */
}

.category-btn {
  background: var(--bg-input);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.25rem 0.5rem; /* Reduced padding */
  cursor: pointer;
  border-radius: 4px;
  text-align: left;
  transition: all 0.2s ease;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.9rem; /* Reduced font size */
}

/* ... states ... */

.right-side {
  flex: 1;
  padding: 0.75rem; /* Reduced padding */
  background: var(--bg-card);
  overflow-y: hidden;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.add-btn {
  background: #38a169;
  border: none;
  color: white;
  padding: 0.4rem 0.8rem; /* Reduced padding */
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  transition: background 0.2s ease;
}

/* ... form styles ... */

.item-row.low-stock {
  border-left: 4px solid #e53e3e;
  background-color: var(--bg-hover);
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0; /* Reduced padding */
  font-size: 0.9rem; /* Reduced font size */
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem; /* Reduced gap */
}

.edit-btn, .delete-btn, .view-btn {
    padding: 0.2rem 0.4rem; /* Smaller action buttons */
    font-size: 0.75rem;
}

/* ... rest of styles ... */


.delete-btn:hover {
  background: #c53030;
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
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.modal-content select,
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
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

.item-quantity {
  font-weight: bold;
  color: var(--text-primary);
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
}

.top-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.edit-mode-btn,
.search-mode-btn {
  background: #3182ce;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.edit-mode-btn:hover,
.search-mode-btn:hover {
  background: #2c5282;
}

.search-input-top {
  width: 200px;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
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
  border-bottom: 1px solid var(--border-color);
}

.quantity-table th {
  background: var(--bg-input);
  font-weight: bold;
  color: var(--text-primary);
}

.price-item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.price-item-row:hover {
  background: var(--bg-hover);
}

.price-item-info {
  flex: 1;
  cursor: pointer;
}

.price-item-price {
  margin-right: 1rem;
}

.item-price {
  font-weight: bold;
  color: #38a169;
}

.view-btn {
  background: #3182ce;
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-btn:hover {
  background: #2c5282;
}

.product-details-modal {
  width: 400px;
  max-width: 95%;
}

.product-details-modal ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.edit-product-modal {
  width: 400px;
  max-width: 95%;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: var(--text-primary);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  box-sizing: border-box;
}

/* Responsive Styles */
@media (max-width: 768px) {
  .productos-page {
    flex-direction: column;
    position: relative; /* Change from fixed to relative to allow better scrolling on mobile */
    top: 0;
    height: auto;
    overflow: visible;
    padding-bottom: 2rem;
  }

  .left-side {
    flex: none;
    width: 100%;
    border-radius: 8px;
    margin-bottom: 1rem;
    border-right: none;
    border: 1px solid var(--border-color);
    padding: 0.75rem;
    max-height: 200px; /* Limit height of categories */
  }

  .category-list {
    flex-direction: row; /* Horizontal scroll for categories */
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .category-btn {
    min-width: 120px;
    text-align: center;
  }
  
  .right-side {
      height: auto;
      overflow: visible;
  }

  .button-bar {
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
  }
  
  .button-bar button {
      flex: 1 1 auto;
      font-size: 0.8rem;
      padding: 0.5rem;
  }
  
  .item-row {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
      background: var(--bg-input);
      padding: 0.75rem;
      border-radius: 6px;
      margin-bottom: 0.5rem;
  }
  
  .item-actions {
      width: 100%;
      justify-content: flex-end;
      border-top: 1px solid var(--border-color);
      padding-top: 0.5rem;
      margin-top: 0.25rem;
  }
  
  .price-item-row {
      flex-direction: column;
      align-items: flex-start;
  }
  
  .price-item-price {
      margin: 0.5rem 0;
  }
  
  .price-item-actions {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
  }
}
</style>
