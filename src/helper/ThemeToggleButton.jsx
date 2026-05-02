'use client'
import React, { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
    // Use a static initial value so prerender does not touch browser APIs.
    const [theme, setTheme] = useState('light');

    // 2. Function to update the theme on the HTML element
    const updateThemeOnHtmlEl = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
    };

    // Read persisted theme on mount, then sync it to the document.
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || storedTheme === 'light') {
            setTheme(storedTheme);
            return;
        }
        updateThemeOnHtmlEl(theme);
    }, []);

    // Keep DOM theme in sync with state.
    useEffect(() => {
        updateThemeOnHtmlEl(theme);
    }, [theme]);

    // 5. Toggle theme when button is clicked
    const handleThemeToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeOnHtmlEl(newTheme);
    };

    return (
        <button
            type="button"
            data-theme-toggle
            className="w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center"
            onClick={handleThemeToggle}
        >
            Toggle Theme
        </button>
    );
};

export default ThemeToggleButton;

