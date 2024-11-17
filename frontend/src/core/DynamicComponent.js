import React, { useState, useEffect, Suspense } from 'react';
import { Paper, CircularProgress, Box } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import { componentRegistry } from './ComponentRegistry';

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress size={24} />
    </Box>
);

const DynamicComponent = ({ componentId, ...props }) => {
    const [LoadedComponent, setLoadedComponent] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadComponent = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const component = await componentRegistry.loadComponent(componentId);

                if (mounted) {
                    if (typeof component === 'function') {
                        setLoadedComponent(() => component);
                    } else {
                        throw new Error('Invalid component loaded');
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.error(`Error loading component ${componentId}:`, err);
                    setError(err.message);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadComponent();

        return () => {
            mounted = false;
        };
    }, [componentId]);

    if (error) {
        return (
            <Paper className="p-4 text-center text-red-500">
                Failed to load component: {error}
            </Paper>
        );
    }

    if (isLoading || !LoadedComponent) {
        return <LoadingFallback />;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
                <LoadedComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );
};

export default DynamicComponent;
