import React from 'react';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';
import { format, isPast, isFuture } from 'date-fns';

/**
 * Component to display registration status for an event
 * Shows registration period, capacity, and current status
 */
const RegistrationStatus = ({ event }) => {
  const {
    registrationStartDate,
    registrationDeadline,
    maxParticipants,
    currentParticipants,
    status
  } = event;

  // Calculate registration status
  const now = new Date();
  const regStartDate = new Date(registrationStartDate);
  const regEndDate = new Date(registrationDeadline);
  
  const isRegistrationOpen = status === 'registration_open';
  const isRegistrationFuture = isFuture(regStartDate);
  const isRegistrationPast = isPast(regEndDate);
  
  // Calculate capacity percentage
  const capacityPercentage = Math.min(
    Math.round((currentParticipants / maxParticipants) * 100),
    100
  );

  // Determine color based on capacity
  const getCapacityColor = () => {
    if (capacityPercentage >= 90) return 'error';
    if (capacityPercentage >= 70) return 'warning';
    return 'success';
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Registration Period
        </Typography>
        {isRegistrationOpen && (
          <Chip 
            label="Registration Open" 
            color="info" 
            size="small" 
          />
        )}
        {isRegistrationFuture && (
          <Chip 
            label="Registration Not Started" 
            color="default" 
            size="small" 
          />
        )}
        {isRegistrationPast && (
          <Chip 
            label="Registration Closed" 
            color="error" 
            size="small" 
          />
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {format(regStartDate, 'MMM dd, yyyy')} - {format(regEndDate, 'MMM dd, yyyy')}
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Capacity
          </Typography>
          <Typography variant="body2" color={getCapacityColor()}>
            {currentParticipants} / {maxParticipants}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={capacityPercentage} 
          color={getCapacityColor()}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
    </Box>
  );
};

export default RegistrationStatus;