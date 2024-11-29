import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { supabase } from 'src/_mock/user';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, getComparator, applyFilter } from '../utils';

export default function RehabView() {
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isPinValid, setIsPinValid] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    alternate_number: '',
    name: '',
    age: '',
    occupation: '',
    diagnosis: '',
    treatment_plan: '',
    staff_attended: '',
    medical_history: '',
    amount_paid: '',
    days_attended: '',
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
  const [selectedVisit, setSelectedVisit] = useState('visit_1');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [orderBy, setOrderBy] = useState('sno');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const pageSize = 1000; 
    const fetchPage = (currentPage, accumulatedData = [], recordCount = null) => {
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      return supabase
        .from('rehab')
        .select('*', { count: 'exact' })
        .order('sno', { ascending: true })
        .range(from, to)
        .then(({ data, error, count }) => {
          if (error) {
            throw error;
          }

          const newData = [...accumulatedData, ...(data || [])];
          const newRecordCount = recordCount === null ? count : recordCount;

          if (!data || data.length < pageSize) {
            return { data: newData, count: newRecordCount };
          }

          return fetchPage(currentPage + 1, newData, newRecordCount);
        });
    };

    try {
      const { data: allData, count: totalRecords } = await fetchPage(0);
      setTotalCount(totalRecords || 0);
      setUsers(allData);
    } catch (error) {
      console.error('Error in fetchUserData:', error.message);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleOpenModal = () => {
    setOpenPinModal(true); 
    setPin(''); // Reset the pin every time modal opens
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetFormData();
  };

  const handleClosePinModal = () => {
    setOpenPinModal(false);
    setPin('');
  };

  const resetFormData = () => {
    setFormData({
      phone_number: '',
      alternate_number: '',
      name: '',
      age: '',
      occupation: '',
      diagnosis: '',
      treatment_plan: '',
      staff_attended: '',
      medical_history: '',
      amount_paid: '',
      days_attended: '',
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
  };

  const handlePinSubmit = async () => {
    const { data, error } = await supabase
      .from('creds')
      .select('serverpin')
      .eq('serverpin', pin);

    if (data && data.length > 0) {
      setIsPinValid(true);
      setOpenModal(true);  // Open the edit/add modal
      setOpenPinModal(false);  // Close pin modal
    } else {
      setIsPinValid(false);
      alert('Invalid Pin. Please try again.');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVisitChange = (event) => {
    setSelectedVisit(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
      );

      const { data: lastRecord, error: lastRecordError } = await supabase
        .from('rehab')
        .select('sno')
        .order('sno', { ascending: false })
        .limit(1);

      if (lastRecordError) {
        throw lastRecordError;
      }

      const newSno = lastRecord.length > 0 ? lastRecord[0].sno + 1 : 1;
      cleanedFormData.sno = newSno;

      const { data, error } = await supabase.from('rehab').insert([cleanedFormData]);
      if (error) {
        throw error;
      }
      handleCloseModal();
      fetchUserData();
      resetFormData();
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };

  const filteredUsers = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleEditOrDelete = () => {
    // Show pin modal when trying to edit or delete
    setOpenPinModal(true);
    setPin(''); // Reset pin every time
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Rehab Patients</Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenModal}
        >
          Add User
        </Button>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={setFilterName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={(event, id) => {
                  const isAsc = orderBy === id && order === 'asc';
                  setOrder(isAsc ? 'desc' : 'asc');
                  setOrderBy(id);
                }}
                onSelectAllClick={(event) => {
                  if (event.target.checked) {
                    const newSelecteds = users.map((n) => n.name);
                    setSelected(newSelecteds);
                    return;
                  }
                  setSelected([]);
                }}
                headLabel={[
                  { id: 'phone_number', label: 'Phone No' },
                  { id: 'alternate_number', label: 'Alternate No' },
                  { id: 'sno', label: 'Serial No' },
                  { id: 'name', label: 'Name' },
                  { id: 'age', label: 'Age' },
                  { id: 'occupation', label: 'Occupation' },
                  { id: 'diagnosis', label: 'Diagnosis' },
                  { id: 'treatment_plan', label: 'Treatment Plan' },
                  { id: 'staff_attended', label: 'Staff Attended' },
                  { id: 'medical_history', label: 'Medical History' },
                  { id: 'days_attended', label: 'Days Attended' },
                  { id: 'amount_paid', label: 'Amount Paid' },
                  {id: 'rehab_commencement_date', label: 'Rehab Commencement Date'},
                  {id: 'rehab_last_date', label: 'Rehab Last Date'},
                  { id: 'visit_1', label: 'V-1' },
                  { id: 'visit_2', label: 'V-2' },
                  { id: 'visit_3', label: 'V-3' },
                  { id: 'visit_4', label: 'V-4' },
                  { id: 'visit_5', label: 'V-5' },
                  { id: 'visit_6', label: 'V-6' },
                  { id: 'visit_7', label: 'V-7' },
                  { id: 'visit_8', label: 'V-8' },
                  { id: 'visit_9', label: 'V-9' },
                  { id: 'visit_10', label: 'V-10' },
                ]}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      alternate_number={row.alternate_number || '-'}
                      phone_number={row.phone_number || '-'}
                      name={row.name || '-'}
                      sno={row.sno || '-'}
                      age={row.age || '-'}
                      occupation={row.occupation || '-'}
                      diagnosis={row.diagnosis || '-'}
                      treatment_plan={row.treatment_plan || '-'}
                      staff_attended={row.staff_attended || '-'}
                      medical_history={row.medical_history || '-'}
                      days_attended={row.days_attended || '-'}
                      amount_paid={row.amount_paid || '-'}
                      rehab_commencement_date={row.rehab_commencement_date || '-'}
                      rehab_last_date={row.rehab_last_date || '-'}
                      visit_1={row.visit_1 || '-'}
                      visit_2={row.visit_2 || '-'}
                      visit_3={row.visit_3 || '-'}
                      visit_4={row.visit_4 || '-'}
                      visit_5={row.visit_5 || '-'}
                      visit_6={row.visit_6 || '-'}
                      visit_7={row.visit_7 || '-'}
                      visit_8={row.visit_8 || '-'}
                      visit_9={row.visit_9 || '-'}
                      visit_10={row.visit_10 || '-'}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => {
                        const selectedIndex = selected.indexOf(row.name);
                        let newSelected = [];
                        if (selectedIndex === -1) {
                          newSelected = newSelected.concat(selected, row.name);
                        } else if (selectedIndex === 0) {
                          newSelected = newSelected.concat(selected.slice(1));
                        } else if (selectedIndex === selected.length - 1) {
                          newSelected = newSelected.concat(selected.slice(0, -1));
                        } else if (selectedIndex > 0) {
                          newSelected = newSelected.concat(
                            selected.slice(0, selectedIndex),
                            selected.slice(selectedIndex + 1)
                          );
                        }
                        setSelected(newSelected);
                      }}
                      handleEditOrDelete={handleEditOrDelete} // Use this function to trigger pin check
                    />
                  ))}
                {emptyRows(page, rowsPerPage, filteredUsers.length) > 0 && (
                  <TableRow
                    style={{ height: 53 * emptyRows(page, rowsPerPage, filteredUsers.length) }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[25, 50, 100, 250, 500]}
        />
      </Card>

      {/* Pin Modal */}
      <Modal open={openPinModal} onClose={handleClosePinModal}>
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
            <IconButton onClick={handleClosePinModal}>
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

      {/* Add User Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'white',
            borderRadius: '8px',
            padding: '24px',
            maxHeight: '80vh',
            overflowY: 'auto', // Allow vertical scrolling
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
            <Typography variant="h6">Add New User</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            className="modal-content"
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <TextField
              fullWidth
              label="Phone No"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Alternate No"
              name="alternate_number"
              value={formData.alternate_number}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Treatment Plan"
              name="treatment_plan"
              value={formData.treatment_plan}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Staff Attended"
              name="staff_attended"
              value={formData.staff_attended}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Medical History"
              name="medical_history"
              value={formData.medical_history}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Days Attended"
              name="days_attended"
              value={formData.days_attended}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Amount Paid"
              name="amount_paid"
              value={formData.amount_paid}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Rehab Commencement Date"
              name="rehab_commencement_date"
              type="date"
              value={formData.rehab_commencement_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Rehab Last Date"
              name="rehab_last_date"
              type="date"
              value={formData.rehab_last_date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
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
    </Container>
  );
}
