import React from 'react';
import { Typography, Box } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to display fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to the console or an error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        Something went wrong while loading the component.
                    </Typography>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
