import * as Babel from '@babel/standalone';
import React, { useState, useEffect } from 'react';
import {
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
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Badge,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Card,
    CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MailIcon from '@mui/icons-material/Mail';
import { listMessages, getMessage, sendMessage, modifyMessage, decodeBase64 } from '../interfaces/emailMocked';

class ComponentRegistry {
    static instance = null;
    components = new Map();

    static getInstance() {
        if (!ComponentRegistry.instance) {
            ComponentRegistry.instance = new ComponentRegistry();
        }
        return ComponentRegistry.instance;
    }

    clearComponent(componentId) {
        if (this.components.has(componentId)) {
            this.components.delete(componentId);
            console.log(`Component ${componentId} cache cleared.`);
        }
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
                Grid: require('@mui/material/Grid').default,
                Paper: require('@mui/material/Paper').default,
                IconButton: require('@mui/material/IconButton').default,
                Typography: require('@mui/material/Typography').default,
                Box: require('@mui/material/Box').default,
                Fab: require('@mui/material/Fab').default,
                TextField: require('@mui/material/TextField').default,
                CircularProgress: require('@mui/material/CircularProgress').default,
                Snackbar: require('@mui/material/Snackbar').default,
                Grow: require('@mui/material/Grow').default,
                List: require('@mui/material/List').default,
                ListItem: require('@mui/material/ListItem').default,
                ListItemText: require('@mui/material/ListItemText').default,
                ListItemIcon: require('@mui/material/ListItemIcon').default,
                Badge: require('@mui/material/Badge').default,
                Divider: require('@mui/material/Divider').default,
                Dialog: require('@mui/material/Dialog').default,
                DialogTitle: require('@mui/material/DialogTitle').default,
                DialogContent: require('@mui/material/DialogContent').default,
                DialogActions: require('@mui/material/DialogActions').default,
                Button: require('@mui/material/Button').default,
                Card: require('@mui/material/Card').default,
                CardContent: require('@mui/material/CardContent').default,
                AddIcon: require('@mui/icons-material/Add').default,
                MailIcon: require('@mui/icons-material/Mail').default,
            };

            // Transform the code using Babel
            const transpiledCode = Babel.transform(code, {
                presets: ['env', 'react'],
                filename: `component-${componentId}.js`,
            }).code;

            // Create module context
            const moduleExports = {};
            const moduleRequire = (name) => {
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
                'useState', 'useEffect',
                'listMessages', 'getMessage', 'sendMessage', 'modifyMessage', 'decodeBase64',
                ...Object.keys(dependencies),
                wrappedCode
            );

            execute(
                React,
                moduleRequire,
                moduleExports,
                { exports: moduleExports },
                useState, useEffect, // Passed useState and useEffect correctly
                listMessages, getMessage, sendMessage, modifyMessage, decodeBase64,
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
