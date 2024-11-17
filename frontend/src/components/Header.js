import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    title: {
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        marginRight: '10px',
        width: '30px',
        height: '30px',
    },
});

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Logo */}
                <img src="/logo192.png" alt="You I Logo" className={classes.logo} />
                {/* App Name */}
                <Typography variant="h6" className={classes.title}>
                    You I
                </Typography>
                {/* Profile Icon */}
                <IconButton edge="end" color="inherit" aria-label="profile">
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
