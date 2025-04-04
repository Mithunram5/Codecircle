import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const AppContext = createContext();

// Sample event data with enhanced properties for registration and attendance tracking
const sampleEvents = [
  {
    id: 1,
    title: 'Web Development Workshop',
    description: 'Learn the fundamentals of modern web development with HTML, CSS, and JavaScript. This workshop is perfect for beginners who want to start their journey in web development. We will cover the basics and build a simple website by the end of the session.',
    startDate: '2023-12-15T09:00:00',
    endDate: null,
    registrationDeadline: '2023-12-10T23:59:59',
    registrationStartDate: '2023-11-15T00:00:00',
    maxParticipants: 50,
    currentParticipants: 32,
    status: 'upcoming',
    location: 'Tech Building, Room 101',
    organizers: ['Alex Johnson', 'Samantha Lee'],
    imageUrl: 'https://source.unsplash.com/random?coding,web',
    eventDays: 1,
    requiresAttendance: true,
    attendees: [
      { name: 'John Doe', email: 'john.doe@example.com', college: 'Example College', department: 'Computer Science', registrationDate: '2023-11-20T14:30:00', status: 'confirmed', attendance: { '2023-12-15': { morning: true, afternoon: false } } },
      { name: 'Jane Smith', email: 'jane.smith@example.com', college: 'Example University', department: 'Information Technology', registrationDate: '2023-11-21T10:15:00', status: 'confirmed', attendance: { '2023-12-15': { morning: true, afternoon: true } } }
    ]
  },
  {
    id: 2,
    title: 'Hackathon 2023',
    description: 'Join our annual hackathon and compete with other talented developers to build innovative solutions. Form teams of up to 4 members and work on projects that address real-world problems. Prizes will be awarded to the top three teams.',
    startDate: '2023-12-20T08:00:00',
    endDate: '2023-12-21T20:00:00',
    registrationDeadline: '2023-12-15T23:59:59',
    registrationStartDate: '2023-11-20T00:00:00',
    maxParticipants: 100,
    currentParticipants: 78,
    status: 'registration_open',
    location: 'Main Campus, Innovation Center',
    organizers: ['Michael Chen', 'Priya Patel'],
    imageUrl: 'https://source.unsplash.com/random?hackathon',
    eventDays: 2,
    requiresAttendance: true,
    attendees: []
  },
  {
    id: 3,
    title: 'Introduction to Machine Learning',
    description: 'Discover the basics of machine learning and artificial intelligence in this introductory workshop. We will cover fundamental concepts, algorithms, and practical applications of machine learning in various industries.',
    startDate: '2023-11-10T10:00:00',
    endDate: null,
    registrationDeadline: '2023-11-05T23:59:59',
    registrationStartDate: '2023-10-20T00:00:00',
    maxParticipants: 40,
    currentParticipants: 40,
    status: 'past',
    location: 'Science Building, Room 305',
    organizers: ['Alex Johnson'],
    imageUrl: 'https://source.unsplash.com/random?ai,machine',
    eventDays: 1,
    requiresAttendance: true,
    attendees: [{ name: 'Mark Wilson', email: 'mark.wilson@example.com', college: 'Example College', department: 'Computer Science', registrationDate: '2023-10-25T14:30:00', status: 'confirmed', attendance: { '2023-11-10': { morning: true, afternoon: true } } }]
  },
  {
    id: 4,
    title: 'Mobile App Development',
    description: 'Learn how to build mobile applications for iOS and Android using React Native. This workshop will cover the fundamentals of React Native and guide you through building a simple mobile app that you can showcase in your portfolio.',
    startDate: '2023-12-05T14:00:00',
    endDate: null,
    registrationDeadline: '2023-12-01T23:59:59',
    registrationStartDate: '2023-11-15T00:00:00',
    maxParticipants: 30,
    currentParticipants: 25,
    status: 'ongoing',
    location: 'Tech Building, Room 202',
    organizers: ['Samantha Lee', 'Michael Chen'],
    imageUrl: 'https://source.unsplash.com/random?mobile,app',
    eventDays: 1,
    requiresAttendance: true,
    attendees: [{ name: 'Sarah Johnson', email: 'sarah.j@example.com', college: 'Example University', department: 'Information Technology', registrationDate: '2023-11-20T10:15:00', status: 'confirmed', attendance: { '2023-12-05': { morning: false, afternoon: true } } }]
  },
  {
    id: 5,
    title: 'Competitive Programming Contest',
    description: 'Test your algorithmic and problem-solving skills in this competitive programming contest. Participants will solve a series of challenging problems within a time limit. Prizes will be awarded to the top performers.',
    startDate: '2024-01-15T09:00:00',
    endDate: null,
    registrationDeadline: '2024-01-10T23:59:59',
    registrationStartDate: '2023-12-15T00:00:00',
    maxParticipants: 60,
    currentParticipants: 15,
    status: 'upcoming',
    location: 'Virtual (Online)',
    organizers: ['Priya Patel'],
    imageUrl: 'https://source.unsplash.com/random?programming,competition',
    eventDays: 1,
    requiresAttendance: false,
    attendees: []
  },
  {
    id: 6,
    title: 'Cloud Computing Workshop',
    description: 'Explore the world of cloud computing and learn how to deploy applications on popular cloud platforms. This workshop will cover cloud concepts, services, and hands-on exercises to help you get started with cloud technologies.',
    startDate: '2024-01-25T13:00:00',
    endDate: '2024-01-26T17:00:00',
    registrationDeadline: '2024-01-20T23:59:59',
    registrationStartDate: '2023-12-25T00:00:00',
    maxParticipants: 35,
    currentParticipants: 10,
    status: 'registration_open',
    location: 'Tech Building, Room 303',
    organizers: ['Michael Chen'],
    imageUrl: 'https://source.unsplash.com/random?cloud,computing',
    eventDays: 2,
    requiresAttendance: true,
    attendees: []
  }
];

// Context provider component
export const AppProvider = ({ children }) => {
  // State for user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Load user data from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.isAdmin || false);
    }
  }, []);
  
  // State for events
  const [events, setEvents] = useState(sampleEvents);
  
  // Handle user login
  const login = (adminStatus = false, userData = {}) => {
    const user = {
      id: Date.now(),
      isAdmin: adminStatus,
      ...userData
    };
    
    setIsAuthenticated(true);
    setIsAdmin(adminStatus);
    setCurrentUser(user);
    
    // Save user data to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
  };
  
  // Handle user logout
  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    
    // Remove user data from localStorage
    localStorage.removeItem('currentUser');
  };
  
  // Update user profile
  const updateUserProfile = (profileData) => {
    if (!currentUser) return;
    
    const updatedUser = {
      ...currentUser,
      ...profileData
    };
    
    setCurrentUser(updatedUser);
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };
  
  // Handle saving a new or updated event
  const saveEvent = (eventData) => {
    // Check if it's a new event or an update
    if (events.some(event => event.id === eventData.id)) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === eventData.id ? eventData : event
      ));
    } else {
      // Add new event with default values for new fields
      const newEvent = {
        ...eventData,
        id: Date.now(),
        currentParticipants: 0,
        attendees: [],
        registrationStartDate: eventData.registrationStartDate || new Date().toISOString(),
        eventDays: eventData.eventDays || 1,
        requiresAttendance: eventData.requiresAttendance !== undefined ? eventData.requiresAttendance : true
      };
      setEvents([...events, newEvent]);
    }
  };
  
  // Handle deleting an event
  const deleteEvent = (eventId) => {
    setEvents(events.filter(event => event.id !== eventId));
  };
  
  // Register a participant for an event
  const registerParticipant = (eventId, participantData) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Create attendance object based on event days
        const attendance = {};
        if (event.requiresAttendance) {
          const startDate = new Date(event.startDate);
          for (let i = 0; i < (event.eventDays || 1); i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateKey = currentDate.toISOString().split('T')[0];
            attendance[dateKey] = { morning: false, afternoon: false };
          }
        }
        
        return {
          ...event,
          currentParticipants: event.currentParticipants + 1,
          attendees: [
            ...event.attendees,
            {
              ...participantData,
              registrationDate: new Date().toISOString(),
              status: 'confirmed',
              attendance
            }
          ]
        };
      }
      return event;
    }));
  };
  
  // Update attendance for a participant
  const updateAttendance = (eventId, participantEmail, date, session, isPresent) => {
    setEvents(events.map(event => {
      if (event.id === eventId) {
        return {
          ...event,
          attendees: event.attendees.map(attendee => {
            if (attendee.email === participantEmail) {
              const updatedAttendance = { ...attendee.attendance };
              if (!updatedAttendance[date]) {
                updatedAttendance[date] = { morning: false, afternoon: false };
              }
              updatedAttendance[date][session] = isPresent;
              
              return {
                ...attendee,
                attendance: updatedAttendance
              };
            }
            return attendee;
          })
        };
      }
      return event;
    }));
  };
  
  // Export attendance data to CSV format
  const exportAttendanceData = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return '';
    
    // Create headers
    let headers = ['Name', 'Email', 'College', 'Department'];
    
    // Add date headers based on event days
    const startDate = new Date(event.startDate);
    const dateHeaders = [];
    
    for (let i = 0; i < (event.eventDays || 1); i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];
      dateHeaders.push(`${dateStr} (Morning)`, `${dateStr} (Afternoon)`);
    }
    
    headers = [...headers, ...dateHeaders];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add attendee data
    event.attendees.forEach(attendee => {
      const row = [
        attendee.name,
        attendee.email,
        attendee.college,
        attendee.department
      ];
      
      // Add attendance data
      for (let i = 0; i < (event.eventDays || 1); i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];
        
        const morningAttendance = attendee.attendance?.[dateStr]?.morning ? 'Present' : 'Absent';
        const afternoonAttendance = attendee.attendance?.[dateStr]?.afternoon ? 'Present' : 'Absent';
        
        row.push(morningAttendance, afternoonAttendance);
      }
      
      csvContent += row.join(',') + '\n';
    });
    
    return csvContent;
  };
  
  // Context value
  const contextValue = {
    isAuthenticated,
    isAdmin,
    currentUser,
    events,
    login,
    logout,
    saveEvent,
    deleteEvent,
    registerParticipant,
    updateAttendance,
    exportAttendanceData,
    updateUserProfile
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};