import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setAuthState } from '../features/auth/authSlice';
import axiosInstance from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Make a request to the backend to destroy the session
      await axiosInstance.post('/auth/logout');

      // Update the local auth state in Redux
      dispatch(
        setAuthState({
          isAuthenticated: false,
          user: null,
        })
      );

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="flex justify-between px-2 bg-blue-500 h-10 py-8">
      <div></div>
      <div className="flex gap-4 items-center">
        {!authenticated && (
          <>
            <div
              className={`${
                location.pathname === '/login'
                  ? 'text-blue-500 bg-white'
                  : 'text-white'
              } w-20 h-10 rounded flex justify-center items-center cursor-pointer`}
              onClick={() => navigate('/login')}
            >
              Login
            </div>
            <div
              className={`${
                location.pathname === '/signup'
                  ? 'text-blue-500 bg-white'
                  : 'text-white'
              } w-16 h-9 rounded flex justify-center items-center cursor-pointer`}
              onClick={() => navigate('/signup')}
            >
              Signup
            </div>
          </>
        )}

        {authenticated && (
          <div
            className="text-white bg-red-500 w-16 h-9 rounded flex justify-center items-center cursor-pointer"
            onClick={handleLogout}
          >
            logout
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
