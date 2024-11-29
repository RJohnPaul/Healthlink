import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { supabase } from 'src/_mock/user';

import Iconify from 'src/components/iconify';

import clinicLogo from '../../components/logo/cliniclogo.png';

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

const invoiceStyles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    padding: 20,
    fontSize: 12,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    marginRight: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  companyInfo: {
    flex: 1,
    alignItems: 'center',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  companyAddress: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#333',
    borderBottomWidth: 2,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#333',
    color: '#fff',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerContact: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

export default function UserTableRow({ row, selected, handleClick, filterName, fetchUserData }) {
  const [openModal, setOpenModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    sno: '',
    name: '',
    mobile_number: '',
    date_joined: null,
    selectedMonth: '',
    daysPresent: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [userData, setUserData] = useState(null);

  const currentMonth = months[dayjs().month()];
  const currentMonthCapitalized = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  useEffect(() => {
    fetchUserDataById(row.sno);
  }, [row.sno]);

  const fetchUserDataById = async (sno) => {
    try {
      const { data, error } = await supabase.from('staff').select('*').eq('sno', sno).single();
      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ open: false, message: '', severity: 'success' });
  };

  const handleOpenMenu = (rowData) => {
    setEditingUser(rowData);
    setOpenModal(true);
    setFormData({
      sno: rowData.sno || '',
      name: rowData.name || '',
      mobile_number: rowData.mobile_number || '',
      date_joined: rowData.date_joined ? dayjs(rowData.date_joined) : null,
      selectedMonth: currentMonth,
      daysPresent: rowData[currentMonth] || '',
    });
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingUser(null);
    setFormData({
      sno: '',
      name: '',
      mobile_number: '',
      date_joined: null,
      selectedMonth: '',
      daysPresent: '',
    });
  };

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleDateChange = (value) => {
    setFormData({ ...formData, date_joined: value });
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      sno: formData.sno || null,
      name: formData.name || null,
      mobile_number: formData.mobile_number || null,
      date_joined: formData.date_joined ? formData.date_joined.format('YYYY-MM-DD') : null,
      [formData.selectedMonth]: formData.daysPresent || null,
    };

    try {
      const { error } = await supabase
        .from('staff')
        .update(updatedFormData)
        .match({ sno: editingUser.sno });

      if (error) {
        setSnackbar({ open: true, message: 'Error updating user', severity: 'error' });
        console.error('Error updating user:', error.message);
      } else {
        setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' });
        console.log('User updated successfully');
        handleCloseModal();
        await fetchUserData();
        await fetchUserDataById(editingUser.sno);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error updating user', severity: 'error' });
      console.error('Error updating user:', error.message);
    }

    setTimeout(() => {
      setSnackbar({ open: false, message: '', severity: 'success' });
    }, 3000);
  };

  const handleDeleteUser = async (sno) => {
    try {
      const { error } = await supabase.from('staff').delete().match({ sno });
      if (error) {
        setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
        console.error('Error deleting user:', error.message);
      } else {
        setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        console.log('User deleted successfully');
        await fetchUserData();
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Error deleting user', severity: 'error' });
      console.error('Error deleting user:', error.message);
    }
    setTimeout(() => {
      setSnackbar({ open: false, message: '', severity: 'success' });
    }, 3000);
  };

  const highlightText = (text) => {
    if (!filterName) return text;
    const matchRegex = new RegExp(filterName, 'gi');
    const parts = text.split(matchRegex);
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === filterName.toLowerCase() ? <mark key={index}>{part}</mark> : part
        )}
      </span>
    );
  };

  const displayValue = (value) => (value === null || value === '' ? 'N/A' : value);

  const AttendanceSheet = () => {
    const currentYear = new Date().getFullYear();

    return (
      <Document>
        <Page size="A4" style={invoiceStyles.page}>
          <View style={invoiceStyles.headerContainer}>
            <View style={invoiceStyles.logoContainer}>
              <Image source={clinicLogo} stye={invoiceStyles.logo} />
            </View>
            <View style={invoiceStyles.companyInfo}>
              <Text style={invoiceStyles.companyName}>Healthlink Pro Physio Rehab Clinic</Text>
              <Text style={invoiceStyles.companyAddress}>
                No 1a, 1st Floor, First Main Road, Madambakkam, Chennai - 600126
              </Text>
              <Text style={invoiceStyles.companyAddress}>(Near Bus Stop, Sudharsan Nagar)</Text>
            </View>
          </View>
          <Text style={invoiceStyles.header}>STAFF ATTENDANCE SHEET</Text>
          <View style={invoiceStyles.row}>
            <Text style={invoiceStyles.label}>Staff Name:</Text>
            <Text>{userData.name}</Text>
          </View>
          <View style={invoiceStyles.row}>
            <Text style={invoiceStyles.label}>Serial No:</Text>
            <Text>{userData.sno}</Text>
          </View>
          <View style={invoiceStyles.row}>
            <Text style={invoiceStyles.label}>Year:</Text>
            <Text>{currentYear}</Text>
          </View>
          {months.map((month, index) => {
            const daysInMonth = getDaysInMonth(index, currentYear);
            const daysAttended = userData[month] || 0;
            return (
              <View key={month} style={invoiceStyles.row}>
                <Text>{month.toUpperCase()}</Text>
                <Text>
                  {daysAttended} / {daysInMonth}
                </Text>
              </View>
            );
          })}
        </Page>
      </Document>
    );
  };

  const { sno, name, mobile_number, date_joined } = row;
  const daysPresent = row[currentMonth] || 'N/A';

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={(event) => handleClick(event, name)} />
        </TableCell>

        <TableCell>{highlightText(displayValue(sno))}</TableCell>
        <TableCell>{highlightText(displayValue(name))}</TableCell>
        <TableCell>{highlightText(displayValue(mobile_number))}</TableCell>
        <TableCell>{highlightText(displayValue(date_joined))}</TableCell>
        <TableCell>{highlightText(currentMonthCapitalized)}</TableCell>
        <TableCell>{highlightText(displayValue(daysPresent))}</TableCell>
        <TableCell align="right">
          <IconButton onClick={() => handleOpenMenu(row)}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton onClick={() => handleDeleteUser(row.sno)}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
          {userData ? (
            <PDFDownloadLink
              document={<AttendanceSheet />}
              fileName={`attendance_sheet_${row.sno}.pdf`}
            >
              {({ loading }) => (
                <IconButton>{loading ? '' : <Iconify icon="eva:download-fill" />}</IconButton>
              )}
            </PDFDownloadLink>
          ) : (
            <IconButton>
              <Iconify icon="eva:printer-fill" />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Edit User
          </Typography>
          <TextField
            fullWidth
            label="Serial No"
            name="sno"
            value={formData.sno}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mobile Number"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleInputChange}
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date of Joining"
              value={formData.date_joined}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin="normal">
            <InputLabel id="month-select-label">Select Month</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={formData.selectedMonth}
              label="Select Month"
              onChange={handleInputChange}
              name="selectedMonth"
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month.toUpperCase()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Days Absent"
            name="daysPresent"
            type="number"
            value={formData.daysPresent}
            onChange={handleInputChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseModal} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="contained">
              Save Changes
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

UserTableRow.propTypes = {
  row: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  filterName: PropTypes.string.isRequired,
  fetchUserData: PropTypes.func.isRequired,
};
