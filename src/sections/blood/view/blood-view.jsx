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
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function BloodView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
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
    rehab_commencement_date: '',
    rehab_last_date: '',
    amount_paid: '',
    days_attended: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const fetchAllData = async (table, allData = [], lastSno = 0) => {
        const pageSize = 1000; // Adjust this value based on your needs
      
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .order('sno', { ascending: true })
          .gt('sno', lastSno)
          .limit(pageSize);
      
        if (error) {
          throw error;
        }
      
        if (data.length === 0) {
          return allData;
        }
      
        const updatedData = [...allData, ...data];
        const newLastSno = data[data.length - 1].sno;
      
        if (data.length < pageSize) {
          return updatedData;
        }
      
        return fetchAllData(table, updatedData, newLastSno);
      };
  
      const [rehabData, clinicData] = await Promise.all([
        fetchAllData('rehab'),
        fetchAllData('clinic')
      ]);
  
      const combinedData = [
        ...rehabData.map(item => ({ ...item, source: 'rehab' })),
        ...clinicData.map(item => ({ ...item, source: 'clinic' }))
      ];
  
      setUsers(combinedData);
      console.log(`Total records fetched: ${combinedData.length}`);
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
    filterBy: 'phone_number',
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
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
      fetchUserData();
    } catch (error) {
      console.error('Error inserting data:', error.message);
    }
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Blood Bank</Typography>
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
                  { id: 'rehab_commencement_date', label: 'Commencement Date' },
                  { id: 'rehab_last_date', label: 'Last Date' },
                  { id: 'amount_paid', label: 'Amount Paid' },
                  { id: 'days_attended', label: 'Days Attended' },
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
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                      fetchUserData={fetchUserData}
                      tableType={row.source} // Pass the table type to UserTableRow
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
            <Typography variant="h6">Add New User</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            className="modal-content"
            sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {Object.keys(formData).map((key) => (
              <TextField
                key={key}
                fullWidth
                label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                type={key.includes('date') ? 'date' : 'text'}
                InputLabelProps={key.includes('date') ? { shrink: true } : undefined}
              />
            ))}
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