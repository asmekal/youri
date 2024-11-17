import React from 'react';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import DynamicComponentLoader from '../components/DynamicComponentLoader';
import Button from '@mui/material/Button';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import ErrorBoundary from '../components/ErrorBoundary';  // Import ErrorBoundary

const useStyles = makeStyles({
    paper: {
        padding: '16px',
        textAlign: 'center',
        color: 'black',
        height: '150px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    editButton: {
        position: 'absolute',
        top: '5px',
        right: '5px',
    },
});

const Dashboard = ({ onEdit }) => {
    const classes = useStyles();
    const [components, setComponents] = React.useState([]);

    const handleAddComponent = async () => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
            const response = await axios.post(`${backendUrl}/generate_component`, {
                user_id: 'user123',
                intent: 'Add a weather widget',
                context: {},
            });

            const { component_id, code } = response.data;

            // Save the component code locally
            localStorage.setItem(component_id, code);
            console.log(`Component ${component_id} added with code:\n${code}`);

            setComponents((prev) => [...prev, component_id]);
        } catch (error) {
            console.error('Error adding component:', error);
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Welcome to You I Dashboard
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAddComponent}
                style={{ marginBottom: '20px' }}
            >
                Add Weather Widget
            </Button>
            <Grid container spacing={3}>
                {components.length === 0 ? (
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <Typography variant="h6" color="textSecondary">
                                No widgets added yet. Click "Add Weather Widget" to get started!
                            </Typography>
                        </Paper>
                    </Grid>
                ) : (
                    components.map((componentId) => (
                        <Grid item xs={12} sm={6} md={4} key={componentId}>
                            <Paper className={classes.paper}>
                                {/* Edit Button */}
                                <IconButton
                                    className={classes.editButton}
                                    size="small"
                                    color="primary"
                                    onClick={() => onEdit(componentId)}
                                >
                                    <EditIcon />
                                </IconButton>
                                {/* Dynamic Component with Error Boundary */}
                                <ErrorBoundary>
                                    <DynamicComponentLoader componentId={componentId} />
                                </ErrorBoundary>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </div>
    );
};

export default Dashboard;
