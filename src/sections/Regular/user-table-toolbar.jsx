import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Toolbar, Typography, IconButton, OutlinedInput, InputAdornment } from '@mui/material';
import Iconify from 'src/components/iconify';

export default function UserTableToolbar({ numSelected, filterName, onFilterName }) {
  const [searchTerm, setSearchTerm] = useState(filterName);

  const debouncedSearch = useMemo(() => (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const debouncedOnFilterName = useCallback(
    (value) => {
      debouncedSearch(() => {
        onFilterName(value);
      }, 300)();
    },
    [debouncedSearch, onFilterName]
  );

  useEffect(() => {
    debouncedOnFilterName(searchTerm);
  }, [searchTerm, debouncedOnFilterName]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <OutlinedInput
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Search phone number..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UserTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};