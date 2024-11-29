import Papa from 'papaparse';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FormControlLabel from '@mui/material/FormControlLabel';

import { supabase } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function RegularView() {
  const [selected, setSelected] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openPinModal, setOpenPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [isPinValid, setIsPinValid] = useState(false);
  const [csvUploadModalOpen, setCsvUploadModalOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
    bloodbank_conf: false,
    insurance_conf: false,
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

  // Required columns for CSV validation
  const requiredColumns = ['phone_number', 'alternate_number', 'name', 'age'];

  // Helper function to format date from DD-MM-YYYY to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    const pageSize = 1000;
    const fetchPage = (currentPage, accumulatedData = [], recordCount = null) => {
      const from = currentPage * pageSize;
      const to = from + pageSize - 1;

      return supabase
        .from('clinic')
        .select('*', { count: 'exact' })
        .order('sno', { ascending: true })
        .range(from, to)
        .then(({ data, error, count }) => {
          if (error) throw error;
          
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
    if (isPinStillValid()) {
      setOpenModal(true);
    } else {
      setOpenPinModal(true);
      setPin('');
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    resetFormData();
  };

  const handleClosePinModal = () => {
    setOpenPinModal(false);
    setPin('');
  };

  const handleCsvUploadModalOpen = () => {
    setCsvUploadModalOpen(true);
  };

  const handleCsvUploadModalClose = () => {
    setCsvUploadModalOpen(false);
    setCsvFile(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
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
      bloodbank_conf: false,
      insurance_conf: false,
    });
    setSelectedVisit('visit_1');
  };

 // At the top of the component
const PIN_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

// Add new function to check pin validity
const isPinStillValid = useCallback(() => {
  const pinTimestamp = localStorage.getItem('pinTimestamp');
  if (!pinTimestamp) return false;
  
  const now = new Date().getTime();
  return (now - parseInt(pinTimestamp, 10)) < PIN_EXPIRY_TIME;
}, [PIN_EXPIRY_TIME]);

// Modify handlePinSubmit
const handlePinSubmit = async () => {
  try {
    const { data, error } = await supabase
      .from('creds')
      .select('serverpin')
      .eq('serverpin', pin);

    if (error) throw error;

    if (data && data.length > 0) {
      setIsPinValid(true);
      localStorage.setItem('pinTimestamp', new Date().getTime().toString());
      
      if (csvFile) {
        handleCsvUploadModalOpen();
      } else {
        setOpenModal(true);
      }
      setOpenPinModal(false);
    } else {
      setIsPinValid(false);
      setSnackbar({
        open: true,
        message: 'Invalid Pin. Please try again.',
        severity: 'error'
      });
    }
  } catch (error) {
    console.error('Error checking pin:', error);
    setSnackbar({
      open: true,
      message: 'Error validating pin. Please try again.',
      severity: 'error'
    });
  }
};

const handleCsvFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setSnackbar({
        open: true,
        message: 'Please select a CSV file',
        severity: 'error'
      });
      return;
    }
    setCsvFile(file);
    if (isPinStillValid()) {
      handleCsvUploadModalOpen();
    } else {
      handleOpenModal(); // Open pin modal first
    }
  }
};

  const validateAndProcessCsv = async (results) => {
    const headers = results.meta.fields;
    
    // Validate required columns
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      setSnackbar({
        open: true,
        message: `Missing required columns: ${missingColumns.join(', ')}`,
        severity: 'error'
      });
      return false;
    }

    try {
      setUploading(true);

      // Get the last serial number
      const { data: lastRecord } = await supabase
        .from('clinic')
        .select('sno')
        .order('sno', { ascending: false })
        .limit(1);

      let currentSno = lastRecord.length > 0 ? lastRecord[0].sno : 0;

      // Process the data
      const processedData = results.data
        .filter(row => row.phone_number && row.name) // Filter out empty rows
        .map(row => {
          currentSno += 1;
          return {
            ...row,
            sno: currentSno,
            // Format dates for all visit columns
            visit_1: formatDate(row.visit_1),
            visit_2: formatDate(row.visit_2),
            visit_3: formatDate(row.visit_3),
            visit_4: formatDate(row.visit_4),
            visit_5: formatDate(row.visit_5),
            visit_6: formatDate(row.visit_6),
            visit_7: formatDate(row.visit_7),
            visit_8: formatDate(row.visit_8),
            visit_9: formatDate(row.visit_9),
            visit_10: formatDate(row.visit_10),
            // Convert boolean strings to actual booleans
            bloodbank_conf: row.bloodbank_conf === 'TRUE' || row.bloodbank_conf === 'true' || row.bloodbank_conf === true,
            insurance_conf: row.insurance_conf === 'TRUE' || row.insurance_conf === 'true' || row.insurance_conf === true,
            // Convert numeric strings to numbers
            age: parseInt(row.age, 10) || null,
            amount_paid: parseFloat(row.amount_paid) || null,
            days_attended: parseInt(row.days_attended, 10) || null,
          };
        });

      if (processedData.length === 0) {
        throw new Error('No valid data found in CSV file');
      }

      // Insert the data
      const { error } = await supabase
        .from('clinic')
        .insert(processedData);

      if (error) throw error;

      setSnackbar({
        open: true,
        message: `Successfully uploaded ${processedData.length} records!`,
        severity: 'success'
      });

      fetchUserData();
      handleCsvUploadModalClose();

      return true; // Return true if everything is successful

    } catch (error) {
      console.error('Error processing CSV:', error);
      setSnackbar({
        open: true,
        message: `Error uploading CSV file: ${  error.message}`,
        severity: 'error'
      });
      return false; // Return false if there is an error
    } finally {
      setUploading(false);
    }
  };

  const handleCsvUpload = () => {
    if (!csvFile) return;
  
    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        await validateAndProcessCsv(results);
        setCsvFile(null); // Reset CSV file state
      },
      error: (error) => {
        setSnackbar({
          open: true,
          message: `Error parsing CSV file: ${error.message}`,
          severity: 'error'
        });
        setCsvFile(null); // Reset on error too
      }
    });
  };

  useEffect(() => {
    if (!isPinStillValid()) {
      setOpenPinModal(true);
    }
  }, [isPinStillValid]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleVisitChange = (event) => {
    setSelectedVisit(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const cleanedFormData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
      );

      const { data: lastRecord } = await supabase
        .from('clinic')
        .select('sno')
        .order('sno', { ascending: false })
        .limit(1);

      const newSno = lastRecord.length > 0 ? lastRecord[0].sno + 1 : 1;
      cleanedFormData.sno = newSno;

      const { error } = await supabase.from('clinic').insert([cleanedFormData]);
      
      if (error) throw error;

      setSnackbar({
        open: true,
        message: 'User added successfully!',
        severity: 'success'
      });

      handleCloseModal();
      fetchUserData();
      resetFormData();

    } catch (error) {
      console.error('Error inserting data:', error);
      setSnackbar({
        open: true,
        message: `Error adding user: ${  error.message}`,
        severity: 'error'
      });
    }
  };

  const filteredUsers = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleEditOrDelete = () => {
    setOpenPinModal(true);
    setPin('');
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Regular Patients</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<UploadFileIcon />}
            component="label"
          >
            Upload CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleCsvFileChange}
            />
          </Button>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenModal}
          >
            Add User
          </Button>
        </Stack>
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
                    setSelected(users.map((n) => n.name));
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
                  { id: 'bloodbank_conf', label: '' },
                ]}
              />
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
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
                      handleEditOrDelete={handleEditOrDelete}
                    />
                  ))}
                <TableEmptyRows
                  height={53}
                  emptyRows={emptyRows(page, rowsPerPage, filteredUsers.length)}
                />
                {filteredUsers.length === 0 && (
                  <TableNoData query={filterName} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[25, 50, 100, 250, 500]}
        />
      </Card>

      {/* Pin Modal */}
      <Modal open={openPinModal} onClose={handleClosePinModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Enter Server Pin</Typography>
            <IconButton onClick={handleClosePinModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            type="password"
            label="Pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handlePinSubmit}
          >
            Submit Pin
          </Button>
        </Box>
      </Modal>

      {/* CSV Upload Modal */}
      <Modal open={csvUploadModalOpen} onClose={handleCsvUploadModalClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Upload CSV File</Typography>
            <IconButton onClick={handleCsvUploadModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Required columns: {requiredColumns.join(', ')}
          </Typography>
          {csvFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>
              Selected file: {csvFile.name}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            onClick={handleCsvUpload}
            disabled={!csvFile}
            sx={{ mb: 2 }}
          >
            Upload and Process
          </Button>
        </Box>
      </Modal>

      {/* Add/Edit User Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 600,
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 4,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Add New User</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Stack spacing={3}>
            {/* Form fields */}
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              label="Alternate Number"
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
              label="Amount Paid"
              name="amount_paid"
              value={formData.amount_paid}
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
              type="date"
              label="Visit Date"
              name={selectedVisit}
              value={formData[selectedVisit]}
              onChange={handleInputChange}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_1')}
              >
                V-1
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_2')}
              >
                V-2
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_3')}
              >
                V-3
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_4')}
              >
                V-4
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_5')}
              >
                V-5
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_6')}
              >
                V-6
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_7')}
              >
                V-7
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_8')}
              >
                V-8
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_9')}
              >
                V-9
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedVisit('visit_10')}
              >
                V-10
              </Button>
            </Stack>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.bloodbank_conf}
                  onChange={handleInputChange}
                  name="bloodbank_conf"
                />
              }
              label="Blood Bank Confirmation"
            />
            
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.insurance_conf}
                  onChange={handleInputChange}
                  name="insurance_conf"
                />
              }
              label="Insurance Confirmation"
            />
            
            <Button
              fullWidth
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}