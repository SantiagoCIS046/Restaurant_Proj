import { createApp } from "vue";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.css";
import App from "./App.vue";
import router from "./routes/route.js";

// Crear la aplicación Vue
const app = createApp(App);

// Usar Vue Router
app.use(router);

// Montar la aplicación
app.mount("#app");
