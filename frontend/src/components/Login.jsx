import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthState } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post('/auth/login', {
        email,
        password,
      });

      if (res.status === 200) {
        dispatch(
          setAuthState({
            isAuthenticated: res.data.authenticated,
            user: res.data.user,
          })
        );
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

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="flex flex-col mt-10 items-center">
        <div className="w-1/4">
          <h1 className="text-2xl text-blue-500 font-semibold mb-2">Login</h1>
          <form
            onSubmit={handleSubmit}
            className=" border-2 border-blue-500 rounded-md p-4"
          >
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
              id="password"
              className="mb-2 w-full pl-1 border border-gray-400 rounded h-8"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
            />
            <br />
            <button
              type="submit"
              className="bg-blue-500 mx-auto w-full hover:bg-blue-700 block text-white font-bold py-2 px-4 rounded mt-2"
            >
              Login
            </button>
            <p className="mt-4">
              Don&apos;t have an account?{' '}
              <a
                href="/signup"
                className="underline text-blue-600 ml-1 underline-offset-2 font-semibold"
              >
                Signup
              </a>
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="bg-blue-500 mx-auto mt-3 block hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Login with <span className="font-semibold">Google</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
