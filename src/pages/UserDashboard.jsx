import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Grid, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Card, CardContent, TextField, InputAdornment, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';

/**
 * User Dashboard component for regular users to view their registered events
 * and manage their participation
 */
const UserDashboard = () => {
  const { currentUser, events } = useAppContext();
  const [activeTab, setActiveTab] = useState('registered');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter events based on user registration
  const userEvents = events.filter(event => {
    return event.attendees.some(attendee => 
      attendee.email === currentUser?.email
    );
  });

  // Filter events based on search query and active tab
  const filteredEvents = userEvents.filter(event => {
    // Filter by search query
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    let matchesTab = true;
    if (activeTab === 'upcoming') {
      matchesTab = ['upcoming', 'registration_open', 'ongoing'].includes(event.status);
    } else if (activeTab === 'past') {
      matchesTab = event.status === 'past';
    }
    
    return matchesSearch && matchesTab;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get status color
  const getStatusColor = (status) => {
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
  const getStatusText = (status) => {
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

  // Check if user has attendance for a specific event and date
  const getUserAttendance = (event) => {
    const attendee = event.attendees.find(a => a.email === currentUser?.email);
    if (!attendee || !attendee.attendance) return null;
    
    // Get the most recent attendance date
    const attendanceDates = Object.keys(attendee.attendance);
    if (attendanceDates.length === 0) return null;
    
    const latestDate = attendanceDates.sort().pop();
    return {
      date: latestDate,
      morning: attendee.attendance[latestDate]?.morning || false,
      afternoon: attendee.attendance[latestDate]?.afternoon || false
    };
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          My Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to="/events"
        >
          Browse Events
        </Button>
      </Box>

      {currentUser && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                      {userEvents.filter(e => ['upcoming', 'registration_open', 'ongoing'].includes(e.status)).length}
                    </Typography>
                    <Typography variant="body2">
                      Upcoming Events
                    </Typography>
                  </Box>
                  <EventIcon sx={{ fontSize: 40 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 64, 
                      height: 64, 
                      bgcolor: 'primary.main',
                      fontSize: '1.5rem'
                    }}
                  >
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {currentUser.name || 'User'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser.email || 'user@example.com'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Member since: {format(new Date(currentUser.id), 'MMMM yyyy')}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper elevation={2} sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            px: 2,
            pt: 2
          }}
        >
          <Tab label="All Registered Events" value="registered" />
          <Tab label="Upcoming Events" value="upcoming" />
          <Tab label="Past Events" value="past" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Search events..."
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
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Attendance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => {
                    const attendance = getUserAttendance(event);
                    const formattedStartDate = format(new Date(event.startDate), 'MMM dd, yyyy');
                    const formattedEndDate = event.endDate ? format(new Date(event.endDate), 'MMM dd, yyyy') : null;
                    
                    return (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {event.title}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {formattedStartDate}
                          {formattedEndDate && ` - ${formattedEndDate}`}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(event.status)} 
                            color={getStatusColor(event.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {event.requiresAttendance && attendance ? (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                {attendance.morning ? 
                                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} /> : 
                                  <CancelIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                }
                                <Typography variant="body2">
                                  Morning: {attendance.morning ? 'Present' : 'Absent'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {attendance.afternoon ? 
                                  <CheckCircleIcon color="success" fontSize="small" sx={{ mr: 0.5 }} /> : 
                                  <CancelIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                                }
                                <Typography variant="body2">
                                  Afternoon: {attendance.afternoon ? 'Present' : 'Absent'}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {event.requiresAttendance ? 'Not recorded' : 'Not required'}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            component={Link}
                            to={`/events/${event.id}`}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        {searchQuery ? 
                          "No matching events found." : 
                          activeTab === 'registered' ? 
                            "You haven't registered for any events yet." : 
                            activeTab === 'upcoming' ? 
                              "You don't have any upcoming events." : 
                              "You don't have any past events."}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
};

export default UserDashboard;