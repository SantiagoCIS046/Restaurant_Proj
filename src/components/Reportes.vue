<template>
  <div class="reportes-container">
    <div class="hero-section">
      <h1 class="hero-title">📊 Reportes y Estadísticas</h1>
      <p class="hero-subtitle">
        Visualiza el rendimiento del restaurante con reportes detallados y
        gráficos interactivos.
      </p>
    </div>

    <!-- Filtro de Fecha -->
    <div class="filter-section">
      <div class="date-filter">
        <label for="dateFilter" class="filter-label">Seleccionar Fecha:</label>
        <input
          type="date"
          id="dateFilter"
          v-model="selectedDate"
          class="date-input"
        />
      </div>
    </div>

    <!-- Métricas Rápidas -->
    <div class="metrics-section">
      <div
        class="metric-card"
        @click="switchMetric('ventas')"
        :class="{ 'metric-active': activeMetric === 'ventas' }"
      >
        <h3>Total Ventas</h3>
        <p>{{ totalVentas }}</p>
      </div>
      <div
        class="metric-card"
        @click="switchMetric('pedidos')"
        :class="{ 'metric-active': activeMetric === 'pedidos' }"
      >
        <h3>Pedidos Hoy</h3>
        <p>{{ totalPedidos }}</p>
      </div>
      <div
        class="metric-card"
        @click="switchMetric('clientes')"
        :class="{ 'metric-active': activeMetric === 'clientes' }"
      >
        <h3>Clientes Atendidos</h3>
        <p>{{ totalClientes }}</p>
      </div>
    </div>

    <!-- Gráfico -->
    <div class="chart-section">
      <h2 class="chart-title">{{ chartTitle }}</h2>
      <div class="report-buttons">
        <button
          @click="switchReport('ventas')"
          :class="[
            'btn',
            activeReport === 'ventas' ? 'btn-active' : 'btn-outline',
          ]"
        >
          Ventas
        </button>
        <button
          @click="switchReport('mesas')"
          :class="[
            'btn',
            activeReport === 'mesas' ? 'btn-active' : 'btn-outline',
          ]"
        >
          Gestión de Mesas
        </button>
      </div>
      <div class="chart-controls">
        <button @click="changeChartType('line')" class="btn btn-primary">
          Línea
        </button>
        <button @click="changeChartType('bar')" class="btn btn-secondary">
          Barra
        </button>
        <button @click="toggleViewMode" class="btn btn-outline">
          {{ viewMode === "day" ? "Ver Semana" : "Ver Día" }}
        </button>
        <button @click="resetChart" class="btn btn-outline">Resetear</button>
        <button @click="exportToCSV" class="btn btn-success">
          Exportar CSV
        </button>
      </div>
      <div class="average-display">
        <p>Promedio: {{ averageValue }}</p>
      </div>
      <div class="chart-container">
        <canvas id="salesChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import Chart from "chart.js/auto";

const selectedDate = ref(new Date().toISOString().split("T")[0]);
const activeReport = ref("ventas");
const activeMetric = ref("ventas");
const chartTitle = ref("Gráfico de Ventas");
const viewMode = ref("day"); // 'day' or 'week'
let chartInstance = null;

const selectedDayIndex = computed(() => {
  if (!selectedDate.value) return null;
  const date = new Date(selectedDate.value);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  // Adjust to match our labels: Lun=0, Mar=1, Mié=2, Jue=3, Vie=4, Sáb=5, Dom=6
  const adjustedDay = day === 0 ? 6 : day - 1;
  return adjustedDay;
});

const reportData = {
  ventas: {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
    pedidos: [100, 150, 120, 200, 180, 250, 220],
    clientes: [200, 300, 240, 400, 360, 500, 440],
    label: "Ventas Diarias ($)",
    color: "#3498db",
    tooltipLabel: "Ventas",
    currency: true,
  },
  mesas: {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    data: [80, 120, 100, 150, 180, 200, 160],
    pedidos: [80, 120, 100, 150, 180, 200, 160],
    clientes: [160, 240, 200, 300, 360, 400, 320],
    label: "Mesas Ocupadas",
    color: "#e74c3c",
    tooltipLabel: "Mesas",
    currency: false,
  },
};

const totalVentas = computed(() => {
  const currentData = reportData[activeReport.value];
  if (isFutureDate.value) {
    return "N/A";
  }
  if (viewMode.value === "day" && selectedDayIndex.value !== null) {
    const value = currentData.data[selectedDayIndex.value];
    return value.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
    });
  }
  const sum = currentData.data.reduce((a, b) => a + b, 0);
  return sum.toLocaleString("es-CO", { style: "currency", currency: "COP" });
});

// Computed para obtener las ventas totales del día seleccionado
const ventasDelDia = computed(() => {
  if (isFutureDate.value || selectedDayIndex.value === null) {
    return 0;
  }
  return reportData[activeReport.value].data[selectedDayIndex.value];
});

const totalPedidos = computed(() => {
  const currentData = reportData[activeReport.value];
  if (isFutureDate.value) {
    return "N/A";
  }
  if (viewMode.value === "day" && selectedDayIndex.value !== null) {
    return currentData.pedidos[selectedDayIndex.value];
  }
  const sum = currentData.pedidos.reduce((a, b) => a + b, 0);
  return sum;
});

const totalClientes = computed(() => {
  const currentData = reportData[activeReport.value];
  if (isFutureDate.value) {
    return "N/A";
  }
  if (viewMode.value === "day" && selectedDayIndex.value !== null) {
    return currentData.clientes[selectedDayIndex.value];
  }
  const sum = currentData.clientes.reduce((a, b) => a + b, 0);
  return sum;
});

const isFutureDate = computed(() => {
  if (!selectedDate.value) return false;
  const today = new Date().toISOString().split("T")[0];
  return selectedDate.value > today;
});

const isPastDate = computed(() => {
  if (!selectedDate.value) return false;
  const today = new Date().toISOString().split("T")[0];
  return selectedDate.value < today;
});

const averageValue = computed(() => {
  const currentData = reportData[activeReport.value];
  const sum = currentData.data.reduce((a, b) => a + b, 0);
  const avg = sum / currentData.data.length;
  if (currentData.currency) {
    return avg.toLocaleString("es-CO", { style: "currency", currency: "COP" });
  } else {
    return Math.round(avg) + " mesas";
  }
});

onMounted(() => {
  const ctx = document.getElementById("salesChart").getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
      datasets: [
        {
          label: "Ventas Diarias ($)",
          data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#3498db",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            font: {
              size: 14,
              weight: "bold",
            },
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          titleColor: "#fff",
          bodyColor: "#fff",
          borderColor: "#3498db",
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: false,
          callbacks: {
            label: function (context) {
              return `Ventas: ${context.parsed.y.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
              })}`;
            },
          },
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuart",
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
            lineWidth: 1,
          },
          ticks: {
            callback: function (value) {
              return value.toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
              });
            },
            font: {
              size: 12,
              weight: "500",
            },
          },
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  });
});

const switchReport = (reportType) => {
  activeReport.value = reportType;
  const data = reportData[reportType];

  if (reportType === "ventas") {
    chartTitle.value = "Gráfico de Ventas";
  } else {
    chartTitle.value = "Gráfico de Gestión de Mesas";
  }

  if (chartInstance) {
    chartInstance.data.labels =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.labels[selectedDayIndex.value]]
        : data.labels;
    chartInstance.data.datasets[0].data =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.data[selectedDayIndex.value]]
        : data.data;
    chartInstance.data.datasets[0].label = data.label;
    chartInstance.data.datasets[0].borderColor = data.color;
    chartInstance.data.datasets[0].backgroundColor = `rgba(${data.color.slice(
      1,
      3
    )}, ${data.color.slice(3, 5)}, ${data.color.slice(5, 7)}, 0.1)`;
    chartInstance.data.datasets[0].pointBackgroundColor = data.color;

    // Update tooltip callback
    chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
      if (data.currency) {
        return `${data.tooltipLabel}: ${context.parsed.y.toLocaleString(
          "es-CO",
          {
            style: "currency",
            currency: "COP",
          }
        )}`;
      } else {
        return `${data.tooltipLabel}: ${context.parsed.y}`;
      }
    };

    // Update Y axis ticks
    chartInstance.options.scales.y.ticks.callback = function (value) {
      if (data.currency) {
        return value.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        });
      } else {
        return value;
      }
    };

    chartInstance.update();
  }
};

const changeChartType = (type) => {
  if (chartInstance) {
    chartInstance.config.type = type;
    chartInstance.update();
  }
};

const switchMetric = (metricType) => {
  activeMetric.value = metricType;
  const data = reportData[activeReport.value];

  if (metricType === "ventas") {
    chartInstance.data.datasets[0].data =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.data[selectedDayIndex.value]]
        : data.data;
    chartInstance.data.labels =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.labels[selectedDayIndex.value]]
        : data.labels;
    chartInstance.data.datasets[0].label = data.label;
  } else if (metricType === "pedidos") {
    chartInstance.data.datasets[0].data =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.pedidos[selectedDayIndex.value]]
        : data.pedidos;
    chartInstance.data.labels =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.labels[selectedDayIndex.value]]
        : data.labels;
    chartInstance.data.datasets[0].label = "Pedidos Diarios";
  } else if (metricType === "clientes") {
    chartInstance.data.datasets[0].data =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.clientes[selectedDayIndex.value]]
        : data.clientes;
    chartInstance.data.labels =
      viewMode.value === "day" && selectedDayIndex.value !== null
        ? [data.labels[selectedDayIndex.value]]
        : data.labels;
    chartInstance.data.datasets[0].label = "Clientes Diarios";
  }

  // Update tooltip callback based on metric
  chartInstance.options.plugins.tooltip.callbacks.label = function (context) {
    if (metricType === "ventas" && data.currency) {
      return `${data.tooltipLabel}: ${context.parsed.y.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      })}`;
    } else {
      return `${metricType.charAt(0).toUpperCase() + metricType.slice(1)}: ${
        context.parsed.y
      }`;
    }
  };

  // Update Y axis ticks based on metric
  chartInstance.options.scales.y.ticks.callback = function (value) {
    if (metricType === "ventas" && data.currency) {
      return value.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
      });
    } else {
      return value;
    }
  };

  chartInstance.update();
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === "day" ? "week" : "day";
  // Re-trigger the current metric to update the chart
  switchMetric(activeMetric.value);
};

const resetChart = () => {
  if (chartInstance) {
    chartInstance.data.labels = [];
    chartInstance.data.datasets[0].data = [];
    chartInstance.update();
  }
};

const exportToCSV = () => {
  const data = reportData[activeReport.value];
  const currentLabels =
    viewMode.value === "day" && selectedDayIndex.value !== null
      ? [data.labels[selectedDayIndex.value]]
      : data.labels;
  const currentData =
    viewMode.value === "day" && selectedDayIndex.value !== null
      ? [data.data[selectedDayIndex.value]]
      : data.data;
  const currentPedidos =
    viewMode.value === "day" && selectedDayIndex.value !== null
      ? [data.pedidos[selectedDayIndex.value]]
      : data.pedidos;
  const currentClientes =
    viewMode.value === "day" && selectedDayIndex.value !== null
      ? [data.clientes[selectedDayIndex.value]]
      : data.clientes;

  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Día," + data.label + ",Pedidos,Clientes\n";

  currentLabels.forEach((label, index) => {
    const value = currentData[index];
    const pedidos = currentPedidos[index];
    const clientes = currentClientes[index];
    csvContent += `${label},${value},${pedidos},${clientes}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `reporte_${activeReport.value}_${
      new Date().toISOString().split("T")[0]
    }.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<style scoped>
.reportes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-title {
  font-size: 2.5em;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.2em;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0 auto;
}

.filter-section {
  margin-bottom: 40px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.date-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.filter-label {
  font-weight: 600;
  color: #34495e;
  font-size: 1.1em;
}

.date-input {
  padding: 10px 15px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #3498db;
}

.metrics-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.metric-card {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.metric-active {
  background: linear-gradient(135deg, #3498db68, #297fb94e);
  color: white;
  transform: scale(1.05);
}

.metric-active h3 {
  color: white;
}

.metric-active p {
  color: white;
}

.metric-card h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.2em;
  font-weight: 600;
}

.metric-card p {
  margin: 0;
  font-size: 2em;
  font-weight: 700;
  color: #27ae60;
}

.chart-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
}

.chart-title {
  text-align: center;
  font-size: 1.8em;
  margin-bottom: 25px;
  color: #2c3e50;
  font-weight: 700;
}

.chart-controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e74c3c;
  color: white;
}

.btn-secondary:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  color: #7f8c8d;
  border: 2px solid #7f8c8d;
}

.btn-outline:hover {
  background: #7f8c8d;
  color: white;
  transform: translateY(-2px);
}

.btn-active {
  background: #27ae60 !important;
  color: white !important;
  border: 2px solid #27ae60 !important;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-2px);
}

.report-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.average-display {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2em;
  font-weight: 600;
  color: #2c3e50;
}

.chart-container {
  margin: 0 auto;
  max-width: 500px;
  height: 250px;
}

@media (max-width: 768px) {
  .reportes-container {
    padding: 10px;
  }

  .hero-title {
    font-size: 2em;
  }

  .metrics-section {
    grid-template-columns: 1fr;
  }

  .chart-controls {
    flex-direction: column;
    align-items: center;
  }

  .date-filter {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
