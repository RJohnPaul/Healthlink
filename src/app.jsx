
import 'src/global.css';
import  Toaster  from 'react-hot-toast';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// eslint-disable-next-line no-unused-vars
import { createTheme } from '@mui/material/styles';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <Router />
      <Toaster />
    </ThemeProvider>
  );
}
