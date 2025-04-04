import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme, IconButton, Drawer, List, ListItem, ListItemText, Avatar, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import CodeIcon from '@mui/icons-material/Code';

const Navbar = ({ isAdmin }) => {
  const { isAuthenticated, currentUser, logout } = useAppContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    logout();
    handleClose();
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'About', path: '/about' },
    ...(isAuthenticated && !isAdmin ? [{ name: 'My Dashboard', path: '/dashboard' }] : []),
    ...(isAdmin ? [{ name: 'Admin Dashboard', path: '/admin' }] : [])
  ];

  const renderMobileMenu = () => (
    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
      <Box sx={{ width: 250, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem 
              key={item.name} 
              component={Link} 
              to={item.path} 
              onClick={toggleDrawer}
              sx={{
                color: 'text.primary',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                }
              }}
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <ListItem 
                  component={Link} 
                  to="/profile" 
                  onClick={toggleDrawer}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    }
                  }}
                >
                  <ListItemText primary="My Profile" />
                </ListItem>
              )}
              <ListItem 
                component={Link} 
                to="/" 
                onClick={() => {
                  logout();
                  toggleDrawer();
                }}
                sx={{
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem 
              component={Link} 
              to="/login" 
              onClick={toggleDrawer}
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                }
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ backgroundColor: 'white' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              fontWeight: 'bold', 
              color: 'text.primary', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Code Circle
          </Typography>
        </Box>

        {isMobile ? (
          <IconButton 
            edge="end" 
            color="inherit" 
            aria-label="menu"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Button 
                key={item.name} 
                component={Link} 
                to={item.path}
                sx={{ 
                  mx: 1,
                  color: 'text.primary',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  }
                }}
              >
                {item.name}
              </Button>
            ))}
            {isAuthenticated ? (
              <Box sx={{ ml: 2 }}>
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.main',
                      fontSize: '0.875rem'
                    }}
                  >
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {!isAdmin && (
                    <MenuItem component={Link} to="/dashboard">
                      My Dashboard
                    </MenuItem>
                  )}
                  {!isAdmin && (
                    <MenuItem component={Link} to="/profile">
                      My Profile
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                variant="contained" 
                color="primary"
                sx={{ ml: 2 }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
        {renderMobileMenu()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;