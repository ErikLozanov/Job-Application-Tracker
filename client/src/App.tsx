import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home'; 
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AddJob from './pages/AddJob/Addjob';
import JobsList from './pages/JobsList/JobsList';
import JobDetails from './pages/JobDetails/JobDetails';
import MainLayout from './components/Layout/MainLayout';
import ForgotPassword from './pages/Login/ForgotPassword';
import ResetPassword from './pages/Login/ResetPassword';
import Settings from './pages/Settings/Settings';
import Stats from './pages/Stats/Stats';

function App() {
  return (
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      <Route path="/" element={<Home />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* --- PROTECTED ROUTES --- */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/new" element={<AddJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/stats" element={<Stats />} />
      </Route>
    </Routes>
  );
}

export default App;