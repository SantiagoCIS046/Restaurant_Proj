<template>
  <div class="settings-container">
    <!-- Sidebar Navigation -->
    <aside class="settings-sidebar">
      <div class="sidebar-header">
        <h2><i class="fas fa-cogs"></i> Configuración</h2>
      </div>
      <nav class="settings-nav">
        <button 
          v-for="section in sections" 
          :key="section.id" 
          :class="['nav-item', { active: activeSection === section.id }]"
          @click="activeSection = section.id"
        >
          <i :class="section.icon"></i>
          <span>{{ section.label }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="settings-content">
      <header class="content-header">
        <h1>{{ currentSectionLabel }}</h1>
        <p>{{ currentSectionDescription }}</p>
      </header>

      <div class="content-body">
        
        <!-- 1. Opciones (General) -->
        <div v-if="activeSection === 'opciones'" class="section-panel">
          <div class="form-group">
            <label>Nombre del Restaurante</label>
            <input v-model="settings.general.name" type="text" placeholder="Ej: Restaurant El Buen Sabor" />
          </div>
          <div class="form-group">
            <label>NIT / Identificación Tributaria</label>
            <input v-model="settings.general.nit" type="text" placeholder="Ej: 900.123.456-7" />
          </div>
          <div class="form-group">
            <label>Dirección</label>
            <input v-model="settings.general.address" type="text" placeholder="Calle 123 # 45-67" />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="settings.general.phone" type="tel" placeholder="+57 300 123 4567" />
          </div>
          <div class="form-group">
            <label>Correo Electrónico</label>
            <input v-model="settings.general.email" type="email" placeholder="contacto@restaurante.com" />
          </div>
          <div class="actions">
            <button class="btn-primary" @click="handleSave">Guardar Cambios</button>
          </div>
        </div>

        <!-- 2. Ajustes (System Behavior) -->
        <div v-if="activeSection === 'ajustes'" class="section-panel">
          <div class="toggle-group">
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Habilitar Propinas</h4>
                <p>Permitir agregar propinas en el proceso de pago.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.behavior.enableTips">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Permitir Stock Negativo</h4>
                <p>Permitir ventas de productos sin inventario suficiente.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.behavior.allowNegativeStock">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Impresión Automática</h4>
                <p>Imprimir recibo automáticamente al finalizar venta.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.behavior.autoPrint">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Mostrar Imágenes en Menú</h4>
                <p>Visualizar imágenes de productos en el punto de venta.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.behavior.showMenuImages">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div class="actions">
            <button class="btn-primary" @click="handleSave">Guardar Ajustes</button>
          </div>
        </div>

        <!-- 3. Base de Datos -->
        <div v-if="activeSection === 'database'" class="section-panel">
          <div class="warning-box">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Precaución: Cambiar estos ajustes puede desconectar el sistema.</p>
          </div>
          <div class="form-group">
            <label>Host</label>
            <input v-model="settings.database.host" type="text" placeholder="localhost" />
          </div>
          <div class="form-group">
            <label>Puerto</label>
            <input v-model="settings.database.port" type="number" placeholder="5432" />
          </div>
          <div class="form-group">
            <label>Nombre de Base de Datos</label>
            <input v-model="settings.database.name" type="text" placeholder="restaurant_db" />
          </div>
          <div class="form-group">
            <label>Usuario</label>
            <input v-model="settings.database.user" type="text" placeholder="admin" />
          </div>
          <div class="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="********" />
          </div>
          <div class="actions">
            <button class="btn-outline" @click="testConnection">Probar Conexión</button>
            <button class="btn-primary" @click="handleSave">Guardar Configuración</button>
          </div>
        </div>

        <!-- 4. Seguridad -->
        <div v-if="activeSection === 'seguridad'" class="section-panel">
          <div class="toggle-group">
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Autenticación de Dos Factores (2FA)</h4>
                <p>Requerir un código adicional al iniciar sesión.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.security.twoFactor">
                <span class="slider round"></span>
              </label>
            </div>
            <div class="toggle-item">
              <div class="toggle-info">
                <h4>Cierre de Sesión Automático</h4>
                <p>Cerrar sesión tras 30 minutos de inactividad.</p>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.security.autoLogout">
                <span class="slider round"></span>
              </label>
            </div>
          </div>
          <div class="actions">
            <button class="btn-danger" @click="changeAdminPassword">Cambiar Contraseña de Administrador</button>
            <button class="btn-primary" @click="handleSave">Guardar Seguridad</button>
          </div>
        </div>

        <!-- 5. Notificaciones -->
        <div v-if="activeSection === 'notificaciones'" class="section-panel">
          <div class="options-group">
            <h4>Alertas del Sistema</h4>
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.lowStock">
              <span>Alerta de Stock Bajo</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.newOrderSound">
              <span>Sonido al recibir nuevo pedido</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="settings.notifications.dailyReport">
              <span>Recibir reporte diario por correo</span>
            </label>
          </div>
          <div class="actions">
            <button class="btn-primary" @click="handleSave">Guardar Preferencias</button>
          </div>
        </div>

        <!-- 6. Idioma -->
        <div v-if="activeSection === 'idioma'" class="section-panel">
          <div class="form-group">
            <label>Idioma del Sistema</label>
            <select v-model="settings.language" class="full-width">
              <option value="es">Español (Latinoamérica)</option>
              <option value="en">English (US)</option>
              <option value="pt">Português (Brasil)</option>
            </select>
          </div>
          <p class="info-text">Nota: Algunos cambios pueden requerir reiniciar la aplicación.</p>
          <div class="actions">
            <button class="btn-primary" @click="handleSave">Aplicar Idioma</button>
          </div>
        </div>

        <!-- 7. Tema -->
        <div v-if="activeSection === 'tema'" class="section-panel">
          <div class="theme-selector">
            <div 
              class="theme-card" 
              :class="{ active: settings.theme === 'light' }"
              @click="settings.theme = 'light'"
            >
              <div class="theme-preview light"></div>
              <span>Claro</span>
            </div>
            <div 
              class="theme-card" 
              :class="{ active: settings.theme === 'dark' }"
              @click="settings.theme = 'dark'"
            >
              <div class="theme-preview dark"></div>
              <span>Oscuro</span>
            </div>
            <div 
              class="theme-card" 
              :class="{ active: settings.theme === 'system' }"
              @click="settings.theme = 'system'"
            >
              <div class="theme-preview system"></div>
              <span>Sistema</span>
            </div>
          </div>
          <div class="actions">
            <button class="btn-primary" @click="handleSave">Aplicar Tema</button>
          </div>
        </div>

        <!-- 8. Backup -->
        <div v-if="activeSection === 'backup'" class="section-panel">
          <div class="backup-info">
            <i class="fas fa-cloud-download-alt big-icon"></i>
            <h3>Copia de Seguridad y Restauración</h3>
            <p>Guarda una copia de todos los datos del sistema o restaura una versión osterior.</p>
          </div>
          <div class="backup-actions">
            <button class="btn-primary large" @click="createBackup">
              <i class="fas fa-download"></i> Descargar Copia de Seguridad
            </button>
            <div class="restore-zone">
              <label>Restaurar desde archivo:</label>
              <input type="file" @change="restoreBackup" accept=".json" />
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useSettings } from '../composables/useSettings';
import { useTheme } from '../composables/useTheme';

// Section Management
const activeSection = ref("opciones");

const sections = [
  { id: "opciones", label: "Opciones Generales", icon: "fas fa-store", desc: "Configura la información básica del restaurante." },
  { id: "ajustes", label: "Ajustes del Sistema", icon: "fas fa-sliders-h", desc: "Personaliza el comportamiento de la aplicación." },
  { id: "database", label: "Base de Datos", icon: "fas fa-database", desc: "Gestiona la conexión y almacenamiento de datos." },
  { id: "seguridad", label: "Seguridad", icon: "fas fa-shield-alt", desc: "Administra contraseñas y acceso." },
  { id: "notificaciones", label: "Notificaciones", icon: "fas fa-bell", desc: "Configura alertas y avisos." },
  { id: "idioma", label: "Idioma", icon: "fas fa-language", desc: "Selecciona el idioma de la interfaz." },
  { id: "tema", label: "Tema & Apariencia", icon: "fas fa-palette", desc: "Cambia el aspecto visual de la aplicación." },
  { id: "backup", label: "Copias de Seguridad", icon: "fas fa-download", desc: "Respalda y restaura tu información." }
];

const currentSectionLabel = computed(() => sections.find(s => s.id === activeSection.value)?.label);
const currentSectionDescription = computed(() => sections.find(s => s.id === activeSection.value)?.desc);

// Global Settings State
const { settings, loadSettings, saveSettings } = useSettings();

// Theme Management
const { setTheme } = useTheme();

// Watch for theme changes in settings and apply them
watch(() => settings.theme, (newTheme) => {
  setTheme(newTheme);
});

// Methods
const handleSave = () => {
  saveSettings(); // Actually auto-saves, but visual feedback is good
  alert('Configuración guardada exitosamente.');
};

const testConnection = () => {
  // Simulate connection check
  const { host, port } = settings.database;
  alert(`Conectando a ${host}:${port}... \nConexión a base de datos establecida correctamente (Simulado).`);
};

const changeAdminPassword = () => {
  const newPass = prompt("Ingrese nueva contraseña:");
  if(newPass) alert("Contraseña actualizada (Simulado).");
};

const createBackup = () => {
  const data = JSON.stringify(localStorage);
  const blob = new Blob([data], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup_restaurante_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const restoreBackup = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      // Validate structure roughly
      if (typeof data === 'object') {
        // Clear current storage and replace
        localStorage.clear();
        Object.keys(data).forEach(key => {
          localStorage.setItem(key, data[key]);
        });
        alert("Restauración completada. La página se recargará.");
        window.location.reload();
      } else {
        alert("Formato de archivo inválido.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al leer el archivo de respaldo.");
    }
  };
  reader.readAsText(file);
};

onMounted(() => {
  loadSettings();
});

</script>

<style scoped>
.settings-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background: #f0f2f5;
  margin-top: 50px; /* Offset for top navbar */
}

/* Sidebar */
.settings-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.sidebar-header h2 {
  font-size: 1.25rem;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.settings-nav {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #4a5568;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.nav-item:hover {
  background: #edf2f7;
  color: #2d3748;
}

.nav-item.active {
  background: #ebf8ff;
  color: #3182ce;
  font-weight: 600;
}

.nav-item i {
  width: 24px;
  text-align: center;
}

/* Content Area */
.settings-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content-header {
  margin-bottom: 2rem;
}

.content-header h1 {
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.content-header p {
  color: #718096;
}

.section-panel {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  max-width: 800px;
}

/* Forms */
.form-group {
  margin-bottom: 1.5rem;
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
  border: 1px solid #cbd5e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus, 
.form-group select:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
}

/* Actions */
.actions {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-primary {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #2b6cb0;
}

.btn-outline {
  background: transparent;
  color: #3182ce;
  border: 1px solid #3182ce;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-danger {
  background: transparent;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Toggles & Checkboxes */
.toggle-group, .options-group {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.toggle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #edf2f7;
}

.toggle-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2d3748;
}

.toggle-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #718096;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem 0;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e0;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: #3182ce;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  gap: 2rem;
}

.theme-card {
  cursor: pointer;
  text-align: center;
}

.theme-preview {
  width: 120px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid #edf2f7;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.theme-card.active .theme-preview {
  border-color: #3182ce;
  box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.1);
}

.theme-preview.light { background: white; }
.theme-preview.dark { background: #1a202c; }
.theme-preview.system { background: linear-gradient(90deg, white 50%, #1a202c 50%); }

/* Warning Box */
.warning-box {
  background: #fff5f5;
  border: 1px solid #feb2b2;
  color: #c53030;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Backup */
.backup-info {
  text-align: center;
  margin-bottom: 3rem;
}

.big-icon {
  font-size: 4rem;
  color: #3182ce;
  margin-bottom: 1rem;
}

.backup-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.restore-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-container {
    flex-direction: column;
  }
  
  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0.5rem;
  }
  
  .nav-item span {
    display: none; /* Icons only on mobile to save space */
  }
  
  .nav-item {
    justify-content: center;
  }
  
  .settings-content {
    padding: 1rem;
  }
}
</style>
