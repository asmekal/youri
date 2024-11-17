import * as Babel from '@babel/standalone';
import React from 'react';
import {
    Grid, Paper, IconButton, Typography, Box,
    Fab, TextField, CircularProgress, Snackbar, Grow,
} from '@mui/material';

class ComponentRegistry {
    static instance = null;
    components = new Map();

    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }

    async loadComponent(componentId) {
        try {
            // Check if component is already loaded and we're not in development
            if (process.env.NODE_ENV !== 'development' && this.components.has(componentId)) {
                return this.components.get(componentId);
            }

            const code = localStorage.getItem(componentId);
            if (!code) {
                throw new Error(`No code found for component ID: ${componentId}`);
            }

            // Create a safe context with allowed dependencies
            const dependencies = {
                React,
                Grid,
                Paper,
                IconButton,
                Typography,
                Box,
                Fab,
                TextField,
                CircularProgress,
                Snackbar,
                Grow,
            };

            // Transform the code
            const transpiledCode = await Babel.transform(code, {
                presets: ['env', 'react'],
                filename: `component-${componentId}.js`,
            }).code;

            // Create module context
            const moduleExports = {};
            const moduleRequire = (name) => {
                if (name === 'react') return React;
                if (dependencies[name]) return dependencies[name];
                throw new Error(`Cannot require module: ${name}`);
            };

            // Wrap the code in a try-catch
            const wrappedCode = `
                try {
                    ${transpiledCode}
                } catch (error) {
                    console.error('Error executing component code:', error);
                    throw error;
                }
            `;

            // Execute the code in a controlled context
            const execute = new Function(
                'React',
                'require',
                'exports',
                'module',
                ...Object.keys(dependencies),
                wrappedCode
            );

            execute(
                React,
                moduleRequire,
                moduleExports,
                { exports: moduleExports },
                ...Object.values(dependencies)
            );

            const LoadedComponent = moduleExports.default || moduleExports;

            if (typeof LoadedComponent !== 'function') {
                throw new Error('Component must export a function or class');
            }

            // Store the loaded component
            this.components.set(componentId, LoadedComponent);
            return LoadedComponent;

        } catch (error) {
            console.error(`Failed to load component ${componentId}:`, error);
            throw error;
        }
    }

    async loadAllComponents(componentsList = []) {
        if (!Array.isArray(componentsList)) {
            console.error('componentsList must be an array');
            return [];
        }

        const loadedComponents = await Promise.all(
            componentsList.map(async (comp) => {
                try {
                    if (!comp || !comp.component_id) {
                        console.error('Invalid component object:', comp);
                        return null;
                    }

                    const Component = await this.loadComponent(comp.component_id);
                    return {
                        ...comp,
                        Component
                    };
                } catch (error) {
                    console.error(`Failed to load component ${comp.component_id}:`, error);
                    return null;
                }
            })
        );

        return loadedComponents.filter(Boolean);
    }
}

export const componentRegistry = ComponentRegistry.getInstance();