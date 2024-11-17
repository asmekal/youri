import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        padding: '10px 0',
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
    },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <Box className={classes.footer}>
            <Typography variant="body2" color="textSecondary">
                © 2024 You I. All rights reserved.
            </Typography>
        </Box>
    );
};

export default Footer;
