import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './components/Layout/MainLayout'; 
import AddJob from './pages/AddJob/Addjob'; 
import JobsList from './pages/JobsList/JobsList'; 
import JobDetails from './pages/JobDetails/JobDetails';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/jobs" element={<JobsList />} />
        <Route path="/jobs/new" element={<AddJob />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Route>
    </Routes>
  );
}

export default App;