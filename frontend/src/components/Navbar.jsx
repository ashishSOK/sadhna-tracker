import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Box,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, isMentor } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItems = [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Add Entry', path: '/sadhna-entry' },
        ...(isMentor ? [
            { label: 'Devotees', path: '/devotees' },
            { label: 'Weekly Winner', path: '/weekly-winner' },
            { label: 'WhatsApp', path: '/whatsapp' },
        ] : []),
    ];

    return (
        <AppBar
            position="sticky"
            sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
            }}
        >
            <Toolbar>
                <DashboardIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 700,
                        fontFamily: "'Poppins', sans-serif"
                    }}
                >
                    Sadhna Tracker
                </Typography>

                {user && (
                    <>
                        {isMobile ? (
                            <>
                                <IconButton
                                    size="large"
                                    edge="end"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleMenu}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {navItems.map((item) => (
                                        <MenuItem
                                            key={item.path}
                                            onClick={() => {
                                                navigate(item.path);
                                                handleClose();
                                            }}
                                            selected={location.pathname === item.path}
                                        >
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon sx={{ mr: 1 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item.path}
                                        color="inherit"
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                                            borderRadius: 0,
                                            fontWeight: location.pathname === item.path ? 600 : 400
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                ))}
                                <Button
                                    color="inherit"
                                    onClick={handleLogout}
                                    startIcon={<LogoutIcon />}
                                    sx={{ ml: 2 }}
                                >
                                    Logout
                                </Button>
                            </Box>
                        )}
                        <Typography
                            variant="body2"
                            sx={{
                                ml: 2,
                                px: 2,
                                py: 1,
                                bgcolor: 'rgba(255,255,255,0.2)',
                                borderRadius: 2,
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            {user.name} ({isMentor ? 'Mentor' : 'Devotee'})
                        </Typography>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
