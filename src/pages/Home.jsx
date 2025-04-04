import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';

const Home = ({ events }) => {
  // Filter upcoming events (limit to 3 for display)
  const upcomingEvents = events
    .filter(event => ['upcoming', 'registration_open'].includes(event.status))
    .slice(0, 3);

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          borderRadius: { xs: 0, md: '0 0 20px 20px' },
          mb: 6
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <CodeIcon sx={{ fontSize: 60 }} />
          </Box>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Code Circle
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
            Your College's Premier Coding Community
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={Link}
            to="/events"
            sx={{ 
              px: 4, 
              py: 1.5, 
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            Explore Events
          </Button>
        </Container>
      </Box>

      {/* About Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            About Code Circle
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Code Circle is a vibrant community of coding enthusiasts at our college. We organize workshops, hackathons, and coding competitions to foster technical skills and innovation among students.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <SchoolIcon color="primary" sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" gutterBottom>Learn</Typography>
              <Typography variant="body2" color="text.secondary">
                Participate in workshops and training sessions led by industry experts and experienced peers.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <GroupIcon color="primary" sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" gutterBottom>Connect</Typography>
              <Typography variant="body2" color="text.secondary">
                Build relationships with like-minded individuals and create a network of tech enthusiasts.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 50 }} />
              </Box>
              <Typography variant="h6" gutterBottom>Compete</Typography>
              <Typography variant="body2" color="text.secondary">
                Test your skills in hackathons and coding competitions with exciting prizes and recognition.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Upcoming Events Section */}
      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              Upcoming Events
            </Typography>
            <Button 
              component={Link} 
              to="/events" 
              variant="outlined" 
              color="primary"
            >
              View All Events
            </Button>
          </Box>

          {upcomingEvents.length > 0 ? (
            <Grid container spacing={3}>
              {upcomingEvents.map((event) => (
                <Grid item key={event.id} xs={12} sm={6} md={4}>
                  <EventCard event={event} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No upcoming events at the moment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back soon for new events or subscribe to our notifications.
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>

      {/* Join Us Section */}
      <Container maxWidth="md" sx={{ my: 8, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Join Our Community
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
          Become a part of Code Circle and enhance your coding journey with like-minded peers. Gain access to exclusive events, resources, and networking opportunities.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large"
          component={Link}
          to="/login"
          sx={{ px: 4, py: 1.5 }}
        >
          Sign Up Now
        </Button>
      </Container>
    </Box>
  );
};

export default Home;