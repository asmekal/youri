// src/components/IntentInput.js
import React, { useRef, useEffect } from 'react';
import {
    Paper,
    TextField,
    IconButton,
    CircularProgress,
    Box,
    Snackbar,
    Grow,
    Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PropTypes from 'prop-types';

const IntentInput = ({
    open,
    input,
    setInput,
    files,
    setFiles,
    loading,
    handleSubmit,
    handleKeyPress,
    error,
    setError,
    editingComponentId,
}) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (open) {
            // Focus the input field when the input box opens
            inputRef.current?.focus();
        }
    }, [open]);

    return (
        <Grow in={open}>
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    width: 320,
                    mb: 1,
                    backgroundColor: 'background.paper',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.5)', // Subtle shadow for depth
                }}
            >
                <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.primary' }}>
                    {editingComponentId ? 'Edit Widget' : 'Add New Widget'}
                </Typography>
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
                    sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'grey.600',
                            },
                            '&:hover fieldset': {
                                borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: 'text.secondary',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: 'primary.main',
                        },
                        '& .MuiInputBase-input': {
                            color: 'text.primary',
                        },
                    }}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <IconButton
                            color="primary"
                            component="label"
                            disabled={loading}
                            aria-label="Attach files"
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
                        <IconButton color="primary" disabled={loading} aria-label="Voice input">
                            <MicIcon />
                        </IconButton>
                    </Box>
                    <IconButton
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        aria-label="Submit intent"
                    >
                        {loading ? <CircularProgress size={24} /> : <SendIcon />}
                    </IconButton>
                </Box>
                {files.length > 0 && (
                    <Box
                        sx={{
                            mt: 1,
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                            wordBreak: 'break-word',
                        }}
                    >
                        Selected files: {files.map((f) => f.name).join(', ')}
                    </Box>
                )}
                <Snackbar
                    open={!!error}
                    autoHideDuration={6000}
                    onClose={() => setError('')}
                    message={error}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{
                        '& .MuiSnackbarContent-root': {
                            backgroundColor: 'error.main',
                            color: 'error.contrastText',
                        },
                    }}
                />
            </Paper>
        </Grow>
    );
};

IntentInput.propTypes = {
    open: PropTypes.bool.isRequired,
    input: PropTypes.string.isRequired,
    setInput: PropTypes.func.isRequired,
    files: PropTypes.array.isRequired,
    setFiles: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleKeyPress: PropTypes.func.isRequired,
    error: PropTypes.string,
    setError: PropTypes.func.isRequired,
    editingComponentId: PropTypes.string,
};

export default IntentInput;
