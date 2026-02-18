<template>
  <div class="container py-3">
    <div v-if="props.subView === 'mesas'" class="mesas-view">
      <div class="header-container">
        <h1>Gestión de Mesas</h1>
        <div class="header-buttons">
          <button class="add-table-btn" @click="showAddModal = true">
            <i class="fas fa-plus"></i> Agregar
          </button>
          <button class="reserve-table-btn" @click="showSelectModal = true">
            <i class="fas fa-calendar-check"></i> Reservar
          </button>
          <button
            class="view-reservations-btn"
            @click="showReservationsModal = true"
          >
            <i class="fas fa-list"></i> Reservas
            <span class="reservations-badge" id="reservations-badge">{{
              reservasActivas.length
            }}</span>
          </button>
        </div>
      </div>

      <div class="mesas-layout">
        <div class="locations-sidebar">
          <h3>Ubicaciones</h3>
          <button
            class="location-btn"
            :class="{ active: selectedLocation === 'all' }"
            @click="selectedLocation = 'all'"
          >
            Todas
          </button>
          <button
            v-for="location in ubicaciones"
            :key="location"
            class="location-btn"
            :class="{ active: selectedLocation === location }"
            @click="selectedLocation = location"
          >
            {{ location }}
          </button>
        </div>

        <div class="tables-main">
          <div class="stats">
            <div
              class="stat-item"
              v-for="estado in [
                'disponible',
                'reservada',
                'ocupada',
                'deshabilitada',
              ]"
              :key="estado"
            >
              <div class="stat-number">{{ countByState(estado) }}</div>
              <div class="stat-label">
                {{ estado.charAt(0).toUpperCase() + estado.slice(1) }}
              </div>
            </div>
          </div>

          <h2>
            Mesas en
            {{
              selectedLocation === "all"
                ? "Todas las Ubicaciones"
                : selectedLocation
            }}
          </h2>
          <div class="table-grid">
            <div
              v-for="mesa in filteredMesas"
              :key="mesa.id"
              v-memo="[mesa.estado, mesa.capacidad, mesa.ubicacion]"
              class="table-card"
              :class="mesa.estado"
            >
              <div class="table-header">
                <div class="table-id">{{ mesa.id.toUpperCase() }}</div>
              </div>
              <div class="table-info">
                <span><i class="fas fa-users"></i> {{ mesa.capacidad }}</span>
                <span
                  ><i class="fas fa-map-marker-alt"></i>
                  {{ mesa.ubicacion }}</span
                >
              </div>
              <select
                v-model="mesa.estado"
                @change="guardarMesasDebounced"
                class="status-select"
              >
                <option value="disponible">Disponible</option>
                <option value="reservada">Reservada</option>
                <option value="ocupada">Ocupada</option>
                <option value="deshabilitada">Deshabilitada</option>
              </select>
              <div
                class="card-actions"
                style="display: flex; gap: 0.5rem; margin-top: auto"
              >
                <button
                  class="delete-btn"
                  style="flex: 1"
                  @click="eliminarMesa(mesa.id)"
                >
                  <i class="fas fa-trash"></i>
                </button>
                <button
                  v-if="mesa.estado === 'disponible'"
                  class="reserve-btn"
                  style="flex: 1"
                  @click="abrirReserva(mesa)"
                >
                  <i class="fas fa-calendar-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
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
              <option value="Ventana">Ventana</option>
              <option value="Jardín">Jardín</option>
              <option value="Interior">Interior</option>
              <option value="Terraza">Terraza</option>
              <option value="VIP">VIP</option>
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
                <option value="Ventana">Ventana</option>
                <option value="Jardín">Jardín</option>
                <option value="Interior">Interior</option>
                <option value="Terraza">Terraza</option>
                <option value="VIP">VIP</option>
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
  "Ventana",
  "Jardín",
  "Interior",
  "Terraza",
  "VIP",
]);

// === Funciones de persistencia ===
function inicializarMesas() {
  if (!localStorage.getItem("mesasRestaurante")) {
    const mesasIniciales = [
      { id: "mesa1", capacidad: 2, ubicacion: "Ventana", estado: "disponible" },
      { id: "mesa2", capacidad: 4, ubicacion: "Jardín", estado: "disponible" },
      {
        id: "mesa3",
        capacidad: 6,
        ubicacion: "Interior",
        estado: "disponible",
      },
      { id: "mesa4", capacidad: 2, ubicacion: "Ventana", estado: "disponible" },
      { id: "mesa5", capacidad: 4, ubicacion: "Terraza", estado: "disponible" },
      { id: "mesa6", capacidad: 8, ubicacion: "VIP", estado: "disponible" },
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

const filteredMesas = computed(() => {
  if (selectedLocation.value === "all") {
    return mesas.value;
  }
  return mesas.value.filter(
    (mesa) => mesa.ubicacion === selectedLocation.value
  );
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
  padding-top: 100px; /* Adjust to account for fixed navbar and sub-nav */
}

.mesas-layout {
  display: flex;
  gap: 2rem;
}

.locations-sidebar {
  width: 250px;
  background: var(--bg-input);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.locations-sidebar h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.location-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.location-btn:hover {
  background: var(--bg-hover);
}

.location-btn.active {
  background: #3182ce;
  color: white;
  border-color: #3182ce;
}

.tables-main {
  flex: 1;
}

/* Estilos para el textarea de notas */
.notes-textarea {
  resize: vertical;
  min-height: 100px;
  width: 100%;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  padding: 12px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-input);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.notes-textarea:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  background-color: var(--bg-card);
}

/* ========== RESPONSIVE DESIGN ========== */

/* Tablet and below */
@media (max-width: 1024px) {
  .container {
    padding-top: 90px;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .mesas-layout {
    gap: 1.5rem;
  }

  .locations-sidebar {
    width: 200px;
  }

  .header-buttons {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .add-table-btn,
  .reserve-table-btn,
  .view-reservations-btn {
    font-size: 0.9rem;
    padding: 0.65rem 1rem;
  }
}

/* Mobile landscape and tablet portrait */
@media (max-width: 768px) {
  .container {
    padding-top: 85px;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }

  .mesas-layout {
    flex-direction: column;
    gap: 1rem;
  }

  .locations-sidebar {
    width: 100%;
    padding: 0.75rem;
  }

  .location-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .header-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-container h1 {
    font-size: 1.5rem;
  }

  .header-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .stat-item {
    padding: 0.75rem;
  }

  .stat-number {
    font-size: 1.75rem;
  }

  .stat-label {
    font-size: 0.85rem;
  }

  .table-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .modal-content {
    width: 95%;
    max-width: 500px;
    padding: 1.5rem;
    margin: 1rem;
  }

  .large-modal {
    max-width: 95%;
  }

  .form-row {
    flex-direction: column;
  }

  .form-group {
    margin-bottom: 1rem;
  }
}

/* Mobile portrait */
@media (max-width: 600px) {
  .container {
    padding-top: 75px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .header-container h1 {
    font-size: 1.25rem;
  }

  .header-buttons {
    flex-direction: column;
    width: 100%;
  }

  .add-table-btn,
  .reserve-table-btn,
  .view-reservations-btn {
    width: 100%;
    justify-content: center;
    font-size: 0.85rem;
    padding: 0.75rem;
  }

  .reservations-badge {
    position: static;
    margin-left: 0.5rem;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }

  .stat-item {
    padding: 0.5rem;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .table-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .table-card {
    padding: 1rem;
  }

  .table-id {
    font-size: 1rem;
  }

  .table-info {
    font-size: 0.85rem;
  }

  .status-select {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .delete-btn,
  .reserve-btn {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .modal-content {
    width: 95%;
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 12px;
  }

  .modal-content h2 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .close {
    font-size: 1.75rem;
    top: 0.5rem;
    right: 0.75rem;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 0.9rem;
    padding: 0.65rem;
  }

  .modal-actions button {
    font-size: 0.9rem;
    padding: 0.65rem 1.25rem;
  }

  .available-table-card,
  .location-table-card,
  .reservation-card {
    padding: 0.75rem;
  }

  .available-table-id,
  .location-table-id {
    font-size: 0.95rem;
  }

  .available-table-info-item,
  .location-table-info-item,
  .info-item {
    font-size: 0.85rem;
  }

  .select-table-btn {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .delete-reservation-btn {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
  }
}

/* Extra small devices */
@media (max-width: 360px) {
  .container {
    padding-top: 70px;
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }

  .header-container h1 {
    font-size: 1.1rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .add-table-btn,
  .reserve-table-btn,
  .view-reservations-btn {
    font-size: 0.8rem;
    padding: 0.65rem;
  }

  .modal-content {
    padding: 0.75rem;
  }

  .modal-content h2 {
    font-size: 1.1rem;
  }
}
</style>
