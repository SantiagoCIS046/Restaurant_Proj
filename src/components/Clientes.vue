<template>
  <div class="container py-3">
    <h1>Clientes</h1>
    <p>
      Administra la información de los clientes, incluyendo reservas, mesas y
      pagos.
    </p>

    <div class="header-buttons">
      <button class="add-client-btn" @click="showAddModal = true">
        ➕ Agregar Cliente
      </button>
      <button class="refresh-btn" @click="cargarDatos">
        🔄 Actualizar Datos
      </button>
    </div>

    <div class="clients-list">
      <div v-if="clientes.length === 0" class="no-clients">
        <p>
          No hay clientes registrados. Agrega uno nuevo o espera a que se
          generen desde reservas.
        </p>
      </div>
      <div
        v-for="cliente in clientes"
        :key="cliente.id"
        class="client-card"
        @click="verDetallesCliente(cliente)"
      >
        <div class="client-header">
          <h3>{{ cliente.nombre }}</h3>
          <span class="client-id">{{ cliente.id }}</span>
        </div>
        <div class="client-summary">
          <div class="summary-item">
            <strong>Reservas:</strong> {{ cliente.reservas.length }}
          </div>
          <div class="summary-item">
            <strong>Pagos Totales:</strong> ${{ cliente.totalPagos }}
          </div>
          <div class="summary-item">
            <strong>Mesas Usadas:</strong>
            {{ new Set(cliente.reservas.map((r) => r.mesaId)).size }}
          </div>
        </div>
        <button class="details-btn" @click.stop="verDetallesCliente(cliente)">
          Ver Detalles
        </button>
        <button
          class="delete-btn"
          @click.stop="confirmarEliminarCliente(cliente)"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>

    <!-- Se agrega el modal de los Clientes -->
    <div v-if="showAddModal" class="modal" @click.self="showAddModal = false">
      <div class="modal-content">
        <span class="close" @click="showAddModal = false">&times;</span>
        <h2>Agregar Nuevo Cliente</h2>
        <form @submit.prevent="agregarCliente">
          <div class="form-group">
            <label for="client-name">Nombre:</label>
            <input
              type="text"
              id="client-name"
              v-model="newClient.nombre"
              required
            />
          </div>
          <div class="form-group">
            <label for="client-email">Email:</label>
            <input type="email" id="client-email" v-model="newClient.email" />
          </div>
          <div class="form-group">
            <label for="client-phone">Teléfono:</label>
            <input type="tel" id="client-phone" v-model="newClient.telefono" />
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddModal = false">
              Cancelar
            </button>
            <button type="submit">Agregar Cliente</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Se agrega el modal para Confirmar la Eliminación -->
    <div
      v-if="showDeleteModal"
      class="modal"
      @click.self="showDeleteModal = false"
    >
      <div class="modal-content">
        <span class="close" @click="showDeleteModal = false">&times;</span>
        <h2>Confirmar Eliminación</h2>
        <p>
          ¿Estás seguro de que deseas eliminar al cliente
          <strong>{{ clienteAEliminar?.nombre }}</strong
          >?
        </p>
        <p class="warning">
          Esta acción no se puede deshacer. Se eliminarán todos los datos
          asociados al cliente.
        </p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">Cancelar</button>
          <button class="delete-confirm-btn" @click="eliminarCliente">
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Se agrega el modal de Detalles del Cliente -->
    <div
      v-if="showDetailsModal"
      class="modal"
      @click.self="showDetailsModal = false"
    >
      <div class="modal-content large-modal">
        <span class="close" @click="showDetailsModal = false">&times;</span>
        <h2>Detalles del Cliente: {{ clienteSeleccionado?.nombre }}</h2>

        <div class="client-details">
          <div class="details-section">
            <h3>Información General</h3>
            <div class="info-grid">
              <div class="info-item">
                <strong>ID:</strong> {{ clienteSeleccionado?.id }}
              </div>
              <div class="info-item">
                <strong>Email:</strong>
                {{ clienteSeleccionado?.email || "No especificado" }}
              </div>
              <div class="info-item">
                <strong>Teléfono:</strong>
                {{ clienteSeleccionado?.telefono || "No especificado" }}
              </div>
              <div class="info-item">
                <strong>Total Pagos:</strong> ${{
                  clienteSeleccionado?.totalPagos
                }}
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Reservas ({{ clienteSeleccionado?.reservas.length }})</h3>
            <div
              v-if="clienteSeleccionado?.reservas.length === 0"
              class="no-data"
            >
              <p>No hay reservas asociadas.</p>
            </div>
            <div v-else class="reservations-list">
              <div
                v-for="reserva in clienteSeleccionado.reservas"
                :key="reserva.id"
                class="reservation-item"
              >
                <div class="reservation-header">
                  <strong>{{ reserva.id }}</strong> - {{ reserva.dia }}
                  {{ reserva.hora }}
                </div>
                <div class="reservation-details">
                  <div>Mesa: {{ reserva.mesaId.toUpperCase() }}</div>
                  <div>Lugar: {{ reserva.lugar }}</div>
                  <div>Ocasion: {{ reserva.ocasion }}</div>
                  <div>Estado: {{ reserva.estado }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Mesas Utilizadas</h3>
            <div v-if="mesasCliente.length === 0" class="no-data">
              <p>No hay mesas asociadas.</p>
            </div>
            <div v-else class="tables-list">
              <div
                v-for="mesa in mesasCliente"
                :key="mesa.id"
                class="table-item"
              >
                <div class="table-header">
                  <strong>{{ mesa.id.toUpperCase() }}</strong>
                </div>
                <div class="table-details">
                  <div>Capacidad: {{ mesa.capacidad }} personas</div>
                  <div>Ubicación: {{ mesa.ubicacion }}</div>
                  <div>Estado Actual: {{ mesa.estado }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Registro de Pagos</h3>
            <div v-if="pagosCliente.length === 0" class="no-data">
              <p>No hay pagos registrados.</p>
            </div>
            <div v-else class="payments-list">
              <div
                v-for="pago in pagosCliente"
                :key="pago.id"
                class="payment-item"
              >
                <div class="payment-header">
                  <strong>{{ pago.id }}</strong> - ${{ pago.monto }}
                </div>
                <div class="payment-details">
                  <div>Fecha: {{ pago.fecha }}</div>
                  <div>Reserva: {{ pago.reservaId }}</div>
                  <div>Mesa: {{ pago.mesaId.toUpperCase() }}</div>
                  <div>Método: {{ pago.metodo }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="details-section">
            <h3>Pedidos (Próximamente)</h3>
            <div class="placeholder">
              <p>
                Funcionalidad de pedidos detallados próximamente. Se integrará
                con el módulo de Pedidos.
              </p>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="showDetailsModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// === Estado ===
const clientes = ref([]);
const reservas = ref([]);
const mesas = ref([]);

const showAddModal = ref(false);
const showDetailsModal = ref(false);
const showDeleteModal = ref(false);
const clienteSeleccionado = ref(null);
const clienteAEliminar = ref(null);

const newClient = ref({
  nombre: "",
  email: "",
  telefono: "",
});

// === Funciones de Persistencia ===
function inicializarClientes() {
  if (!localStorage.getItem("clientesRestaurante")) {
    // Inicializar con clientes vacíos, se poblarán desde reservas
    localStorage.setItem("clientesRestaurante", JSON.stringify([]));
  }
}

function obtenerClientes() {
  const data = localStorage.getItem("clientesRestaurante");
  return data ? JSON.parse(data) : [];
}

function guardarClientes() {
  localStorage.setItem("clientesRestaurante", JSON.stringify(clientes.value));
}

function obtenerReservas() {
  const data = localStorage.getItem("reservasRestaurante");
  return data ? JSON.parse(data) : [];
}

function obtenerMesas() {
  const data = localStorage.getItem("mesasRestaurante");
  return data ? JSON.parse(data) : [];
}

// === Funciones de Lógica ===
function cargarDatos() {
  reservas.value = obtenerReservas();
  mesas.value = obtenerMesas();
  sincronizarClientesDesdeReservas();
  clientes.value = obtenerClientes();
}

function sincronizarClientesDesdeReservas() {
  const reservasExistentes = obtenerReservas();
  const clientesExistentes = obtenerClientes();

  // Crear o actualizar clientes basados en reservas
  reservasExistentes.forEach((reserva) => {
    let cliente = clientesExistentes.find((c) => c.nombre === reserva.nombre);
    if (!cliente) {
      cliente = {
        id: `cliente${clientesExistentes.length + 1}`,
        nombre: reserva.nombre,
        email: "",
        telefono: "",
        reservas: [],
        totalPagos: 0,
      };
      clientesExistentes.push(cliente);
    }

    // Agregar reserva si no existe
    if (!cliente.reservas.find((r) => r.id === reserva.id)) {
      cliente.reservas.push(reserva);
      // Agregar pago simulado
      const pagoSimulado = {
        id: `pago${reserva.id}`,
        reservaId: reserva.id,
        mesaId: reserva.mesaId,
        monto: 50, // Pago simulado de $50 por reserva
        fecha: reserva.dia,
        metodo: "Efectivo", // Simulado
      };
      cliente.pagos = cliente.pagos || [];
      cliente.pagos.push(pagoSimulado);
      cliente.totalPagos += pagoSimulado.monto;
    }
  });

  // Guardar clientes actualizados
  localStorage.setItem(
    "clientesRestaurante",
    JSON.stringify(clientesExistentes)
  );
}

function agregarCliente() {
  const cliente = {
    id: `cliente${clientes.value.length + 1}`,
    nombre: newClient.value.nombre,
    email: newClient.value.email,
    telefono: newClient.value.telefono,
    reservas: [],
    pagos: [],
    totalPagos: 0,
  };
  clientes.value.push(cliente);
  guardarClientes();
  showAddModal.value = false;
  newClient.value = { nombre: "", email: "", telefono: "" };
}

function confirmarEliminarCliente(cliente) {
  clienteAEliminar.value = cliente;
  showDeleteModal.value = true;
}

function eliminarCliente() {
  if (clienteAEliminar.value) {
    clientes.value = clientes.value.filter(
      (c) => c.id !== clienteAEliminar.value.id
    );
    guardarClientes();
    showDeleteModal.value = false;
    clienteAEliminar.value = null;
  }
}

function verDetallesCliente(cliente) {
  clienteSeleccionado.value = cliente;
  showDetailsModal.value = true;
}

// === Se calculan las propiedades ===
const mesasCliente = computed(() => {
  if (!clienteSeleccionado.value) return [];
  const mesaIds = clienteSeleccionado.value.reservas.map((r) => r.mesaId);
  return mesas.value.filter((m) => mesaIds.includes(m.id));
});

const pagosCliente = computed(() => {
  return clienteSeleccionado.value?.pagos || [];
});

// === Ciclo de Vida ===
onMounted(() => {
  inicializarClientes();
  cargarDatos();
});
</script>

<style scoped>
@import "../style.css";

.header-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-client-btn,
.refresh-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.add-client-btn:hover,
.refresh-btn:hover {
  background-color: #0056b3;
}

.clients-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.client-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.client-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.client-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.client-header h3 {
  margin: 0;
  color: #333;
}

.client-id {
  font-size: 12px;
  color: #666;
  background-color: #f8f9fa;
  padding: 2px 6px;
  border-radius: 3px;
}

.client-summary {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.summary-item {
  font-size: 14px;
  color: #555;
}

.details-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

.details-btn:hover {
  background-color: #218838;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
}

.delete-btn:hover {
  background-color: #c82333;
}

.warning {
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  padding: 12px;
  border-radius: 4px;
  margin: 15px 0;
  font-size: 14px;
}

.delete-confirm-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-confirm-btn:hover {
  background-color: #c82333;
}

.no-clients {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px;
  grid-column: 1 / -1;
}

/* Estilos modales */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 800px;
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.form-actions button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.form-actions button[type="submit"] {
  background-color: #007bff;
  color: white;
}

.client-details {
  margin-top: 20px;
}

.details-section {
  margin-bottom: 30px;
}

.details-section h3 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
  margin-bottom: 15px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.info-item {
  padding: 8px;
  background-color: #f8f9fa;
  border-radius: 4px;
  font-size: 14px;
}

.reservations-list,
.tables-list,
.payments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reservation-item,
.table-item,
.payment-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: #f9f9f9;
}

.reservation-header,
.table-header,
.payment-header {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.reservation-details,
.table-details,
.payment-details {
  font-size: 14px;
  color: #555;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.placeholder {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
