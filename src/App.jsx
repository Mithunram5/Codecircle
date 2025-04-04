import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Context
import { AppProvider, useAppContext } from './context/AppContext';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import EventRegistration from './pages/EventRegistration';
import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EventForm from './pages/EventForm';
import AttendanceTracker from './pages/AttendanceTracker';
import UserDashboard from './pages/UserDashboard';
import UserProfile from './pages/UserProfile';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { isAuthenticated, isAdmin: userIsAdmin } = useAppContext();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AppProvider>
  );
}

// Separate component to use context inside Router
function AppContent() {
  const { isAuthenticated, isAdmin, events, login, logout, saveEvent, deleteEvent } = useAppContext();
  
  return (
    <>
      <Navbar isAdmin={isAdmin} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home events={events} />} />
        <Route path="/events" element={<Events events={events} />} />
        <Route path="/events/:id" element={<EventDetail events={events} isAdmin={isAdmin} />} />
        <Route path="/events/:id/register" element={<EventRegistration events={events} />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login onLogin={login} />} />
        
        {/* User routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAdmin={true}>
              <AdminDashboard events={events} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events/new" 
          element={
            <ProtectedRoute isAdmin={true}>
              <EventForm events={events} onSaveEvent={saveEvent} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events/:id/edit" 
          element={
            <ProtectedRoute isAdmin={true}>
              <EventForm events={events} onSaveEvent={saveEvent} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/events/:id/attendance/:session" 
          element={
            <ProtectedRoute isAdmin={true}>
              <AttendanceTracker events={events} />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
