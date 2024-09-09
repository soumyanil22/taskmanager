import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return null;
};

export default RedirectToLogin;
