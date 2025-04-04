import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Grid, TextField,
  Avatar, Divider, Alert, AlertTitle, IconButton, Card, CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppContext } from '../context/AppContext';

/**
 * User Profile component for users to view and edit their profile information
 */
const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, updateUserProfile } = useAppContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    college: currentUser?.college || '',
    department: currentUser?.department || '',
    year: currentUser?.year || '',
    bio: currentUser?.bio || ''
  });
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.college.trim()) {
      newErrors.college = 'College name is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save profile
  const handleSaveProfile = () => {
    if (validateForm()) {
      // In a real app, this would send data to the backend
      // For now, we'll just simulate a successful save
      if (updateUserProfile) {
        updateUserProfile(formData);
      }
      
      setSubmitSuccess(true);
      setIsEditing(false);
      
      // Clear success message after a delay
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Reset form data to current user data when entering edit mode
      setFormData({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        phone: currentUser?.phone || '',
        college: currentUser?.college || '',
        department: currentUser?.department || '',
        year: currentUser?.year || '',
        bio: currentUser?.bio || ''
      });
    }
  };

  if (!currentUser) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          <AlertTitle>Not Logged In</AlertTitle>
          You need to be logged in to view your profile.
        </Alert>
        <Button 
          component={Link} 
          to="/login" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          component={Link} 
          to="/dashboard" 
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Profile
        </Typography>
      </Box>

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <AlertTitle>Success!</AlertTitle>
          Your profile has been updated successfully.
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 2
              }}
            >
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {formData.name || 'User'}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formData.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
          <IconButton 
            color="primary" 
            onClick={toggleEditMode}
            sx={{ border: 1, borderColor: 'primary.main' }}
          >
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </IconButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              error={!!errors.email}
              helperText={errors.email}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="College"
              name="college"
              value={formData.college}
              onChange={handleChange}
              disabled={!isEditing}
              error={!!errors.college}
              helperText={errors.college}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              disabled={!isEditing}
              error={!!errors.department}
              helperText={errors.department}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Year of Study"
              name="year"
              value={formData.year}
              onChange={handleChange}
              disabled={!isEditing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              disabled={!isEditing}
              multiline
              rows={4}
              margin="normal"
            />
          </Grid>
        </Grid>

        {isEditing && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={toggleEditMode}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSaveProfile}
              startIcon={<SaveIcon />}
            >
              Save Changes
            </Button>
          </Box>
        )}
      </Paper>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            Account Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Account Type
              </Typography>
              <Typography variant="body1">
                {currentUser.isAdmin ? 'Administrator' : 'Regular User'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body1">
                {new Date(currentUser.id).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;