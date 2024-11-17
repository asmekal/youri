import React, { useState, useRef } from 'react';
import {
    Fab,
    TextField,
    Paper,
    IconButton,
    CircularProgress,
    Snackbar,
    Grow,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const FloatingActionButton = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);

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
                        reader.onload = () => resolve({
                            filename: file.name,
                            content: reader.result.split(',')[1]
                        });
                        reader.onerror = reject;
                        reader.readAsDataURL(file);
                    });
                })
            );

            const response = await axios.post(
                `${backendUrl}/generate_component`,
                {
                    intent: input || undefined,
                    files: fileContents,
                    context: {}
                }
            );

            const { component_id, code } = response.data;
            localStorage.setItem(component_id, code);

            setInput('');
            setFiles([]);
            setOpen(false);

            // Use context or Redux instead of a global event
            window.dispatchEvent(new CustomEvent('componentAdded', {
                detail: { component_id, code }
            }));
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
            // Focus input when opening
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    return (
        <>
            <Box sx={{
                position: 'fixed',
                right: 24,
                bottom: 24,
                display: 'flex',
                alignItems: 'flex-end',
                gap: 2
            }}>
                <Grow in={open}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            width: 320,
                            mb: 1
                        }}
                    >
                        <TextField
                            inputRef={inputRef}
                            label="Express your intent"
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                        />
                        <Box sx={{
                            mt: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box>
                                <IconButton
                                    color="primary"
                                    component="label"
                                    disabled={loading}
                                >
                                    <AttachFileIcon />
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        onChange={(e) => setFiles(Array.from(e.target.files))}
                                        accept=".js,.jsx,.ts,.tsx,.css,.html,.json,.md"
                                    />
                                </IconButton>
                                <IconButton
                                    color="primary"
                                    disabled={loading}
                                >
                                    <MicIcon />
                                </IconButton>
                            </Box>
                            <IconButton
                                color="primary"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <SendIcon />
                                )}
                            </IconButton>
                        </Box>
                        {files.length > 0 && (
                            <Box sx={{ mt: 1, fontSize: '0.875rem', color: 'text.secondary' }}>
                                Selected files: {files.map(f => f.name).join(', ')}
                            </Box>
                        )}
                    </Paper>
                </Grow>
                <Fab
                    color={open ? 'secondary' : 'primary'}
                    onClick={toggleOpen}
                    sx={{ mb: 1 }}
                >
                    {open ? <CloseIcon /> : <AddIcon />}
                </Fab>
            </Box>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                message={error}
            />
        </>
    );
};

export default FloatingActionButton;