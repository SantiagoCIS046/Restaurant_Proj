<template>
  <div class="registro-container">
    <div class="hero-section">
      <h1 class="hero-title">Registro de Mesas</h1>
      <p class="hero-subtitle">
        Gestiona el registro de mesas, clientes, pedidos y pagos durante el día.
      </p>
    </div>

    <!-- Filtro de fecha -->
    <div class="filter-section">
      <div class="date-filter">
        <label for="dateFilter" class="filter-label">Seleccionar Fecha:</label>
        <input
          type="date"
          id="dateFilter"
          v-model="selectedDate"
          class="date-input"
          @change="filterByDate"
        />
      </div>
    </div>

    <!-- Vista General -->
    <div v-if="currentView === 'overview'">
      <!-- Tabla General de Registros -->
      <div class="table-container">
        <table class="registro-table">
          <thead>
            <tr>
              <th>Mesa</th>
              <th>Cliente</th>
              <th>Pedido</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in registrosGenerales" :key="registro.id">
              <td>{{ registro.mesa }}</td>
              <td>{{ registro.cliente || "-" }}</td>
              <td>{{ registro.pedido || "-" }}</td>
              <td>{{ registro.monto ? "$" + registro.monto : "-" }}</td>
              <td>{{ registro.metodo || "-" }}</td>
              <td>{{ registro.hora }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Vista Detallada -->
    <div v-if="currentView === 'detailed'">
      <!-- Lista de mesas detallada -->
      <div class="mesas-grid">
        <div
          v-for="mesa in mesasFiltradas"
          :key="mesa.id"
          class="mesa-card"
          :class="{
            ocupada: mesa.estado === 'ocupada',
            reservada: mesa.estado === 'reservada',
          }"
        >
          <div class="mesa-header">
            <h3 class="mesa-title">Mesa {{ mesa.numero }}</h3>
            <div class="mesa-actions">
              <span class="status-badge" :class="mesa.estado">{{
                mesa.estado
              }}</span>
              <button class="btn-action" @click="toggleEstadoMesa(mesa)">
                Cambiar Estado
              </button>
            </div>
          </div>
          <div class="mesa-content">
            <!-- Clientes -->
            <div class="section">
              <h4 class="section-title">👥 Clientes</h4>
              <div class="items-list">
                <div
                  v-for="cliente in mesa.clientes"
                  :key="cliente.id"
                  class="item"
                >
                  <span class="item-name">{{ cliente.nombre }}</span>
                  <span class="item-time">{{ cliente.horaLlegada }}</span>
                </div>
                <button class="btn-add-item" @click="agregarCliente(mesa)">
                  + Agregar Cliente
                </button>
              </div>
            </div>

            <!-- Pedidos -->
            <div class="section">
              <h4 class="section-title">🍽️ Pedidos</h4>
              <div class="items-list">
                <div
                  v-for="pedido in mesa.pedidos"
                  :key="pedido.id"
                  class="item"
                >
                  <span class="item-name">{{ pedido.descripcion }}</span>
                  <span class="item-price">${{ pedido.total }}</span>
                  <span class="item-time">{{ pedido.hora }}</span>
                </div>
                <button class="btn-add-item" @click="agregarPedido(mesa)">
                  + Agregar Pedido
                </button>
              </div>
            </div>

            <!-- Pagos -->
            <div class="section">
              <h4 class="section-title">💳 Pagos</h4>
              <div class="items-list">
                <div v-for="pago in mesa.pagos" :key="pago.id" class="item">
                  <span class="item-name"
                    >${{ pago.monto }} - {{ pago.metodo }}</span
                  >
                  <span class="item-time">{{ pago.hora }}</span>
                </div>
                <button class="btn-add-item" @click="agregarPago(mesa)">
                  + Agregar Pago
                </button>
              </div>
            </div>

            <!-- Total de la mesa -->
            <div class="mesa-total">
              <strong>Total de la Mesa: ${{ calcularTotalMesa(mesa) }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Resumen del día -->
    <div class="summary-section">
      <!-- Vista principal vs vista detallada -->
      <div class="view-toggle">
        <button
          :class="['view-btn', { active: currentView === 'overview' }]"
          @click="currentView = 'overview'"
        >
          📊 Vista General
        </button>
        <button
          :class="['view-btn', { active: currentView === 'detailed' }]"
          @click="currentView = 'detailed'"
        >
          Ocultar Vistas
        </button>
      </div>
      <h3 class="summary-title">📊 Resumen del Día</h3>
      <div class="summary-grid">
        <div
          class="summary-card"
          @click="showMesasModal = true"
          style="cursor: pointer"
        >
          <div class="summary-icon">🪑</div>
          <div class="summary-content">
            <h4>{{ mesasAtendidas }}</h4>
            <p>Mesas Atendidas</p>
          </div>
        </div>
        <div
          class="summary-card"
          @click="showClientesModal = true"
          style="cursor: pointer"
        >
          <div class="summary-icon">👥</div>
          <div class="summary-content">
            <h4>{{ totalClientes }}</h4>
            <p>Clientes Atendidos</p>
          </div>
        </div>
        <div
          class="summary-card"
          @click="showPedidosModal = true"
          style="cursor: pointer"
        >
          <div class="summary-icon">🍽️</div>
          <div class="summary-content">
            <h4>{{ totalPedidos }}</h4>
            <p>Pedidos Realizados</p>
          </div>
        </div>
        <div
          class="summary-card"
          @click="showIngresosModal = true"
          style="cursor: pointer"
        >
          <div class="summary-icon">💰</div>
          <div class="summary-content">
            <h4>${{ totalIngresos }}</h4>
            <p>Ingresos Totales</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar mesa -->
    <div
      v-if="showAddModal"
      class="modal-overlay"
      @click="showAddModal = false"
    >
      <div class="modal-content" @click.stop>
        <h3>Agregar Nueva Mesa</h3>
        <form @submit.prevent="agregarMesa">
          <div class="form-group">
            <label>Número de Mesa:</label>
            <input
              v-model="nuevaMesa.numero"
              type="number"
              required
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="showAddModal = false"
              class="btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" class="btn-submit">Agregar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para detalles de mesas -->
    <div
      v-if="showMesasModal"
      class="modal-overlay"
      @click="showMesasModal = false"
    >
      <div class="modal-content large-modal" @click.stop>
        <h3>Detalles de Mesas - {{ selectedDate }}</h3>
        <div class="modal-sections">
          <!-- Mesas Actuales -->
          <div class="modal-section">
            <h4>🪑 Mesas Actuales</h4>
            <div class="items-list">
              <div v-for="mesa in mesasFiltradas" :key="mesa.id" class="item">
                <span class="item-name"
                  >Mesa {{ mesa.numero }} - {{ mesa.estado }}</span
                >
                <span class="item-time"
                  >Clientes: {{ mesa.clientes.length }}, Pedidos:
                  {{ mesa.pedidos.length }}</span
                >
              </div>
            </div>
          </div>

          <!-- Mesas Agregadas -->
          <div class="modal-section">
            <h4>➕ Mesas Agregadas</h4>
            <div class="items-list">
              <div
                v-for="table in addedTables"
                :key="table.numero"
                class="item"
              >
                <span class="item-name">Mesa {{ table.numero }}</span>
                <span class="item-time"
                  >{{ table.fecha }} - {{ table.hora }}</span
                >
              </div>
            </div>
          </div>

          <!-- Mesas Eliminadas -->
          <div class="modal-section">
            <h4>❌ Mesas Eliminadas</h4>
            <div class="items-list">
              <div
                v-for="table in deletedTables"
                :key="table.numero"
                class="item"
              >
                <span class="item-name">Mesa {{ table.numero }}</span>
                <span class="item-time"
                  >{{ table.fecha }} - {{ table.hora }}</span
                >
              </div>
            </div>
          </div>

          <!-- Reservas -->
          <div class="modal-section">
            <h4>📅 Reservas</h4>
            <div class="items-list">
              <div v-for="res in reservations" :key="res.mesa" class="item">
                <span class="item-name"
                  >Mesa {{ res.mesa }} - {{ res.cliente }}</span
                >
                <span class="item-time">{{ res.fecha }} - {{ res.hora }}</span>
              </div>
            </div>
          </div>

          <!-- Exportar Reporte -->
          <div class="modal-section buttons-section">
            <button class="btn-export" @click="exportReport">
              📄 Exportar Reporte
            </button>
            <button
              type="button"
              @click="showMesasModal = false"
              class="btn-close-small"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para detalles de clientes -->
    <div
      v-if="showClientesModal"
      class="modal-overlay"
      @click="showClientesModal = false"
    >
      <div class="modal-content large-modal" @click.stop>
        <h3>Clientes Atendidos - {{ selectedDate }}</h3>
        <div class="modal-sections">
          <!-- Clientes por Mesa -->
          <div class="modal-section">
            <h4>👥 Clientes Atendidos por Mesa</h4>
            <div class="items-list">
              <div
                v-for="mesa in mesasFiltradas.filter(
                  (m) => m.clientes.length > 0
                )"
                :key="mesa.id"
                class="mesa-group"
              >
                <h5 class="mesa-title">Mesa {{ mesa.numero }}</h5>
                <div class="clientes-list">
                  <div
                    v-for="cliente in mesa.clientes"
                    :key="cliente.id"
                    class="item"
                  >
                    <span class="item-name">{{ cliente.nombre }}</span>
                    <span class="item-time">{{ cliente.horaLlegada }}</span>
                    <span class="item-payment">
                      Pago:
                      {{
                        mesa.pagos.length > 0
                          ? mesa.pagos[0].metodo
                          : "Pendiente"
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de Pagos -->
          <div class="modal-section">
            <h4>💳 Resumen de Métodos de Pago</h4>
            <div class="items-list">
              <div class="item">
                <span class="item-name">Efectivo</span>
                <span class="item-count">{{
                  contarPagosPorMetodo("Efectivo")
                }}</span>
              </div>
              <div class="item">
                <span class="item-name">Tarjeta</span>
                <span class="item-count">{{
                  contarPagosPorMetodo("Tarjeta")
                }}</span>
              </div>
            </div>
          </div>

          <!-- Cerrar Modal -->
          <div class="modal-section buttons-section">
            <button
              type="button"
              @click="showClientesModal = false"
              class="btn-close-small"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para detalles de pedidos -->
    <div
      v-if="showPedidosModal"
      class="modal-overlay"
      @click="showPedidosModal = false"
    >
      <div class="modal-content large-modal" @click.stop>
        <h3>Pedidos Realizados - {{ selectedDate }}</h3>
        <div class="modal-sections">
          <!-- Pedidos por Mesa -->
          <div class="modal-section">
            <h4>🍽️ Pedidos Realizados por Mesa</h4>
            <div class="items-list">
              <div
                v-for="mesa in mesasFiltradas.filter(
                  (m) => m.pedidos.length > 0
                )"
                :key="mesa.id"
                class="mesa-group"
              >
                <h5 class="mesa-title">Mesa {{ mesa.numero }}</h5>
                <div class="pedidos-list">
                  <div
                    v-for="pedido in mesa.pedidos"
                    :key="pedido.id"
                    class="item"
                  >
                    <span class="item-name">{{ pedido.descripcion }}</span>
                    <span class="item-price">${{ pedido.total }}</span>
                    <span class="item-time">{{ pedido.hora }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de Pedidos -->
          <div class="modal-section">
            <h4>📊 Resumen de Pedidos</h4>
            <div class="items-list">
              <div class="item">
                <span class="item-name">Total de Pedidos</span>
                <span class="item-count">{{ totalPedidos }}</span>
              </div>
              <div class="item">
                <span class="item-name">Ingresos por Pedidos</span>
                <span class="item-count">${{ totalIngresos }}</span>
              </div>
            </div>
          </div>

          <!-- Cerrar Modal -->
          <div class="modal-section buttons-section">
            <button
              type="button"
              @click="showPedidosModal = false"
              class="btn-close-small"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para detalles de ingresos -->
    <div
      v-if="showIngresosModal"
      class="modal-overlay"
      @click="showIngresosModal = false"
    >
      <div class="modal-content large-modal" @click.stop>
        <h3>Ingresos Totales - {{ selectedDate }}</h3>
        <div class="modal-sections">
          <!-- Pagos por Mesa -->
          <div class="modal-section">
            <h4>💳 Pagos Registrados por Mesa</h4>
            <div class="items-list">
              <div
                v-for="mesa in mesasFiltradas.filter((m) => m.pagos.length > 0)"
                :key="mesa.id"
                class="mesa-group"
              >
                <h5 class="mesa-title">Mesa {{ mesa.numero }}</h5>
                <div class="pagos-list">
                  <div v-for="pago in mesa.pagos" :key="pago.id" class="item">
                    <span class="item-name"
                      >${{ pago.monto }} - {{ pago.metodo }}</span
                    >
                    <span class="item-time">{{ pago.hora }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumen de Ingresos -->
          <div class="modal-section">
            <h4>📊 Resumen de Ingresos</h4>
            <div class="items-list">
              <div class="item">
                <span class="item-name">Total de Pagos</span>
                <span class="item-count">{{ contarTotalPagos() }}</span>
              </div>
              <div class="item">
                <span class="item-name">Ingresos por Efectivo</span>
                <span class="item-count"
                  >${{ ingresosPorMetodo("Efectivo") }}</span
                >
              </div>
              <div class="item">
                <span class="item-name">Ingresos por Tarjeta</span>
                <span class="item-count"
                  >${{ ingresosPorMetodo("Tarjeta") }}</span
                >
              </div>
              <div class="item">
                <span class="item-name">Ingresos Totales</span>
                <span class="item-count">${{ totalIngresos }}</span>
              </div>
            </div>
          </div>

          <!-- Cerrar Modal -->
          <div class="modal-section buttons-section">
            <button
              type="button"
              @click="showIngresosModal = false"
              class="btn-close-small"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Datos reactivos
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const currentView = ref("overview");
const mesas = ref([]);
const showAddModal = ref(false);
const nuevaMesa = ref({ numero: null });
const showMesasModal = ref(false);
const showClientesModal = ref(false);
const showPedidosModal = ref(false);
const showIngresosModal = ref(false);
const addedTables = ref([]);
const deletedTables = ref([]);
const reservations = ref([]);

// Datos de ejemplo (mock data)
const mockData = [
  {
    id: 1,
    numero: 1,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [
      { id: 1, nombre: "Juan Pérez", horaLlegada: "12:00" },
      { id: 2, nombre: "María García", horaLlegada: "12:15" },
    ],
    pedidos: [
      { id: 1, descripcion: "Pizza Margherita", total: 15.99, hora: "12:30" },
      { id: 2, descripcion: "Ensalada César", total: 12.5, hora: "12:35" },
    ],
    pagos: [{ id: 1, monto: 28.49, metodo: "Tarjeta", hora: "14:00" }],
  },
  {
    id: 2,
    numero: 2,
    estado: "libre",
    fecha: "2023-10-01",
    clientes: [],
    pedidos: [],
    pagos: [],
  },
  {
    id: 3,
    numero: 3,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [{ id: 3, nombre: "Carlos López", horaLlegada: "13:00" }],
    pedidos: [
      { id: 3, descripcion: "Hamburguesa Deluxe", total: 18.99, hora: "13:15" },
      { id: 4, descripcion: "Refresco", total: 3.5, hora: "13:20" },
    ],
    pagos: [{ id: 2, monto: 22.49, metodo: "Efectivo", hora: "15:00" }],
  },
  {
    id: 4,
    numero: 4,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [{ id: 4, nombre: "Ana Ruiz", horaLlegada: "14:00" }],
    pedidos: [
      { id: 5, descripcion: "Pasta Carbonara", total: 20.0, hora: "14:15" },
    ],
    pagos: [{ id: 3, monto: 20.0, metodo: "Tarjeta", hora: "16:00" }],
  },
  {
    id: 5,
    numero: 5,
    estado: "libre",
    fecha: "2023-10-01",
    clientes: [],
    pedidos: [],
    pagos: [],
  },
  {
    id: 6,
    numero: 6,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [
      { id: 5, nombre: "Luis Martínez", horaLlegada: "15:00" },
      { id: 6, nombre: "Sofía Herrera", horaLlegada: "15:10" },
    ],
    pedidos: [
      { id: 6, descripcion: "Steak", total: 25.99, hora: "15:30" },
      { id: 7, descripcion: "Vino", total: 8.5, hora: "15:35" },
    ],
    pagos: [{ id: 4, monto: 34.49, metodo: "Efectivo", hora: "17:00" }],
  },
  {
    id: 7,
    numero: 7,
    estado: "libre",
    fecha: "2023-10-01",
    clientes: [],
    pedidos: [],
    pagos: [],
  },
  {
    id: 8,
    numero: 8,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [{ id: 7, nombre: "Miguel Torres", horaLlegada: "16:00" }],
    pedidos: [{ id: 8, descripcion: "Sushi", total: 30.0, hora: "16:20" }],
    pagos: [{ id: 5, monto: 30.0, metodo: "Tarjeta", hora: "18:00" }],
  },
  {
    id: 9,
    numero: 9,
    estado: "libre",
    fecha: "2023-10-01",
    clientes: [],
    pedidos: [],
    pagos: [],
  },
  {
    id: 10,
    numero: 10,
    estado: "ocupada",
    fecha: "2023-10-01",
    clientes: [{ id: 8, nombre: "Laura Sánchez", horaLlegada: "17:00" }],
    pedidos: [
      { id: 9, descripcion: "Ensalada", total: 12.0, hora: "17:15" },
      { id: 10, descripcion: "Postre", total: 6.5, hora: "17:30" },
    ],
    pagos: [{ id: 6, monto: 18.5, metodo: "Efectivo", hora: "19:00" }],
  },
];

// Computed properties
const mesasFiltradas = computed(() => {
  return mesas.value.filter((mesa) => mesa.fecha === selectedDate.value);
});

const totalClientes = computed(() => {
  return mesasFiltradas.value.reduce(
    (total, mesa) => total + mesa.clientes.length,
    0
  );
});

const totalPedidos = computed(() => {
  return mesasFiltradas.value.reduce(
    (total, mesa) => total + mesa.pedidos.length,
    0
  );
});

const totalIngresos = computed(() => {
  return mesasFiltradas.value
    .reduce((total, mesa) => total + calcularTotalMesa(mesa), 0)
    .toFixed(2);
});

const mesasAtendidas = computed(() => {
  return mesasFiltradas.value.filter(
    (mesa) => mesa.clientes.length > 0 || mesa.pedidos.length > 0
  ).length;
});

const registrosGenerales = computed(() => {
  const registros = [];
  mesasFiltradas.value.forEach((mesa) => {
    // Agregar clientes
    mesa.clientes.forEach((cliente) => {
      registros.push({
        id: `cliente-${cliente.id}`,
        mesa: mesa.numero,
        cliente: cliente.nombre,
        pedido: null,
        monto: null,
        metodo: null,
        hora: cliente.horaLlegada,
      });
    });
    // Agregar pedidos
    mesa.pedidos.forEach((pedido) => {
      registros.push({
        id: `pedido-${pedido.id}`,
        mesa: mesa.numero,
        cliente: null,
        pedido: pedido.descripcion,
        monto: pedido.total,
        metodo: null,
        hora: pedido.hora,
      });
    });
    // Agregar pagos
    mesa.pagos.forEach((pago) => {
      registros.push({
        id: `pago-${pago.id}`,
        mesa: mesa.numero,
        cliente: null,
        pedido: null,
        monto: pago.monto,
        metodo: pago.metodo,
        hora: pago.hora,
      });
    });
  });
  return registros.sort((a, b) => a.hora.localeCompare(b.hora));
});

// Métodos
const filterByDate = () => {
  // La lógica de filtrado se maneja en el computed mesasFiltradas
};

const saveMesas = () => {
  localStorage.setItem("mesas", JSON.stringify(mesas.value));
};

const loadMesas = () => {
  const stored = localStorage.getItem("mesas");
  if (stored) {
    mesas.value = JSON.parse(stored);
  } else {
    mesas.value = mockData;
  }
};

const calcularTotalMesa = (mesa) => {
  const totalPedidos = mesa.pedidos.reduce(
    (sum, pedido) => sum + pedido.total,
    0
  );
  const totalPagos = mesa.pagos.reduce((sum, pago) => sum + pago.monto, 0);
  return Math.max(totalPedidos, totalPagos); // En caso de discrepancias, tomar el mayor
};

const toggleEstadoMesa = (mesa) => {
  mesa.estado = mesa.estado === "ocupada" ? "libre" : "ocupada";
  saveMesas();
};

const agregarCliente = (mesa) => {
  // Implementar modal para agregar cliente
  alert(`Agregar cliente a mesa ${mesa.numero}`);
};

const agregarPedido = (mesa) => {
  // Implementar modal para agregar pedido
  alert(`Agregar pedido a mesa ${mesa.numero}`);
};

const agregarPago = (mesa) => {
  // Implementar modal para agregar pago
  alert(`Agregar pago a mesa ${mesa.numero}`);
};

const agregarMesa = () => {
  if (nuevaMesa.value.numero) {
    const mesaNueva = {
      id: Date.now(),
      numero: nuevaMesa.value.numero,
      estado: "libre",
      fecha: selectedDate.value,
      clientes: [],
      pedidos: [],
      pagos: [],
    };
    mesas.value.push(mesaNueva);
    saveMesas();
    nuevaMesa.value.numero = null;
    showAddModal.value = false;
  }
};

const exportReport = () => {
  alert("Exportando reporte... (Funcionalidad básica implementada)");
};

const contarPagosPorMetodo = (metodo) => {
  return mesasFiltradas.value.reduce((total, mesa) => {
    return total + mesa.pagos.filter((pago) => pago.metodo === metodo).length;
  }, 0);
};

const contarTotalPagos = () => {
  return mesasFiltradas.value.reduce(
    (total, mesa) => total + mesa.pagos.length,
    0
  );
};

const ingresosPorMetodo = (metodo) => {
  return mesasFiltradas.value
    .reduce((total, mesa) => {
      return (
        total +
        mesa.pagos
          .filter((pago) => pago.metodo === metodo)
          .reduce((sum, pago) => sum + pago.monto, 0)
      );
    }, 0)
    .toFixed(2);
};

// Inicializar datos
onMounted(() => {
  loadMesas();
  // Mock history data
  addedTables.value = [
    { numero: 4, fecha: "2023-10-01", hora: "10:00" },
    { numero: 5, fecha: "2023-10-01", hora: "11:30" },
  ];
  deletedTables.value = [{ numero: 6, fecha: "2023-10-01", hora: "09:00" }];
  reservations.value = [
    { mesa: 1, cliente: "Ana Ruiz", fecha: "2023-10-01", hora: "19:00" },
    { mesa: 2, cliente: "Pedro Gómez", fecha: "2023-10-01", hora: "20:00" },
  ];
});
</script>

<style scoped>
.registro-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.hero-section {
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.hero-title {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: 600;
  color: #333;
}

.date-input {
  padding: 8px 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.date-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-add {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

.mesas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.mesa-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.mesa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.mesa-card.ocupada {
  border-left: 5px solid #ff6b6b;
}

.mesa-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mesa-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.mesa-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.ocupada {
  background: #ff6b6b;
}

.status-badge.libre {
  background: #51cf66;
}

.btn-action {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mesa-content {
  padding: 20px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #333;
}

.items-list {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.item:last-child {
  border-bottom: none;
}

.item-name {
  font-weight: 500;
  color: #333;
}

.item-price {
  color: #28a745;
  font-weight: 600;
}

.item-time {
  color: #6c757d;
  font-size: 0.9rem;
}

.btn-add-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: transform 0.2s;
  width: 100%;
  margin-top: 10px;
}

.btn-add-item:hover {
  transform: translateY(-1px);
}

.mesa-total {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
}

.summary-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.summary-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8rem;
  color: #333;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.summary-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.3s;
}

.summary-card:hover {
  transform: translateY(-3px);
}

.summary-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.summary-content h4 {
  font-size: 2rem;
  margin: 10px 0;
  font-weight: 700;
}

.summary-content p {
  margin: 0;
  opacity: 0.9;
}

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
  padding: 30px;
  border-radius: 15px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancel:hover {
  background: #5a6268;
}

.btn-submit {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-submit:hover {
  transform: translateY(-1px);
}

.large-modal {
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-section h4 {
  margin-bottom: 10px;
  color: #333;
}

.btn-export {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  width: 25%;
  height: 40px;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.2s;
  outline: none;
}

.btn-export:hover {
  transform: translateY(-2px);
}

.btn-close-small {
  width: 25%;
  height: 40px;
  background: #4bf14be4;
  color: #333;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-close-small:hover {
  background: #7bc97b;
}

.buttons-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.view-toggle {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.view-btn {
  background: #f8f9fa;
  border: none;
  color: #333;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: none;
}

.view-btn:hover {
  background: #e9ecef;
}

.view-btn.active {
  background: #495057;
  color: white;
}

.view-btn:not(.active) {
  background: white;
  color: #333;
}

.item-payment {
  color: #007bff;
  font-weight: 600;
}

.item-count {
  color: #28a745;
  font-weight: 700;
  font-size: 1.1rem;
}

.mesa-group {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.mesa-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
}

.clientes-list {
  background: white;
  border-radius: 6px;
  padding: 10px;
}

.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 40px;
}

.registro-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.registro-table th,
.registro-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}

.registro-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
}

.registro-table tbody tr:hover {
  background: #f8f9fa;
}

.registro-table tbody tr:nth-child(even) {
  background: #f8f9fa;
}

.registro-table tbody tr:nth-child(even):hover {
  background: #e9ecef;
}

@media (max-width: 768px) {
  .mesas-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
    gap: 15px;
    align-items: stretch; /* Full width filters */
  }

  .date-filter {
      flex-direction: column;
      align-items: flex-start;
  }
  
  .date-input {
      width: 100%;
      box-sizing: border-box;
  }

  .hero-title {
    font-size: 1.75rem; /* Slightly smaller for better fit */
  }

  .summary-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* Allow 2 columns on mobile if space permits */
    gap: 10px;
  }
  
  .summary-card {
      padding: 15px; /* Reduce padding */
  }

  .table-container {
    padding: 0;
    box-shadow: none; /* Remove shadow on mobile for flatter look */
    border: 1px solid #e2e8f0;
  }

  .registro-table th,
  .registro-table td {
    padding: 10px;
    white-space: nowrap; /* Prevent wrapping in cells, allow scroll */
  }
  
  .view-toggle {
      width: 100%;
      justify-content: space-between;
  }
  
  .view-btn {
      flex: 1;
      text-align: center;
  }
  
  .btn-export, .btn-close-small {
      width: 100%; /* Full width buttons in modals */
  }
  
  .modal-content {
      padding: 1.5rem;
      width: 95%;
  }
}

@media (max-width: 480px) {
    .summary-grid {
        grid-template-columns: 1fr; /* Stack on very small screens */
    }
}
</style>
