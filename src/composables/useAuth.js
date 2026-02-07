import { ref, computed } from "vue";
import { useRouter } from "vue-router";

// State
const user = ref(null);
const isAuthenticated = ref(false);
const authError = ref(null);

export function useAuth() {
  const router = useRouter();

  // Initialize users from localStorage or mock data
  const getUsers = () => {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const register = (userData) => {
    const users = getUsers();

    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      authError.value = "El correo electrónico ya está registrado";
      return false;
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this should be hashed
      role: userData.role,
    };

    users.push(newUser);
    saveUsers(users);

    // Auto login after register
    const loginSuccess = login(
      userData.email,
      userData.password,
      userData.role
    );
    return loginSuccess;
  };

  const login = (email, password, requiredRole) => {
    const users = getUsers();
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      if (requiredRole && foundUser.role !== requiredRole) {
        authError.value = `Esta cuenta no tiene permisos de ${requiredRole === "admin" ? "Jefe" : "Trabajador"
          }`;
        isAuthenticated.value = false;
        return false;
      }

      user.value = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      isAuthenticated.value = true;
      authError.value = null;
      localStorage.setItem("currentUser", JSON.stringify(user.value));
      return true;
    } else {
      authError.value = "Credenciales inválidas";
      isAuthenticated.value = false;
      return false;
    }
  };

  const deleteUser = (email) => {
    let users = getUsers();
    const initialLength = users.length;
    users = users.filter(u => u.email !== email);
    if (users.length < initialLength) {
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const updateUser = (originalEmail, updatedData) => {
    let users = getUsers();
    const index = users.findIndex(u => u.email === originalEmail);
    if (index !== -1) {
      // Check if email is being changed and if it already exists
      if (updatedData.email !== originalEmail && users.some(u => u.email === updatedData.email)) {
        return false; // Email already taken
      }
      users[index] = { ...users[index], ...updatedData };
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  // Expose getUsers for management view
  const getAllUsers = () => getUsers();

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    authError.value = null;
    localStorage.removeItem("currentUser");
    if (router) {
      router.push("/login");
    } else {
      window.location.href = "/login";
    }
  };

  const checkAuth = () => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      user.value = JSON.parse(storedUser);
      isAuthenticated.value = true;
    }
  };

  // Check auth on initialization
  checkAuth();

  const isAdmin = computed(() => user.value?.role === "admin");

  return {
    user,
    isAuthenticated,
    isAdmin,
    authError,
    login,
    register,
    logout,
    checkAuth,
    deleteUser,
    updateUser,
    getAllUsers,
  };
}
