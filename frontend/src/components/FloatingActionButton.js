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

    useEffect(() => {
        if (editingComponentId) {
            // Fetch existing component data to pre-fill the input
            const fetchComponentData = async () => {
                try {
                    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
                    const response = await axios.get(`${backendUrl}/get_component/${editingComponentId}`);
                    const { intent, files: existingFiles } = response.data;

                    setInput(intent || '');
                    setFiles(existingFiles || []);
                    setOpen(true);
                } catch (error) {
                    console.error('Error fetching component data:', error);
                    setError('Failed to load component data for editing');
                }
            };

            fetchComponentData();
        }
    }, [editingComponentId]);

    const handleSubmit = async () => {
        if (!input && files.length === 0) {
            setError('Please provide intent or upload files');
            return;
        }

        setLoading(true);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
            const fileContents = await Promise.all(
                files.map(async (file) => {
                    return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () =>
                            resolve({
                                filename: file.name,
                                content: reader.result.split(',')[1],
                            });
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            const payload = {
                intent: input || undefined,
                files: fileContents,
                context: {},
            };

            let response;
            if (editingComponentId) {
                payload["componentId"] = editingComponentId
            }
            response = await axios.post(`${backendUrl}/generate_component`, payload);

            const { component_id, code } = response.data;
            localStorage.setItem(component_id, code);

            setInput('');
            setFiles([]);
            setOpen(false);

            // Dispatch event to notify component addition or update
            window.dispatchEvent(
                new CustomEvent('componentAdded', {
                    detail: { component_id, code },
                })
            );

            // Reset error after successful submission
            setError('');
        } catch (error) {
            console.error('Error sending request:', error);
            setError(error.response?.data?.detail || 'Failed to generate component');
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
                error={error}          // Pass the error state
                setError={setError}
                editingComponentId={editingComponentId}
            />
            <ActionButton open={open} onToggle={toggleOpen} />
        </Box>
    );
};

export default FloatingActionButton;
