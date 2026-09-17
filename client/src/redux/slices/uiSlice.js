import { createSlice } from '@reduxjs/toolkit';

const getInitialCollapsed = () => {
  try {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  } catch {
    return false;
  }
  
};

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem('shopify_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
};

const applyThemeToDOM = (theme) => {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }
};

const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

const initialState = {
  sidebarOpen: false, // For mobile drawer
  sidebarCollapsed: getInitialCollapsed(), // For desktop hide/show toggle
  theme: initialTheme, // 'light' | 'dark'
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      try {
        localStorage.setItem('sidebar_collapsed', String(state.sidebarCollapsed));
      } catch {
        // ignore
      }
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload;
      try {
        localStorage.setItem('sidebar_collapsed', String(action.payload));
      } catch {
        // ignore
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      state.theme = nextTheme;
      applyThemeToDOM(nextTheme);
      try {
        localStorage.setItem('shopify_theme', nextTheme);
      } catch {
        // ignore
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      applyThemeToDOM(action.payload);
      try {
        localStorage.setItem('shopify_theme', action.payload);
      } catch {
        // ignore
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
