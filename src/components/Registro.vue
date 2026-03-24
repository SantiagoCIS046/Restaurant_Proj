<template>
  <div class="registro-view">
    <!-- Hero Banner -->
    <div class="hero-banner">
      <div class="hero-content">
        <div class="hero-info">
          <h1>Registro General de Operaciones</h1>
          <p>Visualización detallada y métricas en tiempo real</p>
        </div>
        <div class="hero-actions">
          <div class="date-picker-wrapper">
            <i class="fas fa-calendar-alt"></i>
            <input 
              type="date" 
              v-model="selectedDate" 
              class="hero-date-input"
              :max="today"
              @change="filterByDate"
            />
          </div>
          <button class="export-btn" @click="exportReport">
            <i class="fas fa-file-export"></i>
            Exportar Reporte
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Section Title: Resumen del Día -->
      <div class="section-header">
        <h2>Resumen del Día</h2>
        <span class="update-tag">ACTUALIZADO HACE 2 MIN</span>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card" @click="showMesasModal = true">
          <div class="stat-icon mesas">
            <i class="fas fa-chair"></i>
          </div>
          <div class="stat-details">
            <p class="stat-label">MESAS ATENDIDAS</p>
            <h3 class="stat-value">{{ mesasAtendidas }}</h3>
          </div>
        </div>

        <div class="stat-card" @click="showClientesModal = true">
          <div class="stat-icon clientes">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-details">
            <p class="stat-label">CLIENTES ATENDIDOS</p>
            <h3 class="stat-value">{{ totalClientes }}</h3>
          </div>
        </div>

        <div class="stat-card" @click="showPedidosModal = true">
          <div class="stat-icon pedidos">
            <i class="fas fa-clipboard-list"></i>
          </div>
          <div class="stat-details">
            <p class="stat-label">PEDIDOS REALIZADOS</p>
            <h3 class="stat-value">{{ totalPedidos }}</h3>
          </div>
        </div>

        <div class="stat-card" @click="showIngresosModal = true">
          <div class="stat-icon ingresos">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-details">
            <p class="stat-label">INGRESOS TOTALES</p>
            <h3 class="stat-value">${{ totalIngresos }}</h3>
          </div>
        </div>
      </div>

      <!-- Detail Header -->
      <div class="detail-header">
        <h2>Detalle de Registros</h2>
        <div class="detail-actions">
          <div class="search-wrapper">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="localSearchQuery" 
              placeholder="Buscar por cliente o mesa..." 
              class="detail-search"
            />
          </div>
          <button class="filter-icon-btn">
            <i class="fas fa-filter"></i>
          </button>
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="table-card-wrapper">
        <table class="premium-table">
          <thead>
            <tr>
              <th>MESA</th>
              <th>CLIENTE</th>
              <th>PEDIDO</th>
              <th>MONTO</th>
              <th>MÉTODO</th>
              <th>HORA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in filteredRegistros" :key="registro.id">
              <td>
                <span class="mesa-badge">Mesa {{ registro.mesa }}</span>
              </td>
              <td class="cliente-cell">{{ registro.cliente || "-" }}</td>
              <td class="pedido-cell">{{ registro.pedido || "-" }}</td>
              <td class="monto-cell">{{ registro.monto ? "$" + registro.monto : "-" }}</td>
              <td>
                <div v-if="registro.metodo" class="metodo-tag">
                  <i :class="getMetodoIcon(registro.metodo)"></i>
                  {{ registro.metodo }}
                </div>
                <span v-else>-</span>
              </td>
              <td class="hora-cell">{{ registro.hora }}</td>
            </tr>
          </tbody>
        </table>
        
        <!-- Pagination Placeholder -->
        <div class="table-footer">
          <p class="footer-info">MOSTRANDO {{ filteredRegistros.length }} DE {{ registrosGenerales.length }} REGISTROS</p>
          <div class="pagination">
            <button class="page-btn">Anterior</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">Siguiente</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (Reused from previous version with updated styles) -->
    <!-- (Modals are triggered by clicks on stat cards) -->
    <div v-if="showMesasModal" class="premium-modal-overlay" @click="showMesasModal = false">
      <div class="premium-modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalles de Operaciones</h3>
          <button class="close-btn" @click="showMesasModal = false">&times;</button>
        </div>
        <div class="modal-body">
          <p>Mostrando detalles para el día {{ selectedDate }}</p>
          <!-- Additional detail lists could go here -->
        </div>
      </div>
    </div>
    <!-- (Other modals would follow similar structure) -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

// Datos reactivos
const today = new Date().toISOString().split("T")[0];
const selectedDate = ref(today);
const currentView = ref("overview");
const localSearchQuery = ref(""); // New search query for the table
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

const filteredRegistros = computed(() => {
  if (!localSearchQuery.value) return registrosGenerales.value;
  const q = localSearchQuery.value.toLowerCase();
  return registrosGenerales.value.filter(r => 
    (r.cliente && r.cliente.toLowerCase().includes(q)) || 
    (r.mesa && r.mesa.toString().includes(q)) ||
    (r.pedido && r.pedido.toLowerCase().includes(q))
  );
});

const getMetodoIcon = (metodo) => {
  if (metodo === 'Tarjeta') return 'fas fa-credit-card';
  if (metodo === 'Efectivo') return 'fas fa-money-bill-wave';
  return 'fas fa-wallet';
};

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
.registro-view {
  min-height: 100vh;
  background-color: #f8fafc;
  padding-top: 56px; /* High-speed flush alignment with single 56px NavBar */
  font-family: 'Inter', sans-serif;
}

/* Hero Banner */
.hero-banner {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 1.5rem 2.5rem;
  color: white;
  margin-bottom: 20px;
  position: sticky;
  top: 56px; /* Align with bottom of fixed single-nav */
  z-index: 50;
  border-radius: 0 0 16px 16px; /* Removed top corners for flush look */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: none; /* No border against the navbar */
}

.hero-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hero-info h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
}

.hero-info p {
  margin: 5px 0 0 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.hero-actions {
  display: flex;
  gap: 15px;
}

.date-picker-wrapper {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.date-picker-wrapper:focus-within {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.date-picker-wrapper i {
  color: #fff;
  font-size: 1rem;
  opacity: 0.9;
}

.hero-date-input {
  background: transparent;
  border: none;
  color: white;
  font-weight: 700;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
}

.hero-date-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.export-btn {
  background: #ffffff;
  color: #1e40af;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.2);
  background: #f8fafc;
  color: #2563eb;
}

.export-btn:active {
  transform: translateY(0);
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px 40px 40px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.update-tag {
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-icon.mesas { background: #eff6ff; color: #2563eb; }
.stat-icon.clientes { background: #f0fdf4; color: #16a34a; }
.stat-icon.pedidos { background: #fef2f2; color: #dc2626; }
.stat-icon.ingresos { background: #fffbeb; color: #d97706; }

.stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 2px 0 0 0;
}

/* Detail Table Section */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.detail-header h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}

.detail-actions {
  display: flex;
  gap: 12px;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-wrapper i {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.detail-search {
  padding: 10px 16px 10px 42px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.95rem;
  width: 320px;
  outline: none;
  transition: all 0.3s ease;
}

.detail-search:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.filter-icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-icon-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #1e293b;
}

/* Premium Table */
.table-card-wrapper {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 40px;
}

.premium-table {
  width: 100%;
  border-collapse: collapse;
}

.premium-table th {
  background: #f8fafc;
  padding: 18px 24px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #f1f5f9;
}

.premium-table td {
  padding: 16px 24px;
  font-size: 0.95rem;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}

.premium-table tr:nth-child(even) td {
  background: #fcfcfd;
}

.premium-table tr:hover td {
  background: #f8fafc;
}

.mesa-badge {
  background: #e0f2fe;
  color: #0369a1;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 4px 10px;
  border-radius: 6px;
}

.cliente-cell {
  font-weight: 600;
  color: #1e293b;
}

.monto-cell {
  font-weight: 700;
  color: #16a34a;
}

.metodo-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
}

.hora-cell {
  font-family: 'JetBrains Mono', monospace;
  color: #64748b;
  font-weight: 500;
}

/* Table Footer */
.table-footer {
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;
}

.footer-info {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  margin: 0;
}

.pagination {
  display: flex;
  gap: 5px;
}

.page-btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
}

.page-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* Modals */
.premium-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.premium-modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.modal-header {
  padding: 20px 25px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
}

.modal-body {
  padding: 25px;
}

@media (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 20px 20px 20px;
  }

  .registro-view {
    padding-top: 130px; /* Adjust for mobile stacked navbar */
  }
}
</style>
