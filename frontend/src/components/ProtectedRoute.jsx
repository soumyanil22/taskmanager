/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthState } from '../features/auth/authSlice';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Make a request to the backend to check if the session is active
        const response = await axiosInstance.get('/auth/check-session'); // Assuming /auth/check-session checks the session status
        if (response.status === 200) {
          dispatch(
            setAuthState({ isAuthenticated: true, user: response.data.user })
          );
        } else {
          dispatch(setAuthState({ isAuthenticated: false, user: null }));
        }
      } catch (error) {
        console.error(error);
        dispatch(setAuthState({ isAuthenticated: false, user: null }));
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
