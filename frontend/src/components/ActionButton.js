// src/components/ActionButton.js
import React from 'react';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const ActionButton = ({ open, onToggle }) => (
    <Fab
        color={open ? 'secondary' : 'primary'}
        onClick={onToggle}
        sx={{ mb: 1 }}
        aria-label={open ? 'Close input' : 'Add widget'}
    >
        {open ? <CloseIcon /> : <AddIcon />}
    </Fab>
);

export default ActionButton;
