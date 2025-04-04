import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, Typography, Box, Button, Paper, Grid, Chip, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Card, CardContent, Alert, AlertTitle
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { format } from 'date-fns';

const EventDetail = ({ events, isAdmin }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  
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
  
  const {
    title,
    description,
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants,
    currentParticipants,
    status,
    location,
    organizers,
    imageUrl,
    attendees = []
  } = event;
  
  // Format dates
  const formattedStartDate = format(new Date(startDate), 'MMMM dd, yyyy');
  const formattedEndDate = endDate ? format(new Date(endDate), 'MMMM dd, yyyy') : null;
  const formattedDeadline = format(new Date(registrationDeadline), 'MMMM dd, yyyy');
  
  // Determine status color
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'past':
        return 'error';
      case 'registration_open':
        return 'info';
      default:
        return 'default';
    }
  };
  
  // Format status text for display
  const getStatusText = () => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'past':
        return 'Past';
      case 'registration_open':
        return 'Registration Open';
      default:
        return status;
    }
  };
  
  // Check if registration is still open
  const isRegistrationOpen = status === 'registration_open' || status === 'upcoming';
  
  // Check if event is full
  const isEventFull = currentParticipants >= maxParticipants;
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button 
          component={Link} 
          to="/events" 
          variant="outlined" 
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
        
        <Paper 
          elevation={3} 
          sx={{ 
            p: 0, 
            overflow: 'hidden',
            borderRadius: 2
          }}
        >
          <Box 
            sx={{ 
              height: 250, 
              backgroundImage: `url(${imageUrl || 'https://source.unsplash.com/random?coding'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          >
            <Box 
              sx={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                p: 3,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))'
              }}
            >
              <Chip 
                label={getStatusText()} 
                color={getStatusColor()} 
                sx={{ mb: 1 }}
              />
              <Typography variant="h3" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
                {title}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ p: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                mb: 3
              }}
            >
              <Tab label="Details" value="details" />
              {isAdmin && <Tab label="Attendance" value="attendance" />}
              {isAdmin && <Tab label="Participants" value="participants" />}
            </Tabs>
            
            {activeTab === 'details' && (
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    About This Event
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
                    Organizers
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {organizers?.map((organizer, index) => (
                      <Chip key={index} label={organizer} />
                    )) || <Typography variant="body2">Code Circle Team</Typography>}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Event Details
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <CalendarTodayIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Date
                          </Typography>
                          <Typography variant="body2">
                            {formattedStartDate}{formattedEndDate ? ` - ${formattedEndDate}` : ''}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <AccessTimeIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Registration Deadline
                          </Typography>
                          <Typography variant="body2">
                            {formattedDeadline}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <LocationOnIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Location
                          </Typography>
                          <Typography variant="body2">
                            {location || 'To be announced'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <PeopleIcon sx={{ mr: 2, color: 'primary.main', mt: 0.5 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Participants
                          </Typography>
                          <Typography variant="body2">
                            {currentParticipants}/{maxParticipants} registered
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                  
                  {isRegistrationOpen && (
                    <Button 
                      component={Link} 
                      to={`/events/${id}/register`} 
                      variant="contained" 
                      color="primary" 
                      fullWidth 
                      size="large"
                      disabled={isEventFull}
                      sx={{ mb: 2 }}
                    >
                      {isEventFull ? 'Event Full' : 'Register Now'}
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <Button 
                      component={Link} 
                      to={`/admin/events/${id}/edit`} 
                      variant="outlined" 
                      color="primary" 
                      fullWidth
                    >
                      Edit Event
                    </Button>
                  )}
                </Grid>
              </Grid>
            )}
            
            {activeTab === 'attendance' && isAdmin && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Attendance Tracking
                </Typography>
                
                <Paper variant="outlined" sx={{ mb: 4, p: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Mark Attendance
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        component={Link}
                        to={`/admin/events/${id}/attendance/morning`}
                      >
                        Morning Session
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        component={Link}
                        to={`/admin/events/${id}/attendance/afternoon`}
                      >
                        Afternoon Session
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Button 
                    variant="outlined" 
                    color="primary"
                    component={Link}
                    to={`/admin/events/${id}/export-attendance`}
                  >
                    Export Attendance Data
                  </Button>
                </Paper>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mt: 4 }}>
                  Attendance Summary
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Morning Session</TableCell>
                        <TableCell>Afternoon Session</TableCell>
                        <TableCell>Total Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Sample attendance data - in a real app, this would come from the backend */}
                      <TableRow>
                        <TableCell>{formattedStartDate}</TableCell>
                        <TableCell>15/{currentParticipants}</TableCell>
                        <TableCell>12/{currentParticipants}</TableCell>
                        <TableCell>15/{currentParticipants}</TableCell>
                      </TableRow>
                      {formattedEndDate && (
                        <TableRow>
                          <TableCell>{formattedEndDate}</TableCell>
                          <TableCell>0/{currentParticipants}</TableCell>
                          <TableCell>0/{currentParticipants}</TableCell>
                          <TableCell>0/{currentParticipants}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {activeTab === 'participants' && isAdmin && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Registered Participants
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Registration Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {attendees.length > 0 ? (
                        attendees.map((attendee, index) => (
                          <TableRow key={index}>
                            <TableCell>{attendee.name}</TableCell>
                            <TableCell>{attendee.email}</TableCell>
                            <TableCell>{format(new Date(attendee.registrationDate), 'MMM dd, yyyy')}</TableCell>
                            <TableCell>
                              <Chip 
                                label={attendee.status} 
                                color={attendee.status === 'confirmed' ? 'success' : 'default'} 
                                size="small" 
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            No participants registered yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EventDetail;