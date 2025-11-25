import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          JobTracker
        </h1>
        <h2 className="text-3xl font-bold text-gray-900">
          Land Your Dream Job
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          Organize your applications, track interviews, and never miss a follow-up again.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
          <Link
            to="/register"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Get Started
          </Link>
          
          <Link
            to="/login"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50"
          >
            I already have an account
          </Link>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-400">
          Built with React, Node, Prisma & Postgres
        </p>
      </div>
    </div>
  );
};

export default Home;