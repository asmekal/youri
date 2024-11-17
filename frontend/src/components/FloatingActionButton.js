// frontend/src/components/FloatingActionButton.js

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ActionButton from './ActionButton';
import IntentInput from './IntentInput';
import axios from 'axios';

const FloatingActionButton = ({ editingComponentId }) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Initialize error state
    const [currentEditingComponentId, setCurrentEditingComponentId] = useState(editingComponentId);

    useEffect(() => {
        const handleEditComponent = (event) => {
            const { component_id } = event.detail;
            setCurrentEditingComponentId(component_id);
            setOpen(true);
        };

        window.addEventListener('editComponent', handleEditComponent);
        return () => window.removeEventListener('editComponent', handleEditComponent);
    }, []);

    const handleSubmit = async () => {
        if (!input && files.length === 0) {
            setError('Please provide intent or upload files');
            return;
        }

        setLoading(true);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
            const formData = new FormData();

            if (currentEditingComponentId) {
                formData.append('component_id', currentEditingComponentId);
            }

            if (input) {
                formData.append('intent', input);
            }

            files.forEach((file) => {
                formData.append('files', file);
            });

            const response = await axios.post(`${backendUrl}/generate_component`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const { component_id, code } = response.data;
            localStorage.setItem(component_id, code);

            setInput('');
            setFiles([]);
            setOpen(false);
            setCurrentEditingComponentId(null);

            // Dispatch event to notify component addition or update
            if (editingComponentId) {
                window.dispatchEvent(
                    new CustomEvent('componentUpdated', {
                        detail: { component_id, code },
                    })
                );
            } else {
                window.dispatchEvent(
                    new CustomEvent('componentAdded', {
                        detail: { component_id, code },
                    })
                );
            }

            // Reset error after successful submission
            setError('');
        } catch (error) {
            console.error('Error sending request:', error);
            // Handle different error structures
            if (error.response && error.response.data && error.response.data.detail) {
                const detail = error.response.data.detail;
                if (Array.isArray(detail)) {
                    // Join all error messages into a single string
                    const errorMessage = detail.map(err => err.msg).join(', ');
                    setError(errorMessage);
                } else if (typeof detail === 'string') {
                    setError(detail);
                } else {
                    setError('Failed to generate component');
                }
            } else {
                setError('Failed to generate component');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const toggleOpen = () => {
        setOpen(!open);
        if (!open) {
            // Reset fields when opening for new component
            setInput('');
            setFiles([]);
            setError('');
            setCurrentEditingComponentId(null);
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                right: 24,
                bottom: 24,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2,
            }}
        >
            <IntentInput
                open={open}
                input={input}
                setInput={setInput}
                files={files}
                setFiles={setFiles}
                loading={loading}
                handleSubmit={handleSubmit}
                handleKeyPress={handleKeyPress}
                error={error}          // Pass the error state as string
                setError={setError}
                editingComponentId={currentEditingComponentId}
            />
            <ActionButton open={open} onToggle={toggleOpen} />
        </Box>
    );
};

export default FloatingActionButton;
