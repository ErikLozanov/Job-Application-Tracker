import { Outlet, Link, useNavigate } from "react-router-dom";

const MainLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col font-sans text-gray-900">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link
                                to="/dashboard"
                                className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                            >
                                JobTracker
                            </Link>

                            <div className="hidden md:flex ml-10 space-x-1">
                                <Link
                                    to="/dashboard"
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/jobs"
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                >
                                    All Jobs
                                </Link>
                                <Link
                                    to="/jobs/new"
                                    className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                                >
                                    Add Job
                                </Link>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <button
                                onClick={handleLogout}
                                className="text-gray-500 hover:text-red-600 px-3 py-2 rounded-md font-medium text-sm transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
