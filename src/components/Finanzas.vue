<template>
  <div class="finanzas-container">
    <div class="header-section">
      <h1 class="page-title">💰 Finanzas</h1>
      <div class="date-filter">
        <input type="date" v-model="selectedDate" class="date-input" />
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card income-white">
        <div class="card-header-small">
          <div class="mini-icon income"><i class="fas fa-chart-line"></i></div>
          <span class="percentage income">+12.5%</span>
        </div>
        <div class="card-body-finance">
          <h3>Ingresos</h3>
          <p class="amount-main">{{ formatCurrency(totalIncome) }}</p>
        </div>
      </div>
      <div class="card expense-white">
        <div class="card-header-small">
          <div class="mini-icon expense"><i class="fas fa-chart-bar"></i></div>
          <span class="percentage expense">+4.2%</span>
        </div>
        <div class="card-body-finance">
          <h3>Gastos</h3>
          <p class="amount-main">{{ formatCurrency(totalExpense) }}</p>
        </div>
      </div>
      <div class="card balance-blue">
        <div class="card-icon-round"><i class="fas fa-wallet"></i></div>
        <div class="card-body-finance">
          <h3>Balance General</h3>
          <p class="amount-main white">{{ formatCurrency(totalBalance) }}</p>
        </div>
      </div>
    </div>

    <!-- Charts & Main Content -->
    <!-- Resumen Financiero Row -->
    <div class="finance-overview-row">
      <div class="chart-box">
        <div class="chart-wrapper">
          <canvas id="financeChart"></canvas>
          <div class="chart-center-label">
            <span class="total-label">Total</span>
            <span class="total-value">$73k</span>
          </div>
        </div>
      </div>
      <div class="overview-info">
        <h2 class="overview-title">Resumen Financiero</h2>
        <p class="overview-desc">Visualiza la distribución de tus ingresos y egresos operativos del mes actual para una mejor toma de decisiones.</p>
        <div class="overview-legend">
          <div class="legend-item"><span class="dot blue"></span> INGRESOS (62%)</div>
          <div class="legend-item"><span class="dot green"></span> GASTOS (38%)</div>
        </div>
      </div>
      <div class="overview-actions">
        <button class="btn-register" @click="showAddModal = true">
          <i class="fas fa-plus-circle"></i> Registrar Movimiento
        </button>
      </div>
    </div>

    <!-- Transactions List Section -->
    <div class="transactions-section-professional">
      <div class="transactions-header-row">
        <h3>Movimientos Recientes</h3>
        <div class="header-actions-icons">
          <button class="icon-btn-gray"><i class="fas fa-filter"></i></button>
          <button class="icon-btn-gray"><i class="fas fa-download"></i></button>
        </div>
      </div>

      <div class="finance-table-header">
        <span class="col-date">FECHA</span>
        <span class="col-desc">DESCRIPCIÓN</span>
        <span class="col-cat">CATEGORÍA</span>
        <span class="col-type">TIPO</span>
        <span class="col-amount">MONTO</span>
        <span class="col-actions">GESTIÓN</span>
      </div>

      <div class="finance-table-list">
        <div v-if="filteredTransactions.length === 0" class="no-data-msg">
          <i class="fas fa-inbox"></i>
          <p>No se encontraron movimientos.</p>
        </div>
        <div v-for="t in filteredTransactions" :key="t.id" class="finance-table-row">
          <div class="col-date">{{ formatDate(t.date) }}</div>
          <div class="col-desc"><strong>{{ t.description }}</strong></div>
          <div class="col-cat"><span class="category-chip">{{ t.category }}</span></div>
          <div class="col-type">
            <span :class="['type-text-badge', t.type === 'income' ? 'income' : 'expense']">
              {{ t.type === 'income' ? 'INGRESO' : 'GASTO' }}
            </span>
          </div>
          <div class="col-amount" :class="t.type === 'income' ? 'text-blue' : 'text-black'">
            {{ t.type === 'income' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
          </div>
          <div class="col-actions">
            <button class="btn-more" @click="deleteTransaction(t.id)">
              <i class="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="table-footer">
        <span class="footer-stats">MOSTRANDO {{ filteredTransactions.length }} DE {{ transactions.length }} MOVIMIENTOS</span>
        <div class="pagination">
          <button class="page-link">ANTERIOR</button>
          <button class="page-link">SIGUIENTE</button>
        </div>
      </div>
    </div>

    <!-- Add Transaction Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Registrar Nuevo Movimiento</h3>
          <button class="btn-close" @click="showAddModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Tipo de Movimiento</label>
            <div class="type-selector">
              <button 
                :class="['type-btn', newTransaction.type === 'income' ? 'active income' : '']" 
                @click="newTransaction.type = 'income'"
              >
                Ingreso
              </button>
              <button 
                :class="['type-btn', newTransaction.type === 'expense' ? 'active expense' : '']" 
                @click="newTransaction.type = 'expense'"
              >
                Gasto
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Descripción</label>
            <input type="text" v-model="newTransaction.description" placeholder="Ej: Pago de nómina, Venta del día..." />
          </div>

          <div class="form-group">
            <label>Monto</label>
            <input type="number" v-model.number="newTransaction.amount" placeholder="0.00" />
          </div>

          <div class="form-group">
            <label>Categoría</label>
            <select v-model="newTransaction.category">
              <option disabled value="">Selecciona una categoría</option>
              <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Fecha</label>
            <input type="date" v-model="newTransaction.date" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showAddModal = false">Cancelar</button>
          <button class="btn-save" @click="addTransaction">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Chart from 'chart.js/auto';

// State
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const showAddModal = ref(false);
const transactions = ref([]);
const chartInstance = ref(null);

const newTransaction = ref({
  type: 'expense',
  description: '',
  amount: null,
  category: '',
  date: new Date().toISOString().split('T')[0]
});

// Categories
const incomeCategories = ['Ventas', 'Servicios', 'Otros Ingresos'];
const expenseCategories = ['Proveedores', 'Nómina', 'Servicios Públicos', 'Mantenimiento', 'Insumos', 'Otros Gastos'];

const availableCategories = computed(() => {
  return newTransaction.value.type === 'income' ? incomeCategories : expenseCategories;
});

// Computed Data
const filteredTransactions = computed(() => {
  // Option 1: Filter strictly by day
  // return transactions.value.filter(t => t.date === selectedDate.value);
  
  // Option 2: Show all (most finance apps show a month or list all, let's show all sorted by date desc for now, or filter by month?)
  // Let's stick to the user pattern of "Day" filter from other components for consistency, but maybe show month?
  // User requested "handle business finance". Let's show everything sorted by date, but highlight the selected date? 
  // Or better, let's filter by MONTH of selected date to give a better overview, or just All Time?
  // Let's filter by the selected MONTH for the table, to make it useful.
  
  const selected = new Date(selectedDate.value);
  const selectedMonth = selected.getMonth();
  const selectedYear = selected.getFullYear();
  
  return transactions.value.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === selectedMonth && tDate.getFullYear() === selectedYear;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
});

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const totalExpense = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0);
});

const totalBalance = computed(() => totalIncome.value - totalExpense.value);

// Methods
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('es-CO', options);
};

const loadTransactions = () => {
  const saved = localStorage.getItem('finanzas_transactions');
  if (saved) {
    transactions.value = JSON.parse(saved);
  } else {
    // Mock data for demo
    transactions.value = [
      { id: 1, type: 'income', description: 'Venta del día', amount: 1500000, category: 'Ventas', date: new Date().toISOString().split('T')[0] },
      { id: 2, type: 'expense', description: 'Pago a proveedor Carne', amount: 450000, category: 'Proveedores', date: new Date().toISOString().split('T')[0] },
      { id: 3, type: 'expense', description: 'Pago extra meseros', amount: 120000, category: 'Nómina', date: new Date().toISOString().split('T')[0] },
    ];
  }
};

const saveTransactions = () => {
  localStorage.setItem('finanzas_transactions', JSON.stringify(transactions.value));
};

const addTransaction = () => {
  if (!newTransaction.value.description || !newTransaction.value.amount || !newTransaction.value.category) {
    alert('Por favor completa todos los campos');
    return;
  }

  transactions.value.push({
    id: Date.now(),
    ...newTransaction.value
  });
  
  saveTransactions();
  showAddModal.value = false;
  
  // Reset form
  newTransaction.value = {
    type: 'expense',
    description: '',
    amount: null,
    category: '',
    date: new Date().toISOString().split('T')[0]
  };
  
  updateChart();
};

const deleteTransaction = (id) => {
  if(confirm('¿Estás seguro de eliminar este movimiento?')) {
    transactions.value = transactions.value.filter(t => t.id !== id);
    saveTransactions();
    updateChart();
  }
};

// Chart Logic
const updateChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = document.getElementById('financeChart');
  if (!ctx) return;

  chartInstance.value = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Ingresos', 'Gastos'],
      datasets: [{
        data: [totalIncome.value, totalExpense.value],
        backgroundColor: ['#2ecc71', '#e74c3c'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#e2e8f0' }
        }
      }
    }
  });
};

// Lifecycle
onMounted(() => {
  loadTransactions();
  // Small delay to ensure DOM render for chart
  setTimeout(updateChart, 100);
});

watch(filteredTransactions, () => {
  updateChart();
});

watch(selectedDate, () => {
  updateChart();
});

</script>

<style scoped>
.finanzas-container {
  padding: 2.5rem;
  padding-top: 80px; /* Acomodar navbar fija */
  max-width: 1400px;
  margin: 0 auto;
  color: #1e293b;
  font-family: 'Outfit', 'Inter', sans-serif;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Custom Scrollbar */
.finanzas-container::-webkit-scrollbar {
  width: 8px;
}

.finanzas-container::-webkit-scrollbar-track {
  background: transparent;
}

.finanzas-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.finanzas-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  display: none; /* Hide if we want exactly like the image which starts with cards */
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.income-white, .expense-white {
  background: #fdfdfe;
}

.card-header-small {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mini-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.mini-icon.income { background: #e6fffa; color: #38a169; }
.mini-icon.expense { background: #fff5f5; color: #e53e3e; }

.percentage {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
}

.percentage.income { background: #e6fffa; color: #38a169; }
.percentage.expense { background: #fff5f5; color: #e53e3e; }

.balance-blue {
  background: #0046ad;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.card-icon-round {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card-body-finance h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin: 0 0 0.5rem 0;
}

.balance-blue .card-body-finance h3 { color: #cbd5e1; }

.amount-main {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.amount-main.white { color: white; }

/* Finance Overview Row (Chart Section) */
.finance-overview-row {
  background: #f1f5fe;
  padding: 2.5rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 3rem;
}

.chart-box {
  flex: 0 0 200px;
}

.chart-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.chart-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.total-label { font-size: 0.75rem; color: #64748b; font-weight: 600; }
.total-value { font-size: 1.25rem; font-weight: 800; color: #0f172a; }

.overview-info {
  flex: 1;
}

.overview-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem 0;
}

.overview-desc {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  max-width: 500px;
}

.overview-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}

.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.blue { background: #0046ad; }
.dot.green { background: #059669; }

.btn-register {
  background: #006b44;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 107, 68, 0.2);
  transition: all 0.2s;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 107, 68, 0.3);
}

/* Professional Table List */
.transactions-section-professional {
  background: white;
  padding: 0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.transactions-header-row {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transactions-header-row h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.header-actions-icons {
  display: flex;
  gap: 0.5rem;
}

.icon-btn-gray {
  width: 40px;
  height: 40px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-btn-gray:hover { background: #f1f5f9; color: #0f172a; }

.finance-table-header {
  display: flex;
  background: #f1f5fe;
  padding: 0;
  font-weight: 800;
  font-size: 0.7rem;
  color: #5e729a;
  letter-spacing: 1px;
}

.finance-table-list {
  display: flex;
  flex-direction: column;
}

.finance-table-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f8fafc;
  padding: 0.5rem 0;
}

.finance-table-row:last-child { border-bottom: none; }

.col-date { flex: 0 0 140px; padding: 15px 2rem; font-size: 0.85rem; color: #64748b; }
.col-desc { flex: 1; padding: 15px 2rem; font-size: 0.9rem; color: #0f172a; }
.col-cat { flex: 0 0 160px; padding: 15px; display: flex; justify-content: center; }
.col-type { flex: 0 0 120px; padding: 15px; display: flex; justify-content: center; }
.col-amount { flex: 0 0 160px; padding: 15px 2rem; text-align: right; font-weight: 800; font-size: 0.95rem; }
.col-actions { flex: 0 0 80px; padding: 15px; display: flex; justify-content: center; }

.category-chip {
  background: #eef2ff;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.type-text-badge {
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.type-text-badge.income { color: #059669; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; }
.type-text-badge.expense { color: #dc2626; background: #fff1f2; padding: 2px 8px; border-radius: 4px; }

.text-blue { color: #0046ad; }
.text-black { color: #0f172a; }

.btn-more {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 8px;
}

.table-footer {
  padding: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f8fafc;
}

.footer-stats {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1px;
}

.pagination {
  display: flex;
  gap: 2rem;
}

.page-link {
  background: transparent;
  border: none;
  font-size: 0.75rem;
  font-weight: 800;
  color: #1e293b;
  cursor: pointer;
  letter-spacing: 1px;
}

.page-link:hover { color: #0046ad; }

/* Modal Stays similar or refined */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 3000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  letter-spacing: 0.5px;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  background: #f8fafc;
  outline: none;
}

.type-selector {
  display: flex;
  gap: 1rem;
}

.type-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid transparent;
  background: #f1f5f9;
  font-weight: 800;
  cursor: pointer;
  color: #64748b;
}

.type-btn.active.income { background: #e6fffa; color: #38a169; border-color: #38a169; }
.type-btn.active.expense { background: #fff5f5; color: #e53e3e; border-color: #e53e3e; }

.modal-footer {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel {
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: #f1f5f9;
  font-weight: 800;
  cursor: pointer;
}

.btn-save {
  flex: 1.5;
  padding: 1rem;
  border-radius: 12px;
  border: none;
  background: #0046ad;
  color: white;
  font-weight: 800;
  cursor: pointer;
}
</style>
