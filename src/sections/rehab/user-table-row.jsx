import { useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from 'src/_mock/user';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import Iconify from 'src/components/iconify';

export default function UserTableRow({ row, selected, handleClick, filterName, fetchUserData }) {
  const [openModal, setOpenModal] = useState(false);
  const [openPinModal, setOpenPinModal] = useState(false); // New state for pin modal
  const [pin, setPin] = useState(''); // Pin state
  const [selectedVisit, setSelectedVisit] = useState('visit_1');
  const [formData, setFormData] = useState({
    phone_number: '',
    alternate_number: '',
    sno: '',
    name: '',
    age: '',
    occupation: '',
    diagnosis: '',
    treatment_plan: '',
    staff_attended: '',
    medical_history: '',
    days_attended: '',
    amount_paid: '',
    rehab_commencement_date: '',
    rehab_last_date: '',
    visit_1: '',
    visit_2: '',
    visit_3: '',
    visit_4: '',
    visit_5: '',
    visit_6: '',
    visit_7: '',
    visit_8: '',
    visit_9: '',
    visit_10: '',
  });
  const [action, setAction] = useState(''); // Track action (edit or delete)

  // Handle modal open for editing user
  const handleOpenEdit = (rowData) => {
    setFormData({ ...rowData });
    setAction('edit');
    setOpenPinModal(true); // Open pin modal before edit
  };

  // Handle modal open for deleting user
  const handleOpenDelete = (rowData) => {
    setFormData({ ...rowData });
    setAction('delete');
    setOpenPinModal(true); // Open pin modal before delete
  };

  // Function to close the modals
  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenPinModal(false); // Close pin modal
    setFormData({
      phone_number: '',
      alternate_number: '',
      sno: '',
      name: '',
      age: '',
      occupation: '',
      diagnosis: '',
      treatment_plan: '',
      staff_attended: '',
      medical_history: '',
      days_attended: '',
      amount_paid: '',
      rehab_commencement_date: '',
      rehab_last_date: '',
      visit_1: '',
      visit_2: '',
      visit_3: '',
      visit_4: '',
      visit_5: '',
      visit_6: '',
      visit_7: '',
      visit_8: '',
      visit_9: '',
      visit_10: '',
    });
    setSelectedVisit('visit_1');
    setAction('');
  };

  // Handle the server pin validation and perform action (edit or delete)
  const handlePinSubmit = async () => {
    try {
      const { data, error } = await supabase
        .from('creds')
        .select('serverpin')
        .eq('serverpin', pin);

      if (data && data.length > 0) {
        setOpenPinModal(false); // Close pin modal
        if (action === 'edit') {
          setOpenModal(true); // Open edit/add modal
        } else if (action === 'delete') {
          handleDeleteUser(formData.sno);
        }
      } else {
        alert('Invalid Pin. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying pin:', error.message);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (sno) => {
    try {
      const { error } = await supabase.from('rehab').delete().match({ sno });
      if (error) throw error;
      console.log('User deleted successfully');
      fetchUserData();
      handleCloseModal();
    } catch (error) {
      console.error('Error deleting user:', error.message);
    }
  };

  // Handle form submission for editing or adding user
  const handleSubmit = async () => {
    try {
      const updatedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
      );

      if (action === 'edit') {
        const { error } = await supabase
          .from('rehab')
          .update(updatedData)
          .match({ sno: formData.sno });
        if (error) throw error;
        console.log('User updated successfully');
      } else {
        const { error } = await supabase.from('rehab').insert([updatedData]);
        if (error) throw error;
        console.log('User added successfully');
      }
      handleCloseModal();
      fetchUserData();
    } catch (error) {
      console.error('Error handling user:', error.message);
    }
  };

  // Handle input change in form fields
  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle visit selection change
  const handleVisitChange = (event) => {
    setSelectedVisit(event.target.value);
  };

  // Highlight filtered text in rows
  const highlightText = (text) => {
    if (!filterName || text == null) return text ?? 'N/A';
    const parts = text.toString().split(new RegExp(`(${filterName})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === filterName.toLowerCase() ? <mark key={index}>{part}</mark> : part
        )}
      </span>
    );
  };

  if (!row) {
    return null;
  }

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onChange={(event) => handleClick(event, row.name)} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={row.name} src={row.avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {highlightText(row.phone_number)}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>{highlightText(row.alternate_number)}</TableCell>
        <TableCell>{highlightText(row.sno)}</TableCell>
        <TableCell>{highlightText(row.name)}</TableCell>
        <TableCell>{highlightText(row.age)}</TableCell>
        <TableCell>{highlightText(row.occupation)}</TableCell>
        <TableCell>{highlightText(row.diagnosis)}</TableCell>
        <TableCell>{highlightText(row.treatment_plan)}</TableCell>
        <TableCell>{highlightText(row.staff_attended)}</TableCell>
        <TableCell>{highlightText(row.medical_history)}</TableCell>
        <TableCell>{highlightText(row.days_attended)}</TableCell>
        <TableCell>{highlightText(row.amount_paid)}</TableCell>
        <TableCell>{highlightText(row.rehab_commencement_date)}</TableCell>
        <TableCell>{highlightText(row.rehab_last_date)}</TableCell>
        <TableCell>{highlightText(row.visit_1)}</TableCell>
        <TableCell>{highlightText(row.visit_2)}</TableCell>
        <TableCell>{highlightText(row.visit_3)}</TableCell>
        <TableCell>{highlightText(row.visit_4)}</TableCell>
        <TableCell>{highlightText(row.visit_5)}</TableCell>
        <TableCell>{highlightText(row.visit_6)}</TableCell>
        <TableCell>{highlightText(row.visit_7)}</TableCell>
        <TableCell>{highlightText(row.visit_8)}</TableCell>
        <TableCell>{highlightText(row.visit_9)}</TableCell>
        <TableCell>{highlightText(row.visit_10)}</TableCell>
        <TableCell align="right">
          <IconButton onClick={() => handleOpenEdit(row)}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton onClick={() => handleOpenDelete(row)}>
            <Iconify icon="eva:trash-2-outline" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Pin Modal for validation */}
      <Modal open={openPinModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <Box
            className="modal-header"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" mb={3}>
              Enter Server Pin
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            label="Pin"
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            sx={{ marginBottom: '24px' }}
          />
          <Button fullWidth variant="contained" color="primary" onClick={handlePinSubmit}>
            Submit Pin
          </Button>
        </Box>
      </Modal>

      {/* Edit/Add Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            padding: '24px',
            margin: 'auto',
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Box
            className="modal-header"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #ccc',
              paddingBottom: '12px',
              marginBottom: '16px',
            }}
          >
            <Typography variant="h6">{action === 'edit' ? 'Edit User' : 'Add New User'}</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            className="modal-content"
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {Object.entries(formData).map(([key, value]) => {
              if (!key.startsWith('visit_')) {
                return (
                  <TextField
                    key={key}
                    fullWidth
                    label={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    name={key}
                    value={value}
                    onChange={handleInputChange}
                  />
                );
              }
              return null;
            })}

            <FormControl fullWidth>
              <InputLabel id="visit-select-label">Select Visit</InputLabel>
              <Select
                labelId="visit-select-label"
                id="visit-select"
                value={selectedVisit}
                label="Select Visit"
                onChange={handleVisitChange}
              >
                {[...Array(10)].map((_, index) => (
                  <MenuItem key={index} value={`visit_${index + 1}`}>
                    Visit {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Visit Date"
              name={selectedVisit}
              type="date"
              value={formData[selectedVisit] || ''}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
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
