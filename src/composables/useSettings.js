import { ref, reactive, watch } from 'vue';

const settings = reactive({
    general: {
        name: "Mi Restaurante",
        nit: "",
        address: "",
        phone: "",
        email: ""
    },
    behavior: {
        enableTips: true,
        allowNegativeStock: false,
        autoPrint: false,
        showMenuImages: true
    },
    database: {
        host: "localhost",
        port: 5432,
        name: "restaurant_db",
        user: "admin"
    },
    security: {
        twoFactor: false,
        autoLogout: true
    },
    notifications: {
        lowStock: true,
        newOrderSound: true,
        dailyReport: false
    },
    language: "es",
    theme: "light"
});

// Simple translation helper (can be expanded)
const translations = {
    es: {
        "dashboard": "Panel de Control",
        "tables": "Mesas",
        "menu": "Menú",
        "settings": "Configuración",
        "register": "Registro",
        "clients": "Clientes",
        "inventory": "Inventario",
        "staff": "Personal",
        "orders": "Pedidos",
        "reports": "Reportes",
        "finances": "Finanzas"
    },
    en: {
        "dashboard": "Dashboard",
        "tables": "Tables",
        "menu": "Menu",
        "settings": "Settings",
        "register": "Register",
        "clients": "Clients",
        "inventory": "Inventory",
        "staff": "Staff",
        "orders": "Orders",
        "reports": "Reports",
        "finances": "Finances"
    },
    pt: {
        "dashboard": "Painel",
        "tables": "Mesas",
        "menu": "Cardápio",
        "settings": "Configurações",
        "register": "Registro",
        "clients": "Clientes",
        "inventory": "Inventário",
        "staff": "Funcionários",
        "orders": "Pedidos",
        "reports": "Relatórios",
        "finances": "Finanças"
    }
};

export function useSettings() {

    const loadSettings = () => {
        const saved = localStorage.getItem('app_settings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge saved settings with defaults to ensure structure
                Object.assign(settings, parsed);

                // Ensure nested objects are also merged correctly if needed
                // For now, top-level spread inside categories is enough if structure hasn't fully changed
                if (parsed.general) Object.assign(settings.general, parsed.general);
                if (parsed.behavior) Object.assign(settings.behavior, parsed.behavior);
                if (parsed.database) Object.assign(settings.database, parsed.database);
                if (parsed.security) Object.assign(settings.security, parsed.security);
                if (parsed.notifications) Object.assign(settings.notifications, parsed.notifications);

            } catch (e) {
                console.error("Error loading settings:", e);
            }
        }
    };

    const saveSettings = () => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
        // Here functionality to apply side-effects can be added
        // e.g., if theme changed, apply it (handled in useTheme mostly, but can be synced)
    };

    // Auto-save watcher
    watch(settings, () => {
        saveSettings();
    }, { deep: true });

    const t = (key) => {
        return translations[settings.language]?.[key] || key;
    };

    return {
        settings,
        loadSettings,
        saveSettings,
        t
    };
}
