import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar, Divider } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const About = () => {
  // Sample team members data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'President',
      image: 'https://source.unsplash.com/random/300x300/?portrait,1',
      description: 'Computer Science senior with a passion for AI and machine learning.'
    },
    {
      name: 'Samantha Lee',
      role: 'Vice President',
      image: 'https://source.unsplash.com/random/300x300/?portrait,2',
      description: 'Software Engineering junior specializing in web development and UX design.'
    },
    {
      name: 'Michael Chen',
      role: 'Technical Lead',
      image: 'https://source.unsplash.com/random/300x300/?portrait,3',
      description: 'Computer Engineering senior with expertise in full-stack development.'
    },
    {
      name: 'Priya Patel',
      role: 'Event Coordinator',
      image: 'https://source.unsplash.com/random/300x300/?portrait,4',
      description: 'Information Technology junior who loves organizing hackathons and workshops.'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <CodeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Code Circle
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Empowering students through coding, innovation, and community
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          Code Circle is a student-led organization dedicated to fostering a vibrant community of coding enthusiasts at our college. 
          We believe in the power of technology to transform lives and solve real-world problems. Our mission is to provide a 
          supportive environment where students can develop their technical skills, collaborate on innovative projects, and 
          prepare for successful careers in technology.
        </Typography>
        <Typography variant="body1">
          Through workshops, hackathons, coding competitions, and industry networking events, we aim to bridge the gap between 
          classroom learning and practical application. We welcome students from all backgrounds and skill levels, united by a 
          shared passion for coding and technology.
        </Typography>
      </Paper>

      {/* What We Do Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        What We Do
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <SchoolIcon color="primary" sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h6" gutterBottom>Workshops & Training</Typography>
            <Typography variant="body2" color="text.secondary">
              Regular skill-building sessions on programming languages, frameworks, and tools led by experienced peers and industry professionals.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <EmojiEventsIcon color="primary" sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h6" gutterBottom>Hackathons & Competitions</Typography>
            <Typography variant="body2" color="text.secondary">
              Exciting events that challenge participants to solve problems, build projects, and showcase their skills in a competitive environment.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <GroupsIcon color="primary" sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h6" gutterBottom>Networking</Typography>
            <Typography variant="body2" color="text.secondary">
              Opportunities to connect with industry professionals, alumni, and fellow students to build valuable relationships.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CodeIcon color="primary" sx={{ fontSize: 50 }} />
            </Box>
            <Typography variant="h6" gutterBottom>Project Collaboration</Typography>
            <Typography variant="body2" color="text.secondary">
              Collaborative projects that allow members to apply their skills, work in teams, and build impressive portfolio pieces.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Team Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Meet Our Team
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {teamMembers.map((member, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
              <Avatar 
                src={member.image} 
                alt={member.name}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {member.name}
              </Typography>
              <Typography variant="subtitle1" color="primary.main" gutterBottom>
                {member.role}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {member.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Join Us Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Join Code Circle Today
        </Typography>
        <Typography variant="body1" paragraph>
          Whether you're a coding novice or an experienced developer, there's a place for you in our community.
          Gain valuable skills, make lasting connections, and have fun along the way!
        </Typography>
        <Typography variant="h6" gutterBottom>
          Meetings: Every Wednesday at 5:00 PM in the Tech Building, Room 305
        </Typography>
      </Paper>
    </Container>
  );
};

export default About;