import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const EditComponentModal = ({ open, handleClose, componentId }) => {
    const [code, setCode] = useState(localStorage.getItem(componentId) || '');

    const handleSave = async () => {
        try {
            // Update the component code in localStorage
            localStorage.setItem(componentId, code);

            // Optionally, send the updated code to the backend for persistence
            // await axios.post('http://localhost:8000/update_component', {
            //   component_id: componentId,
            //   code,
            // });

            handleClose();
            window.location.reload(); // Reload to apply changes
        } catch (error) {
            console.error('Error saving component:', error);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="edit-component-modal-title"
            aria-describedby="edit-component-modal-description"
        >
            <Box sx={style}>
                <Typography id="edit-component-modal-title" variant="h6" component="h2" gutterBottom>
                    Edit Component: {componentId}
                </Typography>
                <TextField
                    id="component-code"
                    label="Component Code"
                    multiline
                    rows={20}
                    variant="outlined"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default EditComponentModal;
