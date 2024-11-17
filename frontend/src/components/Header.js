import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
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
}));

const Header = () => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        // Implement actual logout functionality here
        console.log('Logout clicked');
        handleMenuClose();
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                {/* Logo */}
                <img src="/logo192.png" alt="You I Logo" className={classes.logo} />
                {/* App Name */}
                <Typography variant="h6" className={classes.title}>
                    You I
                </Typography>
                {/* Profile Icon */}
                <IconButton
                    edge="end"
                    color="inherit"
                    aria-label="profile"
                    onClick={handleProfileMenuOpen}
                >
                    <AccountCircle />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
