import { ref, watch, onMounted } from 'vue';

const theme = ref('light'); // 'light', 'dark', 'system'

export function useTheme() {
    const applyTheme = (newTheme) => {
        const root = document.documentElement;
        let effectiveTheme = newTheme;

        if (newTheme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                effectiveTheme = 'dark';
            } else {
                effectiveTheme = 'light';
            }
        }

        if (effectiveTheme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }

        // Also save preference to settings if it exists
        const settings = localStorage.getItem('app_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            if (parsed.theme !== newTheme) {
                parsed.theme = newTheme;
                localStorage.setItem('app_settings', JSON.stringify(parsed));
            }
        }
    };

    const setTheme = (newTheme) => {
        theme.value = newTheme;
        applyTheme(newTheme);
    };

    const loadTheme = () => {
        const settings = localStorage.getItem('app_settings');
        if (settings) {
            const parsed = JSON.parse(settings);
            if (parsed.theme) {
                theme.value = parsed.theme;
                applyTheme(theme.value);
                return;
            }
        }
        // Default
        applyTheme('light');
    };

    // Listen for system changes if mode is system
    onMounted(() => {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (theme.value === 'system') {
                const newColorScheme = e.matches ? 'dark' : 'light';
                const root = document.documentElement;
                if (newColorScheme === 'dark') {
                    root.setAttribute('data-theme', 'dark');
                } else {
                    root.removeAttribute('data-theme');
                }
            }
        });

        loadTheme();
    });

    return {
        theme,
        setTheme,
        loadTheme
    };
}
