import { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { createTheme } from '@mui/material/styles';
import App from './app';

// Lazy load the LoginPage2 component
const LoginPage = lazy(() => import('./pages/login'));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <Router>
      <Suspense>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<App />} />
        </Routes>
      </Suspense>
    </Router>
  </HelmetProvider>
);