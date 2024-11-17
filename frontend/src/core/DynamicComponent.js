import React, { useState, useEffect, Suspense } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
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

    const loadComponent = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const component = await componentRegistry.loadComponent(componentId);

            if (typeof component === 'function') {
                setLoadedComponent(() => component);
            } else {
                throw new Error('Invalid component loaded');
            }
        } catch (err) {
            console.error(`Error loading component ${componentId}:`, err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadComponent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentId]);

    useEffect(() => {
        const handleComponentUpdated = (event) => {
            const { component_id, code } = event.detail;
            if (component_id === componentId) {
                console.log(`Component ${componentId} updated. Reloading...`);
                loadComponent();
            }
        };

        window.addEventListener('componentUpdated', handleComponentUpdated);
        return () => {
            window.removeEventListener('componentUpdated', handleComponentUpdated);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentId]);

    if (error) {
        return (
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h5" color="error">
                    Failed to load component: {error}
                </Typography>
            </Box>
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
