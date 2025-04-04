import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, TextField, Grid,
  Alert, AlertTitle, Divider, FormControlLabel, Checkbox
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'rememberMe' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
    
    // Clear login error when any field changes
    if (loginError) {
      setLoginError('');
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // In a real app, this would make an API call to authenticate the user
      // For demo purposes, we'll simulate authentication with a timeout
      setTimeout(() => {
        // Check if the user is an admin (for demo purposes)
        const isAdmin = formData.email.includes('admin');
        
        // Call the login function (would be provided by parent component in a real app)
        if (onLogin) {
          onLogin(isAdmin);
        }
        
        setIsSubmitting(false);
        
        // Redirect to appropriate page
        navigate(isAdmin ? '/admin' : '/');
      }, 1000);
    }
  };

  // Handle demo login as admin
  const handleDemoAdminLogin = () => {
    // Call the login function with admin role
    if (onLogin) {
      onLogin(true);
    }
    
    // Redirect to admin dashboard
    navigate('/admin');
  };

  // Handle demo login as user
  const handleDemoUserLogin = () => {
    // Call the login function with user role
    if (onLogin) {
      onLogin(false);
    }
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <CodeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Welcome to Code Circle
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account
          </Typography>
        </Box>
        
        {loginError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Login Failed</AlertTitle>
            {loginError}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary.main">
                    Forgot password?
                  </Typography>
                </Link>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </Grid>
          </Grid>
        </form>
        
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography component="span" variant="body2" color="primary.main">
                Sign up
              </Typography>
            </Link>
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Demo Options
          </Typography>
        </Divider>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={handleDemoUserLogin}
            >
              Demo as User
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button 
              variant="outlined" 
              color="secondary" 
              fullWidth
              onClick={handleDemoAdminLogin}
            >
              Demo as Admin
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;