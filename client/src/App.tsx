import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import MainLayout from './components/Layout/MainLayout'; 

const JobsList = () => <div>Jobs List Page (Coming Soon)</div>;
const AddJob = () => <div>Add Job Page (Coming Soon)</div>;
const JobDetails = () => <div>Job Details Page (Coming Soon)</div>;

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