import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Tabs, Tab, TextField, InputAdornment, Divider, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EventCard from '../components/EventCard';

const Events = ({ events }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Filter events based on active tab and search query
  const filteredEvents = events.filter(event => {
    // Filter by search query
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    let matchesTab = true;
    if (activeTab !== 'all') {
      matchesTab = event.status === activeTab;
    }
    
    return matchesSearch && matchesTab;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Events
      </Typography>
      
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search events..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ 
                '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
                '& .MuiTab-root': { textTransform: 'none' }
              }}
            >
              <Tab label="All Events" value="all" />
              <Tab label="Registration Open" value="registration_open" />
              <Tab label="Upcoming" value="upcoming" />
              <Tab label="Ongoing" value="ongoing" />
              <Tab label="Past" value="past" />
            </Tabs>
          </Grid>
        </Grid>
      </Box>
      
      <Divider sx={{ mb: 4 }} />
      
      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <Grid container spacing={3}>
          {filteredEvents.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4}>
              <EventCard event={event} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 
              "Try adjusting your search criteria." : 
              "There are no events in this category at the moment."}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Events;