import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';

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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { supabase } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const months = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun',
  'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

export default function UserPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    sno: '',
    name: '',
    mobile_number: '',
    date_joined: null,
    selectedMonth: '',
    daysPresent: '',
  });

  const [users, setUsers] = useState([]);
  const currentMonth = dayjs().format('MMM').toLowerCase();

  useEffect(() => {
    fetchUserData();

    return () => {
      localStorage.removeItem('isAuthenticated');
    };
  }, []);

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        console.error('Error fetching user data:', error.message);
      } else {
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

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
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (value) => {
    setFormData({ ...formData, date_joined: value });
  };

  const handleSubmit = async () => {
    const updatedFormData = {
      sno: formData.sno || null,
      name: formData.name || null,
      mobile_number: formData.mobile_number || null,
      date_joined: formData.date_joined ? formData.date_joined.toISOString().split('T')[0] : null,
      [formData.selectedMonth]: formData.daysPresent || null,
    };

    try {
      const { data, error } = await supabase.from('staff').insert([updatedFormData]);
      if (error) {
        throw error;
      }
      console.log('Data inserted successfully:', data);

      handleCloseModal();
      fetchUserData();
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Staff Record</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleOpenModal}
          >
            Add Staff
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Iconify icon="eva:log-out-fill" />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
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
                  { id: 'name', label: 'Name' },
                  { id: 'mobile_number', label: 'Mobile Number' },
                  { id: 'date_joined', label: 'Date Of Joining' },
                  { id: 'current_month', label: 'Current Month' },
                  { id: 'days_present', label: 'Days Absent (Current Month)' },
                  { id: '', label: '' },
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
                      mobile_number={row.mobile_number}
                      date_joined={row.date_joined}
                      current_month={currentMonth}
                      days_present={row[currentMonth]}
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
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '8px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
            padding: '24px',
            margin: 'auto',
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
            <Typography variant="h6">Add New Staff</Typography>
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />

            <TextField
              fullWidth
              label="Mobile Number"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleInputChange}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Of Joining"
                value={formData.date_joined}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
                format="YYYY-MM-DD"
              />
            </LocalizationProvider>

            <Select
              fullWidth
              label="Select Month"
              name="selectedMonth"
              value={formData.selectedMonth}
              onChange={handleInputChange}
            >
              {months.map((month) => (
                <MenuItem key={month} value={month}>
                  {month.toUpperCase()}
                </MenuItem>
              ))}
            </Select>

            <TextField
              fullWidth
              label="Days Absent"
              name="daysPresent"
              type="number"
              value={formData.daysPresent}
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