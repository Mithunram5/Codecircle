import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, TextField, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Checkbox, FormControlLabel, Alert, AlertTitle, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format } from 'date-fns';

const AttendanceTracker = ({ events }) => {
  const { id, session } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // Find the event with the matching ID
  const event = events.find(event => event.id === parseInt(id) || event.id === id);
  
  // Initialize attendance data from event participants
  useEffect(() => {
    if (event && event.attendees) {
      // In a real app, you would fetch the attendance data from the backend
      // For now, we'll create sample data based on the event attendees
      const initialAttendanceData = event.attendees.map(attendee => ({
        ...attendee,
        present: false // Initially mark everyone as absent
      }));
      setAttendanceData(initialAttendanceData);
    }
  }, [event]);
  
  if (!event) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error">
          <AlertTitle>Event Not Found</AlertTitle>
          The event you're looking for doesn't exist or has been removed.
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
  
  // Filter attendees based on search query
  const filteredAttendees = attendanceData.filter(attendee => {
    return attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           attendee.email.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  // Handle attendance toggle
  const handleAttendanceToggle = (index) => {
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].present = !updatedAttendanceData[index].present;
    setAttendanceData(updatedAttendanceData);
  };
  
  // Handle mark all present
  const handleMarkAllPresent = () => {
    const updatedAttendanceData = attendanceData.map(attendee => ({
      ...attendee,
      present: true
    }));
    setAttendanceData(updatedAttendanceData);
  };
  
  // Handle mark all absent
  const handleMarkAllAbsent = () => {
    const updatedAttendanceData = attendanceData.map(attendee => ({
      ...attendee,
      present: false
    }));
    setAttendanceData(updatedAttendanceData);
  };
  
  // Handle save attendance
  const handleSaveAttendance = () => {
    // In a real app, you would send the attendance data to the backend
    // For now, we'll just simulate a successful save
    setSubmitSuccess(true);
    
    // Redirect after a short delay
    setTimeout(() => {
      navigate(`/events/${id}`);
    }, 2000);
  };
  
  // Format the current date
  const currentDate = format(new Date(), 'MMMM dd, yyyy');
  
  // Get the session display name
  const sessionDisplayName = session === 'morning' ? 'Morning Session' : 'Afternoon Session';
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            component={Link} 
            to={`/events/${id}`} 
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Attendance Tracker
          </Typography>
        </Box>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {event.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {sessionDisplayName} - {currentDate}
          </Typography>
        </Box>
        
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>Success!</AlertTitle>
            Attendance has been saved successfully. Redirecting...
          </Alert>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <TextField
            placeholder="Search participants..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          
          <Box>
            <Button 
              variant="outlined" 
              color="success" 
              onClick={handleMarkAllPresent}
              sx={{ mr: 1 }}
            >
              Mark All Present
            </Button>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleMarkAllAbsent}
            >
              Mark All Absent
            </Button>
          </Box>
        </Box>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>College</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Attendance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((attendee, index) => (
                  <TableRow key={index}>
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.college}</TableCell>
                    <TableCell>{attendee.department}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={attendee.present}
                            onChange={() => handleAttendanceToggle(index)}
                            color="primary"
                          />
                        }
                        label={attendee.present ? 'Present' : 'Absent'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {searchQuery ? 'No matching participants found' : 'No participants registered for this event'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleSaveAttendance}
          >
            Save Attendance
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AttendanceTracker;