import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute2 = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('isAuthenticated');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login2', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? children : null;
};

ProtectedRoute2.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute2;