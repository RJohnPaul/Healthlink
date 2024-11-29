import { useState, useEffect } from 'react';

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

import { supabase } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../../user/table-no-data';
import UserTableRow from '../../user/user-table-row';
import UserTableHead from '../../user/user-table-head';
import TableEmptyRows from '../../user/table-empty-rows';
import UserTableToolbar from '../../user/user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../../user/utils';

export default function ProductsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    sno: '',
    date: '',
    name: '',
    age: '',
    occupation: '',
    diagnosis: '',
    treatment_plan: '',
    staff_attended: 'Y',
    medical_history: '',
    rehab_commencement_date: '',
    rehab_last_date: '',
    amount_paid: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.from('clinic').select('*').eq('staff_attended', 'Y');
        if (error) {
          console.error('Error fetching user data:', error.message);
        } else {
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
    filterBy: 'name',
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // UserPage component

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.from('clinic').select('*');
      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from('clinic').insert([formData]);
      if (error) {
        throw error;
      }
      console.log('Data inserted successfully:', data);

      handleCloseModal();
      const response = await supabase.from('clinic').select('*');
      if (response.error) {
        console.error('Error fetching user data:', response.error.message);
      } else {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
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
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={dataFiltered.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'sno', label: 'Serial No' },
                  { id: 'date', label: 'Date' },
                  { id: 'name', label: 'Name' },
                  { id: 'age', label: 'Age' },
                  { id: 'occupation', label: 'Occupation' },
                  { id: 'diagnosis', label: 'Diagnosis' },
                  { id: 'treatment_plan', label: 'Treatment Plan' },
                  { id: 'staff_attended', label: 'Physio Attended' },
                  { id: 'medical_history', label: 'Medical History' },
                  { id: 'amount_paid', label: 'Amount Paid' },
                  { id: 'days_attended', label: 'Days Attended' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      name={row.name}
                      sno={row.sno}
                      date={row.date}
                      age={row.age}
                      occupation={row.occupation}
                      diagnosis={row.diagnosis}
                      treatment_plan={row.treatment_plan}
                      staff_attended={row.staff_attended}
                      medical_history={row.medical_history}
                      rehab_commencement_date={row.rehab_commencement_date}
                      rehab_last_date={row.rehab_last_date}
                      amount_paid={row.amount_paid}
                      days_attended={row.days_attended}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      fetchUserData={fetchUserData}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, dataFiltered.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 600,
            bgcolor: 'rgba(255, 255, 255, 0.8)', // Set the background color with opacity for glassmorphism effect
            borderRadius: '8px', // Add border radius for rounded corners
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Add a subtle shadow for depth
            padding: '24px', // Adjust the padding for spacing
            margin: 'auto', // Center the modal horizontally
            maxHeight: '80vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
              backgroundColor: '#f5f5f5',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#888',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: '#555',
            },
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
              label="Serial No"
              name="sno"
              value={formData.sno}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
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
