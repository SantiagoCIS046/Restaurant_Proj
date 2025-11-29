<template>
  <div class="container py-3">
    <h1>Características</h1>
    <p>
      Configura las opciones y ajustes del sistema de gestión de restaurantes.
    </p>
    <div class="features-grid">
      <div class="feature-card">
        <i class="fas fa-cog"></i>
        <h3>Opciones</h3>
        <p>Configuraciones generales del sistema.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-tools"></i>
        <h3>Ajustes</h3>
        <p>Personaliza el comportamiento de la aplicación.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-database"></i>
        <h3>Base de Datos</h3>
        <p>Gestiona la configuración de la base de datos.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-shield-alt"></i>
        <h3>Seguridad</h3>
        <p>Configura permisos y seguridad del sistema.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-bell"></i>
        <h3>Notificaciones</h3>
        <p>Administra alertas y notificaciones.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-language"></i>
        <h3>Idioma</h3>
        <p>Cambia el idioma de la aplicación.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-palette"></i>
        <h3>Tema</h3>
        <p>Personaliza el aspecto visual.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-download"></i>
        <h3>Backup</h3>
        <p>Realiza copias de seguridad.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Agrega aquí cualquier dato o método reactivo necesario
</script>

<style scoped>
@import "../style.css";

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.feature-card i {
  font-size: 2rem;
  color: #3182ce;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.feature-card p {
  color: #718096;
  font-size: 0.9rem;
}
</style>
