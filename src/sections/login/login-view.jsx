import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { alpha, useTheme, styled } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';

import { useRouter } from 'src/routes/hooks';
import { supabase } from 'src/_mock/user';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
  backdropFilter: 'blur(20px)',
  borderRadius: '16px',
  overflowY: 'auto',
  maxHeight: '90vh',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
    borderRadius: '8px',
    '& fieldset': {
      borderColor: theme.palette.grey[500],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const AutofillAnimation = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main}, ${theme.palette.error.main}, ${theme.palette.warning.main})`,
  backgroundSize: '400% 400%',
  animation: 'gradient 3s ease infinite',
  zIndex: -1,
  '@keyframes gradient': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' },
  },
}));

export default function LoginView() {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isStaff, setIsStaff] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [uniquePin, setUniquePin] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [autofillAnimation, setAutofillAnimation] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabase.from('creds').select('*');
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

  const [
    VITE_NEXT_USERNAME,
    VITE_NEXT_PASSWORD,
    VITE_NEXT_STAFF_USERNAME,
    VITE_NEXT_STAFF_PASSWORD,
    VITE_NEXT_PIN,
  ] =
    users.length > 0
      ? [
          users[0].login_user,
          users[0].login_pass,
          users[0].staff_user,
          users[0].staff_pass,
          users[0].pin.toString(),
        ]
      : ['', '', '', '', ''];

  const handleClick = () => {
    if (isStaff) {
      if (email === VITE_NEXT_STAFF_USERNAME && password === VITE_NEXT_STAFF_PASSWORD) {
        localStorage.setItem('isAuthenticated', true);
        router.push('/dashboard');
      } else {
        alert('Invalid username or password');
      }
    } else if (email === VITE_NEXT_USERNAME && password === VITE_NEXT_PASSWORD) {
      localStorage.setItem('isAuthenticated', true);
      router.push('/main');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  };

  const handleChangePassword = async () => {
    if (uniquePin === VITE_NEXT_PIN) {
      if (isStaff) {
        if (oldPassword === VITE_NEXT_STAFF_PASSWORD) {
          if (newPassword === retypeNewPassword) {
            try {
              const { error } = await supabase
                .from('creds')
                .update({ staff_pass: newPassword })
                .match({ sno: users[0].sno });

              if (error) {
                console.error('Error updating staff password:', error.message);
              } else {
                alert('Staff password changed successfully');
                setOpenDialog(false);
              }
            } catch (error) {
              console.error('Error updating staff password:', error.message);
            }
          } else {
            alert('New passwords do not match');
          }
        } else {
          alert('Incorrect old password');
        }
      } else if (oldPassword === VITE_NEXT_PASSWORD) {
        if (newPassword === retypeNewPassword) {
          try {
            const { error } = await supabase
              .from('creds')
              .update({ login_pass: newPassword })
              .match({ sno: users[0].sno });

            if (error) {
              console.error('Error updating login password:', error.message);
            } else {
              alert('Login password changed successfully');
              setOpenDialog(false);
            }
          } catch (error) {
            console.error('Error updating login password:', error.message);
          }
        } else {
          alert('New passwords do not match');
        }
      } else {
        alert('Incorrect old password');
      }
    } else {
      alert('Incorrect unique pin');
    }
  };

  const handleAutoFill = (type) => {
    setOpenSnackbar(false);
    if (type === 'regular') {
      setEmail(VITE_NEXT_USERNAME);
      setPassword(VITE_NEXT_PASSWORD);
      setIsStaff(false);
    } else if (type === 'staff') {
      setEmail(VITE_NEXT_STAFF_USERNAME);
      setPassword(VITE_NEXT_STAFF_PASSWORD);
      setIsStaff(true);
    }
    setOpenSnackbar(true);
    setAutofillAnimation(true);
    setTimeout(() => setAutofillAnimation(false), 3000);
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <StyledTextField
          name="email"
          label="Username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <StyledTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Box mt={3}>
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          color="inherit"
          onClick={handleClick}
        >
          {isStaff ? 'Login as Staff' : 'Login'}
        </LoadingButton>
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" fullWidth onClick={() => handleAutoFill('regular')}>
          Regular
        </Button>
        <Button variant="contained" color="primary" fullWidth onClick={() => handleAutoFill('staff')}>
          Staff
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => window.open('https://github.com/RJohnPaul/Healthlink', '_blank')}
        >
          Github
        </Button>
      </Stack>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Change Password
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 1),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
        position: 'relative',
      }}
    >
      {autofillAnimation && <AutofillAnimation />}
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <StyledCard
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">{isStaff ? 'Sign In For Staff Record' : 'Sign In Healthlink Pro'}</Typography>
          <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Login&nbsp;Using&nbsp;Proper&nbsp;Credentials
          </Typography>
          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Health&nbsp;Link&nbsp;Pro
            </Typography>
          </Divider>
          {renderForm}
        </StyledCard>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Credentials autofilled"
        TransitionComponent={Grow}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} scroll="paper">
        <DialogTitle>
          Change Password
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (dialogTheme) => dialogTheme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            <TextField
              name="uniquePin"
              label="Unique Pin"
              value={uniquePin}
              onChange={(e) => setUniquePin(e.target.value)}
            />
            <TextField
              name="oldPassword"
              label="Old Password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <TextField
              name="newPassword"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <TextField
              name="retypeNewPassword"
              label="Retype New Password"
              type="password"
              value={retypeNewPassword}
              onChange={(e) => setRetypeNewPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            {isStaff ? 'Change Staff Password' : 'Change Login Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}