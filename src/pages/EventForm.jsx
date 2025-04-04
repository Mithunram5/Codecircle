import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem, Chip, FormHelperText,
  Alert, AlertTitle, Switch, FormControlLabel
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const EventForm = ({ events, onSaveEvent }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Find the event if in edit mode
  const existingEvent = isEditMode ? events.find(event => event.id === parseInt(id) || event.id === id) : null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    registrationStartDate: new Date(),
    registrationDeadline: new Date(),
    maxParticipants: 50,
    location: '',
    status: 'upcoming',
    imageUrl: '',
    organizers: [],
    isMultiDay: false,
    requiresAttendance: true,
    eventDays: 1
  });
  
  const [errors, setErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Load existing event data if in edit mode
  useEffect(() => {
    if (isEditMode && existingEvent) {
      setFormData({
        ...existingEvent,
        startDate: new Date(existingEvent.startDate),
        endDate: existingEvent.endDate ? new Date(existingEvent.endDate) : null,
        registrationStartDate: existingEvent.registrationStartDate ? new Date(existingEvent.registrationStartDate) : new Date(),
        registrationDeadline: new Date(existingEvent.registrationDeadline),
        isMultiDay: !!existingEvent.endDate,
        requiresAttendance: existingEvent.requiresAttendance !== undefined ? existingEvent.requiresAttendance : true,
        eventDays: existingEvent.eventDays || 1
      });
    }
  }, [isEditMode, existingEvent]);
  
  // Handle text input changes
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
  
  // Handle date changes
  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle switch changes
  const handleSwitchChange = (e) => {
    const { name, checked } = e.target;
    
    if (name === 'isMultiDay' && !checked) {
      // If turning off multi-day, clear the end date
      setFormData({
        ...formData,
        [name]: checked,
        endDate: null
      });
    } else {
      setFormData({
        ...formData,
        [name]: checked
      });
    }
  };
  
  // Handle organizer input
  const handleOrganizerInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newOrganizer = e.target.value.trim();
      if (!formData.organizers.includes(newOrganizer)) {
        setFormData({
          ...formData,
          organizers: [...formData.organizers, newOrganizer]
        });
      }
      e.target.value = '';
    }
  };
  
  // Remove an organizer
  const handleRemoveOrganizer = (organizerToRemove) => {
    setFormData({
      ...formData,
      organizers: formData.organizers.filter(organizer => organizer !== organizerToRemove)
    });
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (formData.isMultiDay && !formData.endDate) {
      newErrors.endDate = 'End date is required for multi-day events';
    }
    
    if (formData.isMultiDay && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    }
    
    if (formData.registrationDeadline > formData.startDate) {
      newErrors.registrationDeadline = 'Registration deadline must be before the event start date';
    }
    
    if (!formData.maxParticipants || formData.maxParticipants <= 0) {
      newErrors.maxParticipants = 'Maximum participants must be a positive number';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, this would send data to the backend
      // For now, we'll just simulate a successful save
      
      // Create a new event object
      const eventData = {
        ...formData,
        id: isEditMode ? existingEvent.id : Date.now(), // Use existing ID or generate a new one
        currentParticipants: isEditMode ? existingEvent.currentParticipants : 0
      };
      
      // Call the save function (would be provided by parent component in a real app)
      if (onSaveEvent) {
        onSaveEvent(eventData);
      }
      
      setSubmitSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(isEditMode ? `/events/${id}` : '/admin');
      }, 2000);
    }
  };
  
  // If event not found in edit mode
  if (isEditMode && !existingEvent) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          <AlertTitle>Event Not Found</AlertTitle>
          The event you're trying to edit doesn't exist or has been removed.
        </Alert>
        <Button 
          component={Link} 
          to="/admin" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Admin Dashboard
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </Typography>
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Success!</AlertTitle>
            Event has been {isEditMode ? 'updated' : 'created'} successfully. Redirecting...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                multiline
                rows={4}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isMultiDay}
                    onChange={handleSwitchChange}
                    name="isMultiDay"
                    color="primary"
                  />
                }
                label="Multi-day Event"
              />
            </Grid>
            
            {formData.isMultiDay && (
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(date) => handleDateChange('endDate', date)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!errors.endDate}
                        helperText={errors.endDate}
                        required
                      />
                    )}
                    minDate={formData.startDate}
                  />
                </LocalizationProvider>
              </Grid>
            )}
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Registration Start Date"
                  value={formData.registrationStartDate}
                  onChange={(date) => handleDateChange('registrationStartDate', date)}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!errors.registrationStartDate}
                      helperText={errors.registrationStartDate}
                      required
                    />
                  }
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Registration Deadline"
                  value={formData.registrationDeadline}
                  onChange={(date) => handleDateChange('registrationDeadline', date)}
                  renderInput={(params) => 
                    <TextField 
                      {...params} 
                      fullWidth 
                      error={!!errors.registrationDeadline}
                      helperText={errors.registrationDeadline}
                      required
                    />
                  }
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Participants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={handleChange}
                error={!!errors.maxParticipants}
                helperText={errors.maxParticipants}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Event Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Event Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="registration_open">Registration Open</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="past">Past</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL (optional)"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Organizers
              </Typography>
              <TextField
                fullWidth
                placeholder="Type organizer name and press Enter"
                onKeyDown={handleOrganizerInput}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.organizers.map((organizer, index) => (
                  <Chip
                    key={index}
                    label={organizer}
                    onDelete={() => handleRemoveOrganizer(organizer)}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>
                Attendance Settings
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.requiresAttendance}
                          onChange={handleSwitchChange}
                          name="requiresAttendance"
                          color="primary"
                        />
                      }
                      label="Requires Attendance"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Event Days"
                      name="eventDays"
                      type="number"
                      value={formData.eventDays}
                      onChange={handleChange}
                      error={!!errors.eventDays}
                      helperText={errors.eventDays || 'Number of days for attendance tracking'}
                      InputProps={{ inputProps: { min: 1 } }}
                      disabled={!formData.requiresAttendance}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  component={Link} 
                  to="/admin" 
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  size="large"
                >
                  {isEditMode ? 'Update Event' : 'Create Event'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EventForm;