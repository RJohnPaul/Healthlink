import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
// eslint-disable-next-line no-unused-vars
import { useTheme } from '@mui/material/styles';
import { RouterLink } from 'src/routes/components';
import clinicLogo from './cliniclogo.png';

const Logo = forwardRef(({ disabledLink = false, sx }) => {

  const logo = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center', // Center the logo vertically
        justifyContent: 'center', // Center the logo horizontally
        width: 150,
        height: 150,
        cursor: 'pointer',
        ...sx,
      }}
    >
      <img
        src={clinicLogo}
        alt="Clinic Logo"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
        }}
      />
    </Box>
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.displayName = 'Logo';

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
};

export default Logo;
