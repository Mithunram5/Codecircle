import React, { useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Checkbox, Button, TextField, InputAdornment, IconButton, Chip, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { format } from 'date-fns';
import { useAppContext } from '../context/AppContext';

/**
 * Component for tracking attendance with morning and afternoon shifts
 * Allows admins to mark attendance and export data
 */
const AttendanceSheet = ({ event, date, session }) => {
  const { updateAttendance, exportAttendanceData } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [attendees, setAttendees] = useState(event.attendees || []);

  // Format the date for display
  const formattedDate = format(new Date(date), 'MMMM dd, yyyy');
  
  // Filter attendees based on search query
  const filteredAttendees = attendees.filter(attendee => {
    return attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
           attendee.college.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle attendance toggle
  const handleAttendanceToggle = (email, isPresent) => {
    // Update local state for immediate UI feedback
    setAttendees(attendees.map(attendee => {
      if (attendee.email === email) {
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
    }));
    
    // Update context state
    updateAttendance(event.id, email, date, session, isPresent);
  };

  // Handle mark all present
  const handleMarkAllPresent = () => {
    const updatedAttendees = attendees.map(attendee => {
      const updatedAttendance = { ...attendee.attendance };
      if (!updatedAttendance[date]) {
        updatedAttendance[date] = { morning: false, afternoon: false };
      }
      updatedAttendance[date][session] = true;
      
      return {
        ...attendee,
        attendance: updatedAttendance
      };
    });
    
    setAttendees(updatedAttendees);
    
    // Update context state for each attendee
    updatedAttendees.forEach(attendee => {
      updateAttendance(event.id, attendee.email, date, session, true);
    });
  };

  // Handle mark all absent
  const handleMarkAllAbsent = () => {
    const updatedAttendees = attendees.map(attendee => {
      const updatedAttendance = { ...attendee.attendance };
      if (!updatedAttendance[date]) {
        updatedAttendance[date] = { morning: false, afternoon: false };
      }
      updatedAttendance[date][session] = false;
      
      return {
        ...attendee,
        attendance: updatedAttendance
      };
    });
    
    setAttendees(updatedAttendees);
    
    // Update context state for each attendee
    updatedAttendees.forEach(attendee => {
      updateAttendance(event.id, attendee.email, date, session, false);
    });
  };

  // Handle export attendance data
  const handleExportAttendance = () => {
    const csvData = exportAttendanceData(event.id);
    if (!csvData) return;
    
    // Create a blob and download link
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}_attendance_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {formattedDate} - {session === 'morning' ? 'Morning Session' : 'Afternoon Session'}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Registered: {attendees.length} participants
        </Typography>
      </Box>
      
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
          sx={{ width: { xs: '100%', sm: '300px' } }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            variant="outlined" 
            color="success" 
            size="small"
            onClick={handleMarkAllPresent}
          >
            Mark All Present
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            size="small"
            onClick={handleMarkAllAbsent}
          >
            Mark All Absent
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportAttendance}
          >
            Export
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.100' }}>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Department</TableCell>
              <TableCell align="center">Attendance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee, index) => {
                // Check if the attendee has attendance data for this date and session
                const isPresent = attendee.attendance?.[date]?.[session] || false;
                
                return (
                  <TableRow key={index} hover>
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.email}</TableCell>
                    <TableCell>{attendee.college}</TableCell>
                    <TableCell>{attendee.department}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Tooltip title={isPresent ? 'Mark as Absent' : 'Mark as Present'}>
                          <Checkbox
                            checked={isPresent}
                            onChange={() => handleAttendanceToggle(attendee.email, !isPresent)}
                            icon={<CancelIcon color="error" />}
                            checkedIcon={<CheckCircleIcon color="success" />}
                          />
                        </Tooltip>
                        <Chip 
                          label={isPresent ? 'Present' : 'Absent'} 
                          color={isPresent ? 'success' : 'error'}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    {searchQuery ? 'No matching participants found.' : 'No participants registered for this event.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttendanceSheet;