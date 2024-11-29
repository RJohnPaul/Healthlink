import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// eslint-disable-next-line no-unused-vars
import { createTheme } from '@mui/material/styles';
import App from './app';

// Lazy load the LoginPage2 component
// eslint-disable-next-lineUs
const LoginPage2 = lazy(() => import('./pages/login2'));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <Router>
      <Suspense>
        <Routes>
          <Route path="/login2" element={<LoginPage2 />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Suspense>
    </Router>
  </HelmetProvider>
);