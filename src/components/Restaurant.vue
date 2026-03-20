<template>
  <div class="container py-3">
    <div v-if="props.subView === 'mesas'" class="mesas-view">
      <div class="main-layout">
        <!-- Sidebar -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3 class="sidebar-title">UBICACIONES</h3>
            <div class="location-filters">
              <button
                class="location-filter-btn"
                :class="{ active: selectedLocation === 'all' }"
                @click="selectedLocation = 'all'"
              >
                <i class="fas fa-th-large"></i> Todas
              </button>
              <button
                v-for="location in mappedUbicaciones"
                :key="location.name"
                class="location-filter-btn"
                :class="{ active: selectedLocation === location.name }"
                @click="selectedLocation = location.name"
              >
                <i :class="location.icon"></i> {{ location.name }}
              </button>
            </div>
          </div>

          <div class="sidebar-section capacity-section">
            <h3 class="sidebar-title">CAPACIDAD TOTAL</h3>
            <div class="capacity-info">
              <span class="capacity-text">
                <span class="count">{{ currentOccupancy }}</span> / {{ totalCapacity }} personas
              </span>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: capacityPercentage + '%' }"></div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="content-area">
          <div class="content-header">
            <div class="header-info">
              <h1 class="page-title">Gestión de Mesas</h1>
              <p class="page-subtitle">Control de disponibilidad y asignación en tiempo real.</p>
            </div>
            <div class="header-actions">
              <button class="action-btn btn-add" @click="showAddModal = true">
                <i class="fas fa-plus"></i> AGREGAR
              </button>
              <button class="action-btn btn-reserve" @click="showSelectModal = true">
                <i class="fas fa-calendar-check"></i> RESERVAR
              </button>
              <button class="action-btn btn-reservations" @click="showReservationsModal = true">
                <i class="fas fa-book"></i> RESERVAS
                <span v-if="reservasActivas.length > 0" class="badge">{{ reservasActivas.length }}</span>
              </button>
            </div>
          </div>

          <!-- Stats Bar -->
          <div class="stats-bar">
            <div class="stat-card disponible">
              <div class="stat-content">
                <span class="stat-label">DISPONIBLE</span>
                <span class="stat-value">{{ countByState('disponible') }}</span>
              </div>
              <div class="stat-icon-wrapper">
                <i class="fas fa-check"></i>
              </div>
            </div>
            <div class="stat-card reservada">
              <div class="stat-content">
                <span class="stat-label">RESERVADA</span>
                <span class="stat-value">{{ countByState('reservada') }}</span>
              </div>
              <div class="stat-icon-wrapper">
                <i class="fas fa-bookmark"></i>
              </div>
            </div>
            <div class="stat-card ocupada">
              <div class="stat-content">
                <span class="stat-label">OCUPADA</span>
                <span class="stat-value">{{ countByState('ocupada') }}</span>
              </div>
              <div class="stat-icon-wrapper">
                <i class="fas fa-utensils"></i>
              </div>
            </div>
            <div class="stat-card deshabilitada">
              <div class="stat-content">
                <span class="stat-label">DESHABILITADA</span>
                <span class="stat-value">{{ countByState('deshabilitada') }}</span>
              </div>
              <div class="stat-icon-wrapper">
                <i class="fas fa-ban"></i>
              </div>
            </div>
          </div>

          <div class="table-grid">
            <div
              v-for="mesa in filteredAndSearchedMesas"
              :key="mesa.id"
              class="table-card"
              :class="mesa.estado"
            >
              <div class="card-header">
                <div class="table-title">
                  <span class="label">MESA</span>
                  <span class="id">{{ mesa.id.replace('mesa', '') }}</span>
                </div>
                <div class="status-badge" :class="mesa.estado">
                  {{ mesa.estado.toUpperCase() }}
                </div>
              </div>

              <div class="card-body">
                <div class="info-row">
                  <i class="fas fa-user"></i>
                  <span>Capacidad: {{ mesa.capacidad }}</span>
                </div>
                <div class="info-row">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ mesa.ubicacion }}</span>
                </div>
              </div>

              <div class="card-footer">
                <select
                  v-model="mesa.estado"
                  @change="guardarMesasDebounced"
                  class="status-dropdown"
                >
                  <option value="disponible">Disponible</option>
                  <option value="reservada">Reservada</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="deshabilitada">Deshabilitada</option>
                </select>
                <div class="card-actions">
                  <button class="btn-action btn-delete" @click="eliminarMesa(mesa.id)">
                    <i class="fas fa-times"></i>
                  </button>
                  <button class="btn-action btn-edit" @click="abrirReserva(mesa)">
                    <i class="fas fa-pen"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <div v-else-if="props.subView === 'mostrador'" class="mostrador-view">
      <h1>Mostrador</h1>
      <p>Contenido del mostrador...</p>
    </div>

    <div v-else-if="props.subView === 'domicilio'" class="domicilio-view">
      <h1>Domicilio</h1>
      <p>Contenido del domicilio...</p>
    </div>

    <div v-else-if="props.subView === 'mostraplus'" class="mostraplus-view">
      <h1>MostraPlus</h1>
      <p>Contenido de MostraPlus...</p>
    </div>

    <!-- MODALES -->
    <!-- Add Table Modal -->
    <div v-if="showAddModal" class="modal" @click.self="showAddModal = false">
      <div class="modal-content">
        <span class="close" @click="showAddModal = false">&times;</span>
        <h2>Agregar Nueva Mesa</h2>
        <form @submit.prevent="agregarMesa">
          <div class="form-group">
            <label for="table-capacity">Capacidad:</label>
            <input
              type="number"
              id="table-capacity"
              v-model="newTable.capacity"
              min="1"
              max="20"
              required
            />
          </div>
          <div class="form-group">
            <label for="table-location">Ubicación:</label>
            <select id="table-location" v-model="newTable.location" required>
              <option value="">Seleccionar ubicación...</option>
              <option v-for="loc in ubicaciones" :key="loc" :value="loc">{{ loc }}</option>
            </select>
          </div>
          <div class="form-actions">
            <button type="button" @click="showAddModal = false">
              Cancelar
            </button>
            <button type="submit">Agregar Mesa</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Reserve Modal -->
    <div
      v-if="showReserveModal"
      class="modal"
      @click.self="showReserveModal = false"
    >
      <div class="modal-content large-modal">
        <span class="close" @click="showReserveModal = false">&times;</span>
        <h2>Reservar Mesa</h2>
        <form @submit.prevent="crearReserva">
          <div class="form-row">
            <div class="form-group">
              <label for="reserve-name">Nombre:</label>
              <input
                type="text"
                id="reserve-name"
                v-model="reservation.name"
                required
              />
            </div>
            <div class="form-group">
              <label for="reserve-email">Email:</label>
              <input
                type="email"
                id="reserve-email"
                v-model="reservation.email"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="reserve-phone">Teléfono:</label>
              <input
                type="tel"
                id="reserve-phone"
                v-model="reservation.phone"
                required
              />
            </div>
            <div class="form-group">
              <label for="reserve-id">ID del Cliente:</label>
              <input
                type="text"
                id="reserve-id"
                v-model="reservation.clientId"
                placeholder="Se generará automáticamente"
                readonly
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="reserve-day">Día:</label>
              <input
                type="date"
                id="reserve-day"
                v-model="reservation.day"
                :min="today"
                required
              />
            </div>
            <div class="form-group">
              <label for="reserve-time">Hora:</label>
              <input
                type="time"
                id="reserve-time"
                v-model="reservation.time"
                required
              />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="reserve-location">Lugar:</label>
              <select
                id="reserve-location"
                v-model="reservation.location"
                required
              >
                <option value="">Seleccionar lugar...</option>
                <option v-for="loc in ubicaciones" :key="loc" :value="loc">{{ loc }}</option>
              </select>
            </div>
            <div class="form-group">
              <label for="reserve-payment">Forma de Pago:</label>
              <select
                id="reserve-payment"
                v-model="reservation.paymentMethod"
                required
              >
                <option value="">Seleccionar método...</option>
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Tarjeta de Crédito">
                  💳 Tarjeta de Crédito
                </option>
                <option value="Tarjeta de Débito">💳 Tarjeta de Débito</option>
                <option value="Transferencia">🏦 Transferencia</option>
                <option value="Cheque">📄 Cheque</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label for="reserve-occasion">Tipo de Reserva:</label>
            <select
              id="reserve-occasion"
              v-model="reservation.occasion"
              required
            >
              <option value="">Seleccionar ocasión...</option>
              <option value="Cumpleaños">🎂 Cumpleaños</option>
              <option value="Aniversario">💍 Aniversario</option>
              <option value="Graduación">🎓 Graduación</option>
              <option value="Reunión Familiar">👨‍👩‍👧‍👦 Reunión Familiar</option>
              <option value="Cena de Negocios">💼 Cena de Negocios</option>
              <option value="Compromiso">💑 Compromiso</option>
              <option value="Amigos">👥 Amigos</option>
            </select>
          </div>
          <div class="form-group">
            <label for="reserve-notes">Notas Adicionales:</label>
            <textarea
              id="reserve-notes"
              v-model="reservation.notes"
              rows="4"
              placeholder="Información adicional sobre la reserva..."
              class="notes-textarea"
            ></textarea>
          </div>
          <div class="form-actions">
            <button type="button" @click="showReserveModal = false">
              Cancelar
            </button>
            <button type="submit">Reservar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Select Table Modal -->
    <div
      v-if="showSelectModal"
      class="modal"
      @click.self="showSelectModal = false"
    >
      <div class="modal-content large-modal">
        <span class="close" @click="showSelectModal = false">&times;</span>
        <h2>📅 Seleccionar Mesa para Reservar</h2>
        <div class="available-tables-list">
          <div v-if="mesasDisponibles.length === 0" class="no-tables">
            <p>No hay mesas disponibles para reservar en este momento.</p>
          </div>
          <div
            v-for="mesa in mesasDisponibles"
            :key="mesa.id"
            v-memo="[mesa.id, mesa.capacidad, mesa.ubicacion]"
            class="available-table-card"
            @click="abrirReserva(mesa)"
          >
            <div class="available-table-header">
              <div class="available-table-id">{{ mesa.id.toUpperCase() }}</div>
            </div>
            <div class="available-table-info">
              <div class="available-table-info-item">
                <strong>Capacidad:</strong> {{ mesa.capacidad }} personas
              </div>
              <div class="available-table-info-item">
                <strong>Ubicación:</strong> {{ mesa.ubicacion }}
              </div>
            </div>
            <button class="select-table-btn" @click.stop="abrirReserva(mesa)">
              Seleccionar Mesa
            </button>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showSelectModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Locations Modal -->
    <div
      v-if="showLocationsModal"
      class="modal"
      @click.self="showLocationsModal = false"
    >
      <div class="modal-content large-modal">
        <span class="close" @click="showLocationsModal = false">&times;</span>
        <h2>📍 Ubicaciones del Restaurante</h2>
        <div class="locations-container">
          <div
            v-for="location in ubicaciones"
            :key="location"
            class="location-section"
          >
            <h3 class="location-title">{{ location }}</h3>
            <div class="location-tables">
              <div
                v-if="getTablesByLocation(location).length === 0"
                class="no-tables-location"
              >
                <p>No hay mesas en esta ubicación.</p>
              </div>
              <div
                v-for="mesa in getTablesByLocation(location)"
                :key="mesa.id"
                v-memo="[mesa.estado, mesa.capacidad]"
                class="location-table-card"
                :class="mesa.estado"
              >
                <div class="location-table-header">
                  <div class="location-table-id">
                    {{ mesa.id.toUpperCase() }}
                  </div>
                </div>
                <div class="location-table-info">
                  <div class="location-table-info-item">
                    <strong>Capacidad:</strong> {{ mesa.capacidad }} personas
                  </div>
                  <div class="location-table-info-item">
                    <strong>Estado:</strong>
                    {{
                      mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1)
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showLocationsModal = false">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Reservations Modal -->
    <div
      v-if="showReservationsModal"
      class="modal"
      @click.self="showReservationsModal = false"
    >
      <div class="modal-content large-modal">
        <span class="close" @click="showReservationsModal = false"
          >&times;</span
        >
        <h2>📋 Reservas Activas</h2>
        <div class="reservations-list">
          <div v-if="reservasActivas.length === 0" class="no-reservations">
            <p>No hay reservas activas en este momento.</p>
          </div>
          <div
            v-for="res in reservasActivas"
            :key="res.id"
            v-memo="[res.id, res.estado, res.nombre, res.mesaId]"
            class="reservation-card"
          >
            <div class="reservation-header">
              <h3>{{ res.id }}</h3>
              <span
                class="reservation-status"
                :class="getReservationStatusClass(res)"
                >{{ getReservationStatusText(res) }}</span
              >
            </div>
            <div class="reservation-info">
              <div class="info-item">
                <strong>Cliente:</strong> {{ res.nombre }}
              </div>
              <div class="info-item">
                <strong>Mesa:</strong> {{ res.mesaId.toUpperCase() }}
              </div>
              <div class="info-item"><strong>Fecha:</strong> {{ res.dia }}</div>
              <div class="info-item"><strong>Hora:</strong> {{ res.hora }}</div>
              <div class="info-item">
                <strong>Lugar:</strong> {{ res.lugar }}
              </div>
              <div class="info-item">
                <strong>Ocasion:</strong> {{ res.ocasion }}
              </div>
              <div v-if="getTableById(res.mesaId)" class="info-item">
                <strong>Capacidad:</strong>
                {{ getTableById(res.mesaId).capacidad }} personas
              </div>
              <div v-if="getTableById(res.mesaId)" class="info-item">
                <strong>Ubicación:</strong>
                {{ getTableById(res.mesaId).ubicacion }}
              </div>
            </div>
            <div class="reservation-actions">
              <button
                class="delete-reservation-btn"
                @click="eliminarReserva(res.id)"
              >
                🗑️ Eliminar Reserva
              </button>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="showReservationsModal = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useSettings } from "../composables/useSettings";

const { settings } = useSettings();

// Estados posibles de mesas
const MESA_DISPONIBLE = "disponible";

const props = defineProps({
  subView: {
    type: String,
    default: "mesas",
  },
  searchQuery: {
    type: String,
    default: "",
  },
});

// === Estado ===
const mesas = ref([]);
const reservas = ref([]);

// Debounce timer for saving
let saveTimeout = null;

const mesaSeleccionada = ref(null);
const showAddModal = ref(false);
const showReserveModal = ref(false);
const showSelectModal = ref(false);
const showReservationsModal = ref(false);
const showLocationsModal = ref(false);
const selectedLocation = ref("all");

const mappedUbicaciones = computed(() => [
  { name: "Terraza", icon: "fas fa-umbrella-beach" },
  { name: "Salón Principal", icon: "fas fa-couch" },
  { name: "Barra", icon: "fas fa-glass-martini-alt" },
  { name: "VIP Privado", icon: "fas fa-star" },
]);

const newTable = ref({
  capacity: "",
  location: "",
});

const reservation = ref({
  name: "",
  email: "",
  phone: "",
  clientId: "",
  day: "",
  time: "",
  location: "",
  occasion: "",
  paymentMethod: "",
  notes: "",
});

const today = computed(() => {
  const date = new Date();
  return date.toISOString().split("T")[0];
});

const ubicaciones = computed(() => [
  "Terraza",
  "Salón Principal",
  "Barra",
  "VIP Privado",
]);

// === Funciones de persistencia ===
function inicializarMesas() {
  if (!localStorage.getItem("mesasRestaurante")) {
    const mesasIniciales = [
      { id: "mesa1", capacidad: 4, ubicacion: "Terraza", estado: "disponible" },
      { id: "mesa2", capacidad: 2, ubicacion: "Barra", estado: "ocupada" },
      { id: "mesa3", capacidad: 6, ubicacion: "Terraza", estado: "reservada" },
      { id: "mesa4", capacidad: 4, ubicacion: "Terraza", estado: "deshabilitada" },
      { id: "mesa5", capacidad: 8, ubicacion: "VIP Privado", estado: "disponible" },
      { id: "mesa6", capacidad: 4, ubicacion: "Salón Principal", estado: "disponible" },
    ];
    localStorage.setItem("mesasRestaurante", JSON.stringify(mesasIniciales));
  }

  if (!localStorage.getItem("reservasRestaurante")) {
    localStorage.setItem("reservasRestaurante", JSON.stringify([]));
  }
}

function obtenerMesas() {
  const data = localStorage.getItem("mesasRestaurante");
  return data ? JSON.parse(data) : [];
}

function guardarMesas() {
  localStorage.setItem("mesasRestaurante", JSON.stringify(mesas.value));
}

// Debounced version for frequent updates (like status changes)
function guardarMesasDebounced() {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    guardarMesas();
  }, 300); // Wait 300ms after last change
}

function obtenerReservas() {
  const data = localStorage.getItem("reservasRestaurante");
  return data ? JSON.parse(data) : [];
}

function guardarReservas() {
  localStorage.setItem("reservasRestaurante", JSON.stringify(reservas.value));
}

// === CRUD de mesas ===
function agregarMesa() {
  const nueva = {
    capacidad: parseInt(newTable.value.capacity),
    ubicacion: newTable.value.location,
  };
  nueva.id = `mesa${mesas.value.length + 1}`;
  nueva.estado = "disponible";
  mesas.value.push(nueva);
  guardarMesas();
  showAddModal.value = false;
  newTable.value = { capacity: "", location: "" };
}

function eliminarMesa(id) {
  mesas.value = mesas.value.filter((m) => m.id !== id);
  guardarMesas();
}

function abrirReserva(mesa) {
  mesaSeleccionada.value = mesa;
  showReserveModal.value = true;
  showSelectModal.value = false;
}

// === Reservas ===
function crearReserva() {
  // Generar ID del cliente si no existe
  let clientId = reservation.value.clientId;
  if (!clientId) {
    const existingClients = JSON.parse(
      localStorage.getItem("clientesRestaurante") || "[]"
    );
    const existingClient = existingClients.find(
      (c) =>
        c.nombre === reservation.value.name &&
        c.email === reservation.value.email
    );
    if (existingClient) {
      clientId = existingClient.id;
    } else {
      clientId = `cliente${existingClients.length + 1}`;
    }
  }

  const nuevaReserva = {
    id: `reserva${reservas.value.length + 1}`,
    nombre: reservation.value.name,
    email: reservation.value.email,
    telefono: reservation.value.phone,
    clientId: clientId,
    dia: reservation.value.day,
    hora: reservation.value.time,
    lugar: reservation.value.location,
    ocasion: reservation.value.occasion,
    formaPago: reservation.value.paymentMethod,
    notas: reservation.value.notes,
    mesaId: mesaSeleccionada.value.id,
    estado: "activa",
    fechaCreacion: new Date().toISOString(),
  };

  reservas.value.push(nuevaReserva);

  // Cambiar mesa a reservada
  const mesa = mesas.value.find((m) => m.id === nuevaReserva.mesaId);
  if (mesa) mesa.estado = "reservada";

  // Crear o actualizar cliente automáticamente
  actualizarClienteDesdeReserva(nuevaReserva);

  // Play sound if enabled
  if (settings.notifications?.newOrderSound) {
    // Audio simulation - in real app would be new Audio('/sound.mp3').play()
    console.log("🔊 Ping! New Reservation Sound");
  }

  // Guardar cambios en localStorage
  guardarReservas();
  guardarMesas();

  showReserveModal.value = false;
  reservation.value = {
    name: "",
    email: "",
    phone: "",
    clientId: "",
    day: "",
    time: "",
    location: "",
    occasion: "",
    paymentMethod: "",
    notes: "",
  };
}

function actualizarClienteDesdeReserva(reserva) {
  const existingClients = JSON.parse(
    localStorage.getItem("clientesRestaurante") || "[]"
  );
  let cliente = existingClients.find((c) => c.id === reserva.clientId);

  if (!cliente) {
    // Crear nuevo cliente
    cliente = {
      id: reserva.clientId,
      nombre: reserva.nombre,
      email: reserva.email,
      telefono: reserva.telefono,
      reservas: [],
      pagos: [],
      totalPagos: 0,
      fechaRegistro: new Date().toISOString(),
    };
    existingClients.push(cliente);
  } else {
    // Actualizar información del cliente existente
    cliente.nombre = reserva.nombre;
    cliente.email = reserva.email;
    cliente.telefono = reserva.telefono;
  }

  // Agregar reserva al cliente si no existe
  if (!cliente.reservas.find((r) => r.id === reserva.id)) {
    cliente.reservas.push({
      id: reserva.id,
      dia: reserva.dia,
      hora: reserva.hora,
      lugar: reserva.lugar,
      ocasion: reserva.ocasion,
      mesaId: reserva.mesaId,
      estado: reserva.estado,
      formaPago: reserva.formaPago,
      notas: reserva.notas,
      fechaCreacion: reserva.fechaCreacion,
    });

    // Crear registro de pago
    const pago = {
      id: `pago${reserva.id}`,
      reservaId: reserva.id,
      mesaId: reserva.mesaId,
      monto: calcularMontoReserva(reserva),
      fecha: reserva.dia,
      metodo: reserva.formaPago,
      fechaRegistro: new Date().toISOString(),
    };

    cliente.pagos.push(pago);
    cliente.totalPagos += pago.monto;
  }

  localStorage.setItem("clientesRestaurante", JSON.stringify(existingClients));
}

function calcularMontoReserva(reserva) {
  // Lógica simple de cálculo de monto basado en la mesa y ocasión
  const mesa = mesas.value.find((m) => m.id === reserva.mesaId);
  let baseAmount = 50; // Monto base

  if (mesa) {
    baseAmount += mesa.capacidad * 10; // $10 por persona
  }

  // Aumentar por ocasiones especiales
  if (reserva.ocasion === "Cumpleaños" || reserva.ocasion === "Aniversario") {
    baseAmount += 20;
  }

  return baseAmount;
}

function eliminarReserva(id) {
  const reserva = reservas.value.find((r) => r.id === id);
  if (!reserva) return;

  // Liberar mesa
  const mesa = mesas.value.find((m) => m.id === reserva.mesaId);
  if (mesa) mesa.estado = "disponible";

  // Eliminar reserva del cliente
  const existingClients = JSON.parse(
    localStorage.getItem("clientesRestaurante") || "[]"
  );
  const cliente = existingClients.find((c) => c.id === reserva.clientId);
  if (cliente) {
    cliente.reservas = cliente.reservas.filter((r) => r.id !== id);
    cliente.pagos = cliente.pagos.filter((p) => p.reservaId !== id);
    cliente.totalPagos = cliente.pagos.reduce(
      (total, pago) => total + pago.monto,
      0
    );
  }
  localStorage.setItem("clientesRestaurante", JSON.stringify(existingClients));

  reservas.value = reservas.value.filter((r) => r.id !== id);
  guardarMesas();
  guardarReservas();
}

const mesasDisponibles = computed(() =>
  mesas.value.filter((m) => m.estado === "disponible")
);

const reservasActivas = computed(() =>
  reservas.value.filter((r) => r.estado === "activa")
);

// Optimized: Use computed for stats to avoid recalculation
const estadisticas = computed(() => {
  const stats = {
    disponible: 0,
    reservada: 0,
    ocupada: 0,
    deshabilitada: 0,
  };
  mesas.value.forEach((mesa) => {
    if (stats[mesa.estado] !== undefined) {
      stats[mesa.estado]++;
    }
  });
  return stats;
});

function countByState(estado) {
  return estadisticas.value[estado] || 0;
}

function getTableById(id) {
  return mesas.value.find((m) => m.id === id);
}

function getReservationStatusClass(res) {
  return res.estado === "activa" ? "active" : "inactive";
}

function getReservationStatusText(res) {
  return res.estado === "activa" ? "Activa" : "Inactiva";
}

function countTablesByLocation(location) {
  return mesas.value.filter((mesa) => mesa.ubicacion === location).length;
}

function getTablesByLocation(location) {
  return mesas.value.filter((mesa) => mesa.ubicacion === location);
}

const filteredAndSearchedMesas = computed(() => {
  let result = mesas.value;

  if (selectedLocation.value !== "all") {
    result = result.filter((m) => m.ubicacion === selectedLocation.value);
  }

  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase();
    result = result.filter(
      (m) =>
        m.id.toLowerCase().includes(q) || m.ubicacion.toLowerCase().includes(q)
    );
  }

  return result;
});

const totalCapacity = computed(() => {
  return mesas.value.reduce((total, m) => total + m.capacidad, 0);
});

const currentOccupancy = computed(() => {
  return mesas.value
    .filter((m) => m.estado === "ocupada" || m.estado === "reservada")
    .reduce((total, m) => total + m.capacidad, 0);
});

const capacityPercentage = computed(() => {
  if (totalCapacity.value === 0) return 0;
  return (currentOccupancy.value / totalCapacity.value) * 100;
});

// === Ciclo de vida ===
onMounted(() => {
  inicializarMesas();
  mesas.value = obtenerMesas();
  reservas.value = obtenerReservas();
});

// Removed deep watchers that cause performance issues
// Now saving is done manually in each function that modifies data
</script>

<style scoped>
@import "../style.css";

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  padding-top: 114px;
  min-height: calc(100vh - 56px);
}

.main-layout {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

/* Sidebar Styling */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: fixed;
  top: 114px;
  bottom: 1.5rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

/* Custom scrollbar for sidebar */
.sidebar::-webkit-scrollbar {
  width: 4px;
}
.sidebar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 4px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.1em;
  margin: 0;
  padding-left: 0.5rem;
}

.location-filters {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-filter-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  border: 2px solid transparent;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.location-filter-btn i {
  width: 20px;
  text-align: center;
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.location-filter-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
  transform: translateX(4px);
}

.location-filter-btn.active {
  background: #fff;
  border-color: #3b82f6;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.location-filter-btn.active i {
  transform: scale(1.1);
}

/* Capacity Indicator */
.capacity-info {
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.capacity-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.capacity-text .count {
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
}

.progress-bar {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

/* Content Area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 240px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  position: sticky;
  top: 114px;
  background: #f8fafc;
  z-index: 10;
  padding: 0.25rem 0 0.75rem 0;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  color: #64748b;
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  letter-spacing: 0.02em;
}

.btn-add {
  background: #059669;
  color: white;
}

.btn-add:hover {
  background: #047857;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.2);
}

.btn-reserve {
  background: #2563eb;
  color: white;
}

.btn-reserve:hover {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.btn-reservations {
  background: #78350f;
  color: white;
}

.btn-reservations:hover {
  background: #451a03;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(120, 53, 15, 0.2);
}

.btn-reservations .badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Stats Bar */
.stats-bar {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  position: sticky;
  top: 175px; /* Adjusted to sit below content-header */
  background: #f8fafc;
  z-index: 9;
  padding-bottom: 0.75rem;
}

.stat-card {
  background: #fff;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-width: 0 0 0 4px;
  border-style: solid;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-card.disponible { border-color: #10b981; }
.stat-card.reservada { border-color: #3b82f6; }
.stat-card.ocupada { border-color: #f59e0b; }
.stat-card.deshabilitada { border-color: #ef4444; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.stat-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.stat-card.disponible .stat-icon-wrapper { background: #ecfdf5; color: #10b981; }
.stat-card.reservada .stat-icon-wrapper { background: #eff6ff; color: #3b82f6; }
.stat-card.ocupada .stat-icon-wrapper { background: #fffbeb; color: #f59e0b; }
.stat-card.deshabilitada .stat-icon-wrapper { background: #fef2f2; color: #ef4444; }

/* Search Bar */
.search-bar-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -0.5rem;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 320px;
}

.search-input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 0.55rem 1rem 0.55rem 2.4rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.05);
}

/* Grid & Cards */
.table-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
}

.table-card {
  background: white;
  border-radius: 12px;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.table-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-title {
  display: flex;
  flex-direction: column;
}

.table-title .label {
  font-size: 0.6rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.table-title .id {
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
}

.status-badge.disponible { background: #ecfdf5; color: #10b981; }
.status-badge.reservada { background: #eff6ff; color: #3b82f6; }
.status-badge.ocupada { background: #fff7ed; color: #f97316; }
.status-badge.deshabilitada { background: #fef2f2; color: #ef4444; }

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
}

.info-row i {
  color: #94a3b8;
  width: 14px;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;
}

.status-dropdown {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  flex: 1;
  padding: 0.45rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete { background: #fee2e2; color: #ef4444; }
.btn-delete:hover { background: #fecaca; }

.btn-edit { background: #dbeafe; color: #2563eb; }
.btn-edit:hover { background: #bfdbfe; }

/* Modal Adjustments */
.modal-content {
  border-radius: 24px;
  border: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.form-group label {
  color: #64748b;
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.form-group input, .form-group select, .form-group textarea {
  border-radius: 12px;
  border: 2px solid #f1f5f9;
  background: #f8fafc;
}

.form-group input:focus, .form-group select:focus {
  border-color: #3b82f6;
  background: #fff;
}

/* Responsive Customization */
@media (max-width: 1200px) {
  .sidebar { width: 220px; }
  .content-area { margin-left: 240px; }
  .stats-bar { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .container { padding-top: 180px; }
  .main-layout { flex-direction: column; }
  .sidebar { position: static; width: 100%; height: auto; margin-bottom: 2rem; border-right: none; }
  .content-area { margin-left: 0; }
  .location-filters { flex-direction: row; overflow-x: auto; padding-bottom: 0.5rem; gap: 0.5rem; }
  .location-filter-btn { white-space: nowrap; flex-shrink: 0; }
  .content-header { flex-direction: column; align-items: stretch; gap: 1rem; position: static; }
  .header-actions { flex-direction: row; flex-wrap: wrap; }
}

@media (max-width: 480px) {
  .stats-bar { grid-template-columns: 1fr; }
  .table-grid { grid-template-columns: 1fr; }
}
</style>
