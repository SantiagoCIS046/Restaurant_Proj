<template>
  <div class="login-container">
    <!-- Loading Screen -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-screen">
        <div class="loader-content">
          <div class="loader-icon">
            <i class="fas fa-utensils"></i>
          </div>
          <h2 class="loader-text">Restaurant App</h2>
          <div class="spinner"></div>
        </div>
      </div>
    </transition>

    <div class="overlay"></div>
    <transition name="slide-up">
      <div v-if="!isLoading" class="login-card">
        <div class="card-header">
          <div class="icon-header">
            <i class="fas fa-utensils"></i>
          </div>
          <h1>Restaurant App</h1>
          <p class="subtitle">Bienvenido al sistema de gestión</p>
        </div>

        <!-- Main Action Tabs (Login vs Register) -->
        <div class="action-tabs">
          <button
            :class="['action-btn', { active: isLoginMode }]"
            @click="isLoginMode = true"
          >
            Iniciar Sesión
          </button>
          <button
            :class="['action-btn', { active: !isLoginMode }]"
            @click="isLoginMode = false"
          >
            Registrarse
          </button>
        </div>

        <!-- Role Selection for Login -->
        <div v-if="isLoginMode" class="role-selection">
          <p class="section-label">¿Cómo deseas ingresar?</p>
          <div class="role-buttons">
            <button
              :class="['role-btn', { active: selectedLoginRole === 'admin' }]"
              @click="selectedLoginRole = 'admin'"
            >
              <i class="fas fa-user-tie"></i>
              <span>Jefe</span>
            </button>
            <button
              :class="['role-btn', { active: selectedLoginRole === 'user' }]"
              @click="selectedLoginRole = 'user'"
            >
              <i class="fas fa-user-friends"></i>
              <span>Trabajador</span>
            </button>
          </div>
        </div>

        <div class="form-container">
          <!-- LOGIN FORM -->
          <form v-if="isLoginMode" @submit.prevent="handleLoginSubmit">
            <div class="form-group">
              <label for="login-email">Correo Electrónico</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="login-password">Contraseña</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input
                  id="login-password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  class="toggle-password-btn"
                  @click="showPassword = !showPassword"
                >
                  <i
                    :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <div v-if="authError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ authError }}
            </div>

            <button type="submit" class="submit-btn">
              Ingresar como
              {{ selectedLoginRole === "admin" ? "Jefe" : "Trabajador" }}
              <i class="fas fa-arrow-right"></i>
            </button>
          </form>

          <!-- REGISTER FORM -->
          <form v-else @submit.prevent="handleRegisterSubmit">
            <div class="form-group">
              <label for="reg-name">Nombre Completo</label>
              <div class="input-wrapper">
                <i class="fas fa-user"></i>
                <input
                  id="reg-name"
                  v-model="registerForm.name"
                  type="text"
                  placeholder="Tu Nombre"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-email">Correo Electrónico</label>
              <div class="input-wrapper">
                <i class="fas fa-envelope"></i>
                <input
                  id="reg-email"
                  v-model="registerForm.email"
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="reg-password">Contraseña</label>
              <div class="input-wrapper">
                <i class="fas fa-lock"></i>
                <input
                  id="reg-password"
                  v-model="registerForm.password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  minlength="6"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Rol a Desempeñar</label>
              <div class="role-selector-register">
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="registerForm.role"
                    value="admin"
                  />
                  <span class="radio-custom">
                    <i class="fas fa-user-tie"></i>
                    Jefe
                  </span>
                </label>
                <label class="radio-label">
                  <input
                    type="radio"
                    v-model="registerForm.role"
                    value="user"
                  />
                  <span class="radio-custom">
                    <i class="fas fa-user-friends"></i>
                    Trabajador
                  </span>
                </label>
              </div>
            </div>

            <div v-if="authError" class="error-message">
              <i class="fas fa-exclamation-circle"></i>
              {{ authError }}
            </div>

            <button type="submit" class="submit-btn register-btn">
              Crear Cuenta
              <i class="fas fa-user-plus"></i>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { login, register, authError } = useAuth();

const isLoading = ref(true);
const isLoginMode = ref(true);
const selectedLoginRole = ref("admin"); // Default role selection 'admin' (Jefe) or 'user' (Trabajador)
const showPassword = ref(false);

const loginForm = reactive({
  email: "",
  password: "",
});

const registerForm = reactive({
  name: "",
  email: "",
  password: "",
  role: "user",
});

// Show loading screen for 2 seconds on mount
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
});

const handleLoginSubmit = async () => {
  // Pass the selected role to validate if the user matches the intent
  const success = login(
    loginForm.email,
    loginForm.password,
    selectedLoginRole.value
  );
  if (success) {
    // Add a small delay to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/gestion");
  }
};

const handleRegisterSubmit = async () => {
  const success = register({ ...registerForm });
  if (success) {
    // If registration is successful, ensure we update the login view role
    selectedLoginRole.value = registerForm.role;
    // Add a small delay to ensure state is updated
    await new Promise((resolve) => setTimeout(resolve, 100));
    router.push("/gestion");
  }
};

// Function to clear all user accounts and data
const clearAllAccounts = () => {
  if (
    confirm(
      "¿Estás seguro de que quieres eliminar TODAS las cuentas registradas? Esta acción no se puede deshacer."
    )
  ) {
    localStorage.removeItem("users");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("mesasRestaurante");
    localStorage.removeItem("reservasRestaurante");
    localStorage.removeItem("clientesRestaurante");
    alert("Todas las cuentas y datos han sido eliminados exitosamente.");
    // Reload page to reset state
    window.location.reload();
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10%;
  width: 100vw;
  /* Restaurant Background - Full width */
  background-image: url("https://images.unsplash.com/photo-1552566626-52f8b828add9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
}

/* Loading Screen Styles */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loader-content {
  text-align: center;
  color: white;
}

.loader-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  font-size: 3rem;
  color: white;
  box-shadow: 0 10px 30px rgba(237, 137, 54, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

.loader-text {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 2rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #f6ad55;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.6s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(
    0,
    0,
    0,
    0.4
  ); /* Darker overlay for better text contrast on bg */
  z-index: 1;
}

.login-card {
  position: relative;
  /* Transparent Glassmorphism - Optimized */
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  color: white;
  margin: 1rem;
  z-index: 10;
}

.card-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.icon-header {
  width: 70px;
  height: 70px;
  background: linear-gradient(
    135deg,
    #f6ad55 0%,
    #ed8936 100%
  ); /* Orange theme for restaurant */
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.8rem;
  box-shadow: 0 8px 16px rgba(237, 137, 54, 0.4);
  transform: rotate(-5deg);
}

h1 {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 0.25rem;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: #e2e8f0;
  font-size: 1rem;
}

/* Action Tabs */
.action-tabs {
  display: flex;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  color: #cbd5e0;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.active {
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Role Selection */
.role-selection {
  margin-bottom: 1.5rem;
  text-align: center;
}

.section-label {
  font-size: 0.9rem;
  color: #e2e8f0;
  margin-bottom: 0.5rem;
}

.role-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.role-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.role-btn.active {
  background: rgba(237, 137, 54, 0.8);
  border-color: #f6ad55;
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.3);
}

.role-btn i {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.role-btn span {
  font-weight: 600;
  font-size: 0.9rem;
}

/* Forms */
.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #2c2c2c;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.892);
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4a5568;
  transition: color 0.3s ease;
  z-index: 10;
}

.input-wrapper input {
  width: 97%;
  padding: 0.85rem 1rem 0.85rem 2.8rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8); /* Semi-transparent white input */
  backdrop-filter: blur(4px);
  color: #2d3748;
  box-sizing: border-box; /* Prevent padding from increasing width */
}

.input-wrapper input:focus {
  outline: none;
  border-color: #ed8936;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 3px rgba(237, 137, 54, 0.2);
}

.toggle-password-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toggle-password-btn:hover {
  color: #2d3748;
}

/* Role Selector Register */
.role-selector-register {
  display: flex;
  gap: 1rem;
}

.radio-label {
  flex: 1;
  cursor: pointer;
  position: relative;
}

.radio-label input {
  position: absolute;
  opacity: 0;
}

.radio-custom {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #e2e8f0;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 0.9rem;
  gap: 0.3rem;
  background: rgba(0, 0, 0, 0.2);
}

.radio-label input:checked + .radio-custom {
  border-color: #f6ad55;
  background: rgba(237, 137, 54, 0.7);
  color: white;
}

/* Buttons */
.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #ed8936 0%, #c05621 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(237, 137, 54, 0.4);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(237, 137, 54, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

.submit-btn.register-btn {
  background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.4);
}

.error-message {
  background: rgba(229, 62, 62, 0.2);
  color: #fc8181;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(229, 62, 62, 0.5);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
}

/* Responsive Design */
/* Tablet */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 1.75rem;
    max-width: 500px;
    margin: 0.5rem;
  }

  h1 {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.95rem;
  }

  .icon-header {
    width: 65px;
    height: 65px;
    font-size: 1.6rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .input-wrapper input {
    font-size: 0.9rem;
    padding: 0.9rem 1rem 0.9rem 2.8rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .login-container {
    padding: 0.5rem;
    align-items: flex-start;
    padding-top: 2rem;
  }

  .login-card {
    padding: 1.25rem;
    max-width: 100%;
    margin: 0.5rem;
    backdrop-filter: none; /* Disable blur on mobile for max performance */
    -webkit-backdrop-filter: none;
    background: rgba(255, 255, 255, 0.96);
    border-radius: 16px;
  }

  h1 {
    font-size: 1.4rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .icon-header {
    width: 55px;
    height: 55px;
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }

  .card-header {
    margin-bottom: 1.25rem;
  }

  .role-buttons {
    flex-direction: row;
    gap: 0.5rem;
  }

  .role-btn {
    padding: 0.65rem 0.5rem;
  }

  .role-btn i {
    font-size: 1.15rem;
    margin-bottom: 0.3rem;
  }

  .role-btn span {
    font-size: 0.75rem;
  }

  .action-tabs {
    margin-bottom: 1rem;
  }

  .action-btn {
    padding: 0.65rem;
    font-size: 0.85rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
  }

  .input-wrapper input {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: 0.75rem 1rem 0.75rem 2.6rem;
  }

  .loader-text {
    font-size: 1.75rem;
  }

  .loader-icon {
    width: 75px;
    height: 75px;
    font-size: 2.25rem;
  }

  .section-label {
    font-size: 0.85rem;
  }

  .role-selector-register {
    gap: 0.75rem;
  }

  .radio-custom {
    padding: 0.65rem;
    font-size: 0.85rem;
  }

  .submit-btn {
    padding: 0.85rem;
    font-size: 0.95rem;
  }

  .toggle-password-btn {
    right: 0.75rem;
  }

  .error-message {
    font-size: 0.85rem;
    padding: 0.65rem;
  }
}

/* Extra small devices */
@media (max-width: 360px) {
  .login-card {
    padding: 1rem;
    margin: 0.25rem;
  }

  h1 {
    font-size: 1.25rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .icon-header {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .role-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .role-btn {
    padding: 0.75rem;
  }

  .action-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
  }

  .input-wrapper input {
    padding: 0.7rem 1rem 0.7rem 2.5rem;
  }

  .submit-btn {
    padding: 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
