// src/context/ThemeContext.tsx
import React, { createContext, useState, useContext, type ReactNode, useMemo } from 'react';

// Define the shape of the theme context
export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// Create the context with an undefined default (will be provided by ThemeProvider)
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props for the provider component
interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * ThemeProvider – supplies a light/dark theme toggle via React context.
 * It updates the HTML root element's class list so that global CSS can react
 * to the current theme.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = () => {
        setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    };

    // Keep the <html> element class in sync for CSS selectors
    useMemo(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, [theme]);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};
