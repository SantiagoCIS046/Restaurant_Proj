<template>
  <div class="container py-3">
    <div class="header-container">
      <h1>Gestión de Personal</h1>
      <div class="header-buttons">
        <button class="add-personal-btn" @click="showAddModal = true">
          ➕ Agregar Personal
        </button>
      </div>
    </div>

    <div class="mostrador-layout">
      <div class="sidebar">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar personal..."
            class="search-input"
          />
        </div>
        <div class="buttons-section">
          <button class="personal-btn" @click="filterPersonal('meseros')">
            Meseros
          </button>
          <button class="personal-btn" @click="filterPersonal('ayudantes')">
            Ayudantes
          </button>
          <button class="personal-btn" @click="filterPersonal('limpieza')">
            Limpieza
          </button>
          <button class="personal-btn" @click="filterPersonal('cocina')">
            Cocina
          </button>
          <button class="personal-btn" @click="filterPersonal('socios')">
            Socios
          </button>
          <button class="personal-btn" @click="filterPersonal('completo')">
            Personal Completo
          </button>
        </div>
      </div>
      <div class="main-content">
        <h2>
          {{
            currentFilter === "completo"
              ? "Todo el Personal"
              : currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)
          }}
        </h2>
        <div class="personal-stats">
          <div class="stat-item">
            <div class="stat-number">{{ personal.length }}</div>
            <div class="stat-label">Total Personal</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ countByRol("meseros") }}</div>
            <div class="stat-label">Meseros</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ countByRol("ayudantes") }}</div>
            <div class="stat-label">Ayudantes</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ countByRol("limpieza") }}</div>
            <div class="stat-label">Limpieza</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ countByRol("cocina") }}</div>
            <div class="stat-label">Cocina</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ countByRol("socios") }}</div>
            <div class="stat-label">Socios</div>
          </div>
        </div>
        <div class="personal-header-row">
          <span class="col-name">NOMBRE</span>
          <span class="col-rol">ROL</span>
          <span class="col-turno">TURNO</span>
          <span class="col-propina">PROPINA</span>
          <span class="col-salario">SALARIO</span>
          <span class="col-actions">GESTIÓN</span>
        </div>
        <div class="personal-list">
          <div
            v-for="persona in filteredPersonal"
            :key="persona.id"
            class="personal-card"
          >
            <div class="col-name">
              <h3>{{ persona.nombre }}</h3>
            </div>
            <div class="col-rol">
              <span class="rol-badge">{{ persona.rol }}</span>
            </div>
            <div class="col-turno">
              <span>{{ persona.turno }}</span>
            </div>
            <div class="col-propina">
              <span class="propina-badge" :class="{ 'has-propina': persona.propinaAutomatica }">
                {{ persona.propinaAutomatica ? '$' + calcularPropinaAutomatica(persona, 800000).toLocaleString() : '$0' }}
              </span>
            </div>
            <div class="col-salario">
              <span>${{ persona.salario || "---" }}</span>
            </div>
            <div class="col-actions">
              <div class="personal-actions">
                <button class="edit-btn" @click="editarPersonal(persona)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" @click="eliminarPersonal(persona.id)">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="personal-legend-container">
          <p class="legend-title"><i class="fas fa-info-circle"></i> Guía de Cálculo de Propinas</p>
          <div class="legend-content">
            <div class="legend-item">
              <span class="legend-bullet">•</span>
              <span>Se activa si las ventas diarias superan los <strong>$600,000 COP</strong>.</span>
            </div>
            <div class="legend-item">
              <span class="legend-bullet">•</span>
              <span><strong>Meseros:</strong> $5,000 COP por cada mesa atendida.</span>
            </div>
            <div class="legend-item">
              <span class="legend-bullet">•</span>
              <span><strong>Otros Roles:</strong> $10,000 COP fijos si tienen propina automática activa.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Personal Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="modal"
      @click.self="closeModal"
    >
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>
          {{ showEditModal ? "Editar Personal" : "Agregar Nuevo Personal" }}
        </h2>
        <form
          @submit.prevent="
            showEditModal ? actualizarPersonal() : agregarPersonal()
          "
        >
          <div class="form-group">
            <label for="personal-name">Nombre:</label>
            <input
              type="text"
              id="personal-name"
              v-model="newPersonal.nombre"
              required
            />
          </div>
          <div class="form-group">
            <label for="personal-rol">Rol:</label>
            <select id="personal-rol" v-model="newPersonal.rol" required>
              <option value="">Seleccionar rol...</option>
              <option value="meseros">Meseros</option>
              <option value="ayudantes">Ayudantes</option>
              <option value="limpieza">Limpieza</option>
              <option value="cocina">Cocina</option>
              <option value="socios">Socios</option>
            </select>
          </div>
          <div class="form-group">
            <label for="personal-turno">Turno:</label>
            <select id="personal-turno" v-model="newPersonal.turno" required>
              <option value="">Seleccionar turno...</option>
              <option value="Mañana">Mañana</option>
              <option value="Tarde">Tarde</option>
              <option value="Noche">Noche</option>
            </select>
          </div>
          <div class="form-group">
            <label for="personal-salario">Salario (opcional):</label>
            <input
              type="number"
              id="personal-salario"
              v-model="newPersonal.salario"
              min="0"
              step="0.01"
            />
          </div>
          <div class="form-group">
            <label class="checkbox-container">
              <input type="checkbox" v-model="newPersonal.propinaAutomatica" />
              <span class="checkbox-label">Propina Automática</span>
            </label>
          </div>
          <div v-if="newPersonal.propinaAutomatica" class="form-group">
            <label for="personal-mesas">Mesas Atendidas:</label>
            <input
              type="number"
              id="personal-mesas"
              v-model="newPersonal.mesasAtendidas"
              min="0"
              placeholder="Ej: 15"
            />
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal">Cancelar</button>
            <button type="submit">
              {{ showEditModal ? "Actualizar" : "Agregar" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const personal = ref([]);
const searchQuery = ref("");
const currentFilter = ref("completo");

// Estados para modales
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingPerson = ref(null);

const newPersonal = ref({
  nombre: "",
  rol: "",
  turno: "",
  salario: "",
  propinaAutomatica: false,
  mesasAtendidas: 0,
});

// === Funciones de persistencia ===
function inicializarPersonal() {
  if (!localStorage.getItem("personalRestaurante")) {
    const personalInicial = [
      {
        id: "p1",
        nombre: "Juan Pérez",
        rol: "meseros",
        turno: "Mañana",
        propinaAutomatica: true,
        mesasAtendidas: 15,
      },
      {
        id: "p2",
        nombre: "María García",
        rol: "meseros",
        turno: "Tarde",
        propinaAutomatica: true,
        mesasAtendidas: 12,
      },
      {
        id: "p3",
        nombre: "Carlos López",
        rol: "ayudantes",
        turno: "Mañana",
        propinaAutomatica: true,
        mesasAtendidas: 0,
      },
      {
        id: "p4",
        nombre: "Ana Rodríguez",
        rol: "limpieza",
        turno: "Tarde",
        propinaAutomatica: false,
        mesasAtendidas: 0,
      },
      {
        id: "p5",
        nombre: "Pedro Sánchez",
        rol: "cocina",
        turno: "Mañana",
        propinaAutomatica: true,
        mesasAtendidas: 0,
      },
      {
        id: "p6",
        nombre: "Laura Martínez",
        rol: "socios",
        turno: "Tarde",
        propinaAutomatica: false,
        mesasAtendidas: 0,
      },
      {
        id: "p7",
        nombre: "Miguel Fernández",
        rol: "meseros",
        turno: "Noche",
        propinaAutomatica: true,
        mesasAtendidas: 18,
      },
      {
        id: "p8",
        nombre: "Sofia Gómez",
        rol: "ayudantes",
        turno: "Noche",
        propinaAutomatica: true,
        mesasAtendidas: 0,
      },
    ];
    localStorage.setItem(
      "personalRestaurante",
      JSON.stringify(personalInicial)
    );
  }
}

function obtenerPersonal() {
  const data = localStorage.getItem("personalRestaurante");
  return data ? JSON.parse(data) : [];
}

// === Funciones para personal ===
function filterPersonal(rol) {
  currentFilter.value = rol;
}

function countByRol(rol) {
  return personal.value.filter((persona) => persona.rol === rol).length;
}

function agregarPersonal() {
  const nuevaPersona = {
    ...newPersonal.value,
    id: `p${personal.value.length + 1}`,
  };
  personal.value.push(nuevaPersona);
  guardarPersonal();
  closeModal();
}

function editarPersonal(persona) {
  editingPerson.value = persona;
  newPersonal.value = { ...persona };
  showEditModal.value = true;
}

function actualizarPersonal() {
  const index = personal.value.findIndex(
    (p) => p.id === editingPerson.value.id
  );
  if (index !== -1) {
    personal.value[index] = {
      ...newPersonal.value,
      id: editingPerson.value.id,
    };
    guardarPersonal();
  }
  closeModal();
}

function eliminarPersonal(id) {
  personal.value = personal.value.filter((p) => p.id !== id);
  guardarPersonal();
}

function closeModal() {
  showAddModal.value = false;
  showEditModal.value = false;
  editingPerson.value = null;
  newPersonal.value = {
    nombre: "",
    rol: "",
    turno: "",
    salario: "",
    propinaAutomatica: false,
    mesasAtendidas: 0,
  };
}

function guardarPersonal() {
  localStorage.setItem("personalRestaurante", JSON.stringify(personal.value));
}

const filteredPersonal = computed(() => {
  let filtered = personal.value;

  if (currentFilter.value !== "completo") {
    filtered = filtered.filter(
      (persona) => persona.rol === currentFilter.value
    );
  }

  if (searchQuery.value) {
    filtered = filtered.filter((persona) =>
      persona.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  return filtered;
});

// === Funciones para propinas ===
function calcularPropinaAutomatica(persona, ventasDiarias) {
  if (!persona.propinaAutomatica) return 0;

  // Si las ventas diarias son menores a 600,000 COP, no hay propina
  if (ventasDiarias < 600000) return 0;

  // Para meseros: propina basada en mesas atendidas
  if (persona.rol === "meseros") {
    const propinaPorMesa = 5000; // 5,000 COP por mesa
    return persona.mesasAtendidas * propinaPorMesa;
  }

  // Para otros roles: propina fija si tienen propina automática
  return 10000; // 10,000 COP fijos para ayudantes, cocina, etc.
}

function calcularPropinasDiarias(ventasDiarias) {
  return personal.value.map((persona) => ({
    ...persona,
    propinaDiaria: calcularPropinaAutomatica(persona, ventasDiarias),
  }));
}

// === Ciclo de vida ===
onMounted(() => {
  inicializarPersonal();
  personal.value = obtenerPersonal();
});
</script>

<style scoped>
@import "../style.css";

/* Estilos para mostrador */
.mostrador-layout {
  display: flex;
  gap: 2rem;
  height: calc(100vh - 140px);
  margin-top: 1rem;
}

.sidebar {
  width: 280px;
  background: white;
  padding: 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.search-bar {
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.buttons-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.personal-btn {
  padding: 0.6rem 0.85rem;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.personal-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  padding-left: 1rem;
}

.personal-btn.active {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-color: #2563eb;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.15);
  padding-left: 1rem;
}

.main-content {
  flex: 1;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border: 1px solid #e2e8f0;
}

.personal-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.personal-card {
  background: white;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.personal-card:last-child {
  border-bottom: none;
}

.personal-card:nth-child(even) {
  background-color: #f8fafc;
}

.personal-card:hover {
  background: #f1f5f9;
  box-shadow: inset 0 0 0 1px #3182ce;
}

.personal-info h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1rem;
}

.personal-info p {
  margin: 0;
  color: #4a5568;
  font-size: 0.85rem;
}

.personal-header-row {
  display: flex;
  background: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 8px 8px 0 0;
  font-weight: 800;
  font-size: 0.7rem;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 1rem;
}

.col-name { 
  flex: 1; 
  padding: 10px 20px;
  display: flex; 
  align-items: center; 
  border-right: 1px solid #cbd5e1;
  min-width: 0;
}

.col-name h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-rol, .col-turno, .col-propina, .col-salario {
  flex: 0 0 110px;
  padding: 10px 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #cbd5e1;
  font-size: 0.85rem;
  color: #475569;
}

.propina-badge {
  font-weight: 800;
  color: #94a3b8;
}

.propina-badge.has-propina {
  color: #059669;
}

.col-rol {
  background: #f8fafc;
}

.col-actions { 
  flex: 0 0 100px;
  padding: 10px;
  display: flex; 
  align-items: center; 
  justify-content: center;
}

.personal-actions {
  display: flex;
  flex-direction: row;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

.rol-badge {
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.edit-btn,
.delete-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #f0fdf4;
  color: #166534;
}

.edit-btn:hover {
  background: #dcfce7;
  transform: scale(1.1);
}

.delete-btn {
  background: #fef2f2;
  color: #991b1b;
}

.delete-btn:hover {
  background: #fee2e2;
  transform: scale(1.1);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-personal-btn {
  background: #38a169;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.add-personal-btn:hover {
  background: #2f855a;
}

.personal-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  text-align: center;
  min-width: 100px;
  border: 1px solid #f1f5f9;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3182ce;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal {
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
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4a5568;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2d3748;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.form-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.form-actions button:first-child {
  background: #e2e8f0;
  color: #4a5568;
}

.form-actions button:last-child {
  background: #3182ce;
  color: white;
}

.form-actions button:hover:first-child {
  background: #cbd5e0;
}

.form-actions button:hover:last-child {
  background: #2c5282;
}
.form-help-text {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.5rem;
  line-height: 1.6;
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid #3b82f6;
}

.form-help-text strong {
  color: #1e293b;
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0;
}

.checkbox-label {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}
/* Personal Legend */
.personal-legend-container {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
}

.legend-title {
  margin: 0 0 0.5rem 0;
  font-size: 0.75rem;
  font-weight: 800;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.legend-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.legend-item {
  font-size: 0.75rem;
  color: #64748b;
  display: flex;
  gap: 0.4rem;
  align-items: flex-start;
}

.legend-bullet {
  color: #3b82f6;
  font-weight: 900;
}
</style>
