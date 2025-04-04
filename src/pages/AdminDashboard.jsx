import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Paper, Grid, Tabs, Tab,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, IconButton, Card, CardContent, TextField, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { format } from 'date-fns';

const AdminDashboard = ({ events }) => {
  const [activeTab, setActiveTab] = useState('events');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/admin/events/new"
        >
          Create Event
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {events.filter(e => ['upcoming', 'registration_open', 'ongoing'].includes(e.status)).length}
                  </Typography>
                  <Typography variant="body2">
                    Active Events
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {events.reduce((total, event) => total + event.currentParticipants, 0)}
                  </Typography>
                  <Typography variant="body2">
                    Total Participants
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {events.filter(e => e.status === 'registration_open').length}
                  </Typography>
                  <Typography variant="body2">
                    Open Registrations
                  </Typography>
                </Box>
                <AssignmentIcon sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Tab label="Events" value="events" />
          <Tab label="Attendance" value="attendance" />
          <Tab label="Participants" value="participants" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <TextField
              placeholder="Search..."
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

            {activeTab === 'attendance' && (
              <Button 
                variant="outlined" 
                startIcon={<DownloadIcon />}
                component={Link}
                to="/admin/export-all-attendance"
              >
                Export All Data
              </Button>
            )}
          </Box>

          {activeTab === 'events' && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Registration</TableCell>
                    <TableCell>Participants</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Link to={`/events/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {event.title}
                            </Typography>
                          </Link>
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.startDate), 'MMM dd, yyyy')}
                          {event.endDate && ` - ${format(new Date(event.endDate), 'MMM dd, yyyy')}`}
                        </TableCell>
                        <TableCell>
                          Deadline: {format(new Date(event.registrationDeadline), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {event.currentParticipants}/{event.maxParticipants}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={getStatusText(event.status)} 
                            color={getStatusColor(event.status)} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            component={Link} 
                            to={`/admin/events/${event.id}/edit`}
                            color="primary"
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 'attendance' && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Morning Attendance</TableCell>
                    <TableCell>Afternoon Attendance</TableCell>
                    <TableCell>Total Participants</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {event.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {format(new Date(event.startDate), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {/* Sample data - in a real app, this would come from the backend */}
                          {Math.floor(event.currentParticipants * 0.8)}/{event.currentParticipants}
                        </TableCell>
                        <TableCell>
                          {/* Sample data */}
                          {Math.floor(event.currentParticipants * 0.7)}/{event.currentParticipants}
                        </TableCell>
                        <TableCell>
                          {event.currentParticipants}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<DownloadIcon />}
                            component={Link}
                            to={`/admin/events/${event.id}/export-attendance`}
                          >
                            Export
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No events found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {activeTab === 'participants' && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>College</TableCell>
                    <TableCell>Events Registered</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Sample participant data - in a real app, this would come from the backend */}
                  <TableRow>
                    <TableCell>John Doe</TableCell>
                    <TableCell>john.doe@example.com</TableCell>
                    <TableCell>Example College</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to="/admin/participants/1"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jane Smith</TableCell>
                    <TableCell>jane.smith@example.com</TableCell>
                    <TableCell>Example University</TableCell>
                    <TableCell>2</TableCell>
                    <TableCell>
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={Link}
                        to="/admin/participants/2"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;