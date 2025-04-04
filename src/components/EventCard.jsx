import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, CardMedia, Grid } from '@mui/material';
import { format } from 'date-fns';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const {
    id,
    title,
    description,
    startDate,
    endDate,
    registrationDeadline,
    maxParticipants,
    currentParticipants,
    status,
    imageUrl
  } = event;

  // Format dates
  const formattedStartDate = format(new Date(startDate), 'MMM dd, yyyy');
  const formattedEndDate = endDate ? format(new Date(endDate), 'MMM dd, yyyy') : null;
  const formattedDeadline = format(new Date(registrationDeadline), 'MMM dd, yyyy');

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

  return (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        }
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={imageUrl || 'https://source.unsplash.com/random?coding'}
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Chip 
            label={getStatusText()} 
            color={getStatusColor()} 
            size="small" 
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description.length > 120 ? `${description.substring(0, 120)}...` : description}
        </Typography>
        
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                {formattedStartDate}{formattedEndDate ? ` - ${formattedEndDate}` : ''}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Registration Deadline: {formattedDeadline}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">
                Participants: {currentParticipants}/{maxParticipants}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          component={Link} 
          to={`/events/${id}`} 
          size="small" 
          variant="outlined" 
          sx={{ mr: 1 }}
        >
          View Details
        </Button>
        
        {isRegistrationOpen && (
          <Button 
            component={Link} 
            to={`/events/${id}/register`} 
            size="small" 
            variant="contained" 
            disabled={isEventFull}
            color="primary"
          >
            {isEventFull ? 'Event Full' : 'Register'}
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default EventCard;