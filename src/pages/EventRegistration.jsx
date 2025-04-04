import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, TextField, Grid,
  Stepper, Step, StepLabel, Alert, AlertTitle, Checkbox, FormControlLabel
} from '@mui/material';
import { format } from 'date-fns';

const EventRegistration = ({ events }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    year: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  // Find the event with the matching ID
  const event = events.find(event => event.id === parseInt(id) || event.id === id);

  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          <AlertTitle>Event Not Found</AlertTitle>
          The event you're looking for doesn't exist or has been removed.
        </Alert>
        <Button 
          component={Link} 
          to="/events" 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Events
        </Button>
      </Container>
    );
  }

  // Check if registration is still open
  const isRegistrationOpen = ['registration_open', 'upcoming'].includes(event.status);
  
  // Check if event is full
  const isEventFull = event.currentParticipants >= event.maxParticipants;

  if (!isRegistrationOpen || isEventFull) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          <AlertTitle>
            {isEventFull ? 'Event is Full' : 'Registration Closed'}
          </AlertTitle>
          {isEventFull 
            ? 'This event has reached its maximum capacity.'
            : 'The registration period for this event has ended.'}
        </Alert>
        <Button 
          component={Link} 
          to={`/events/${id}`} 
          variant="contained" 
          sx={{ mt: 2 }}
        >
          Back to Event Details
        </Button>
      </Container>
    );
  }

  // Format dates
  const formattedStartDate = format(new Date(event.startDate), 'MMMM dd, yyyy');
  const formattedEndDate = event.endDate ? format(new Date(event.endDate), 'MMMM dd, yyyy') : null;
  const formattedDeadline = format(new Date(event.registrationDeadline), 'MMMM dd, yyyy');

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeToTerms' ? checked : value
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
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.college.trim()) {
      newErrors.college = 'College name is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.year.trim()) {
      newErrors.year = 'Year of study is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateForm()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      // Submit registration (would connect to backend in a real app)
      setActiveStep(2);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // Handle finish
  const handleFinish = () => {
    navigate(`/events/${id}`);
  };

  // Steps for the registration process
  const steps = ['Personal Information', 'Review', 'Confirmation'];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Register for {event.title}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Event Date: {formattedStartDate}{formattedEndDate ? ` - ${formattedEndDate}` : ''}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Registration Deadline: {formattedDeadline}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Available Spots: {event.maxParticipants - event.currentParticipants} of {event.maxParticipants}
          </Typography>
        </Box>
        
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Personal Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
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
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="College/Institution"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  error={!!errors.college}
                  helperText={errors.college}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  error={!!errors.department}
                  helperText={errors.department}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Year of Study"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  error={!!errors.year}
                  helperText={errors.year}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label="I agree to the terms and conditions"
                />
                {errors.agreeToTerms && (
                  <Typography variant="caption" color="error">
                    {errors.agreeToTerms}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Review Your Information
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Full Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.email}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Phone Number
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.phone}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    College/Institution
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.college}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Department
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.department}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Year of Study
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formData.year}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Alert severity="info">
              <AlertTitle>Please Note</AlertTitle>
              By registering for this event, you agree to follow all the rules and guidelines set by the organizers.
              Make sure all the information provided is correct before proceeding.
            </Alert>
          </Box>
        )}
        
        {activeStep === 2 && (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Registration Successful!</AlertTitle>
              You have successfully registered for {event.title}.
            </Alert>
            
            <Typography variant="body1" paragraph>
              A confirmation email has been sent to {formData.email} with all the details.
            </Typography>
            
            <Typography variant="body1" paragraph>
              Please make sure to arrive on time for the event. We look forward to seeing you!
            </Typography>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          {activeStep > 0 && activeStep < 2 && (
            <Button onClick={handleBack} variant="outlined">
              Back
            </Button>
          )}
          
          {activeStep < 2 ? (
            <Button 
              onClick={handleNext} 
              variant="contained" 
              color="primary"
              sx={{ ml: 'auto' }}
            >
              {activeStep === 1 ? 'Submit Registration' : 'Next'}
            </Button>
          ) : (
            <Button 
              onClick={handleFinish} 
              variant="contained" 
              color="primary"
              sx={{ mx: 'auto' }}
            >
              Return to Event
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default EventRegistration;