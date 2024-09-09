import { useState } from 'react';
import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthState } from '../features/auth/authSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log(password, confirmPassword);
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/register', {
        email,
        password,
        firstname,
        lastname,
      });

      if (res.status === 200) {
        dispatch(setAuthState({ isAuthenticated: true, user: res.data.user }));
      }

      console.log(res.data);
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed: ' + error, {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // Reset form
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = async () => {
    try {
      const googleLoginURL = 'https://tasky.adaptable.app/auth/login/google';
      const width = 500;
      const height = 600;
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;

      // Open a popup window for Google authentication
      const popup = window.open(
        googleLoginURL,
        '_blank',
        `width=${width},height=${height},top=${top},left=${left}`
      );

      // Poll the popup window to detect when it closes
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed);
          // Handle post-login logic here after popup closes
          navigate('/dashboard'); // Optionally reload the parent window to fetch the updated auth state
        }
      }, 1000);
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed: ' + error, {
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex flex-col mt-10 items-center">
        <div className="w-1/4">
          <h1 className="text-2xl text-blue-500 font-semibold mb-2">Signup</h1>
          <form
            onSubmit={handleSubmit}
            className=" border-2 border-blue-500 rounded-md p-4"
          >
            <input
              placeholder="First Name"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              type="text"
              onChange={(e) => setFirstname(e.target.value)}
              value={firstname}
            />
            <br />
            <input
              placeholder="Last Name"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              type="text"
              onChange={(e) => setLastname(e.target.value)}
              value={lastname}
            />
            <br />
            <input
              placeholder="Email"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
            />
            <br />
            <input
              placeholder="Password"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
            <br />
            <input
              placeholder="Confirm Password"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              type="password"
            />
            <br />
            {errorMessage && (
              <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="bg-blue-500 mx-auto w-full hover:bg-blue-700 block text-white font-bold py-2 px-4 rounded mt-2"
            >
              Signup
            </button>
            <p className="mt-4">
              Already have an account?{' '}
              <a
                href="/login"
                className="underline text-blue-600 ml-1 underline-offset-2 font-semibold"
              >
                Login
              </a>
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-blue-500 mx-auto mt-3 block hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Signup with <span className="font-semibold">Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
