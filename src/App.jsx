/**
 * App Component
 * 
 * This sets up all the paths for the app using React Router. The app has a login path, a 
 * signup path, and a dashboard path which is protected by ProtectedRoute, meaning it can
 * only be accessed when there is a current user. It also redirects the base URL '/' to 
 * the login page.
 */

import './App.css'
import { auth } from './firebase/config';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './ProtectedRoute';


function App() {
  console.log(auth); 

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App
