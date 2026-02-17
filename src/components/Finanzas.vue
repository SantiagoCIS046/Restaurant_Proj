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
      <div class="card income">
        <div class="card-icon"><i class="fas fa-arrow-up"></i></div>
        <div class="card-info">
          <h3>Ingresos</h3>
          <p>{{ formatCurrency(totalIncome) }}</p>
        </div>
      </div>
      <div class="card expense">
        <div class="card-icon"><i class="fas fa-arrow-down"></i></div>
        <div class="card-info">
          <h3>Gastos</h3>
          <p>{{ formatCurrency(totalExpense) }}</p>
        </div>
      </div>
      <div class="card balance">
        <div class="card-icon"><i class="fas fa-wallet"></i></div>
        <div class="card-info">
          <h3>Balance</h3>
          <p :class="{ 'text-red': totalBalance < 0, 'text-green': totalBalance >= 0 }">
            {{ formatCurrency(totalBalance) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Charts & Main Content -->
    <div class="main-grid">
      <!-- Chart Section -->
      <div class="chart-section">
        <h2 class="section-title">Resumen Financiero</h2>
        <div class="chart-container">
          <canvas id="financeChart"></canvas>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="actions-section">
        <button class="btn-add" @click="showAddModal = true">
          <i class="fas fa-plus"></i> Registrar Movimiento
        </button>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="transactions-section">
      <h2 class="section-title">Movimientos Recientes</h2>
      <div class="table-container">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="6" class="no-data">No hay movimientos registrados para esta fecha.</td>
            </tr>
            <tr v-for="t in filteredTransactions" :key="t.id">
              <td>{{ formatDate(t.date) }}</td>
              <td>{{ t.description }}</td>
              <td>
                <span class="badge category-badge">{{ t.category }}</span>
              </td>
              <td>
                <span :class="['badge', t.type === 'income' ? 'badge-income' : 'badge-expense']">
                  {{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}
                </span>
              </td>
              <td :class="t.type === 'income' ? 'text-green' : 'text-red'">
                {{ t.type === 'income' ? '+' : '-' }}{{ formatCurrency(t.amount) }}
              </td>
              <td>
                <button class="btn-icon delete" @click="deleteTransaction(t.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  color: #2d3748;
  padding-bottom: 80px; /* Space for footer/nav if needed */
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
  font-weight: 700;
  color: #e2e8f0; /* Light text for dark bg assumption or dark mode */
}

/* Adjust if global bg is light, but based on NavBar it seems dark theme oriented or mixed. 
   Let's check other components. NavBar is dark. Reportes is light gradient. 
   Let's assume a light card on a potentially light/gradient background from App?
   Actually Reportes has its own background styling. Let's start neutral/light for content.
*/
.finanzas-container {
  /* Using similar background to Reportes */
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: calc(100vh - 60px); /* Adjust for navbar */
  margin-top: 50px; /* Navbar height */
  border-radius: 8px;
}

.page-title {
  color: #2c3e50; /* Darker for light background */
}

.date-input {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
  font-size: 1rem;
  outline: none;
}

/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.1);
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.income .card-icon { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); }
.expense .card-icon { background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%); }
.balance .card-icon { background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); }

.card-info h3 {
  font-size: 0.9rem;
  color: #718096;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-info p {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.text-green { color: #38a169; }
.text-red { color: #e53e3e; }

/* Grid Layout */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}

.chart-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-container {
  flex: 1;
  position: relative;
  width: 100%;
}

.actions-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-add {
  background: #3182ce;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
}

.btn-add:hover {
  background: #2b6cb0;
}

/* Transactions Table */
.transactions-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  text-align: left;
  padding: 1rem;
  background: #f7fafc;
  color: #4a5568;
  font-weight: 600;
  font-size: 0.9rem;
}

.transactions-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #2d3748;
}

.transactions-table tr:last-child td {
  border-bottom: none;
}

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-badge {
  background: #edf2f7;
  color: #4a5568;
}

.badge-income {
  background: #c6f6d5;
  color: #22543d;
}

.badge-expense {
  background: #fed7d7;
  color: #822727;
}

.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
  color: #a0aec0;
}

.btn-icon:hover {
  background: #edf2f7;
  color: #e53e3e;
}

.no-data {
  text-align: center;
  color: #a0aec0;
  padding: 2rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-close {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #718096;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

.type-selector {
  display: flex;
  gap: 0.5rem;
}

.type-btn {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  background: #f7fafc;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.type-btn.active.income {
  background: #c6f6d5;
  color: #22543d;
  border-color: #9ae6b4;
}

.type-btn.active.expense {
  background: #fed7d7;
  color: #822727;
  border-color: #feb2b2;
}

.btn-save {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}
</style>
