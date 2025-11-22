import { Outlet, Link, useNavigate } from 'react-router-dom';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear token
    localStorage.removeItem('token');
    // 2. Redirect to Login
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* --- Navigation Bar --- */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-blue-600">JobTracker</span>
              <div className="hidden md:flex ml-10 space-x-8">
                <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Dashboard
                </Link>
                <Link to="/jobs" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  All Jobs
                </Link>
                <Link to="/jobs/new" className="text-gray-500 hover:text-blue-600 px-3 py-2 rounded-md font-medium">
                  Add Job
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md font-medium text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Page Content --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;