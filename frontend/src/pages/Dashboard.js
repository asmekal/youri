import React from 'react';
import { Grid, Paper, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DynamicComponent from '../core/DynamicComponent';

const EmptyState = () => (
    <Paper
        elevation={0}
        className="p-8 text-center bg-gray-50"
        sx={{
            border: '2px dashed',
            borderColor: 'grey.300',
            borderRadius: 2
        }}
    >
        <AddCircleOutlineIcon
            sx={{ fontSize: 48, color: 'grey.400', mb: 2 }}
        />
        <Typography variant="h6" color="textSecondary" gutterBottom>
            No Widgets Yet
        </Typography>
        <Typography variant="body2" color="textSecondary">
            Click the plus button in the corner to add your first widget
        </Typography>
    </Paper>
);

const LoadingState = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
    </Box>
);

const Dashboard = ({
    components = [], // Provide default empty array
    isLoading = false,
    onEdit,
    title = "Welcome to Your Dashboard",
    columns = { xs: 12, sm: 6, md: 4 },
    spacing = 3
}) => {
    // Early return for loading state
    if (isLoading) {
        return <LoadingState />;
    }

    // Ensure components is always an array
    const safeComponents = Array.isArray(components) ? components : [];

    return (
        <Box>
            {title && (
                <Typography
                    variant="h4"
                    sx={{ mb: 4, fontWeight: 'medium' }}
                >
                    {title}
                </Typography>
            )}
            {/* Check for empty array using safeComponents */}
            {safeComponents.length === 0 ? (
                <EmptyState />
            ) : (
                <Grid container spacing={spacing}>
                    {safeComponents.map((component) => {
                        // Ensure component and component_id exist
                        if (!component?.component_id) {
                            console.warn('Invalid component object:', component);
                            return null;
                        }

                        return (
                            <Grid item {...columns} key={component.component_id}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        minHeight: 150,
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {onEdit && (
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8
                                            }}
                                            size="small"
                                            color="primary"
                                            onClick={() => onEdit(component.component_id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    <DynamicComponent componentId={component.component_id} />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default Dashboard;