import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './components/Signup.jsx';
import RedirectToLogin from './components/RedirectToLogin.jsx';
import Login from './components/Login.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Slide, ToastContainer } from 'react-toastify';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RedirectToLogin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Slide}
    />
    <RouterProvider router={router} />
  </Provider>
);
