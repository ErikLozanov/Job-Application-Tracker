import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center">
        <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          JobTracker
        </div>
        <div className="space-x-4">
          <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Log in
          </Link>
          <Link
            to="/register"
            className="hidden sm:inline-flex px-5 py-2 rounded-full text-white font-semibold bg-gray-900 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20"
          >
            Sign up
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 mt-10 sm:mt-0">
        
        <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6">
          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
          Now with AI Cover Letters
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
          Land your dream job <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            without the chaos.
          </span>
        </h1>

        <p className="max-w-2xl text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
          Stop using spreadsheets. Track every application, manage interviews, and generate custom cover letters with AI—all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="px-8 py-4 rounded-full text-white font-bold text-lg shadow-xl shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 transition-all duration-200"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 rounded-full text-gray-700 font-bold text-lg bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
          >
            View Demo
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full text-left">
          
          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Track Everything</h3>
            <p className="text-gray-500 text-sm">
              Keep all your applications organized by status, company, and priority in one dashboard.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50">
             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-4">
              ✨
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI Assistant</h3>
            <p className="text-gray-500 text-sm">
              Generate tailored cover letters instantly using Google Gemini AI based on your notes.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-lg p-6 rounded-2xl border border-white/50 shadow-xl shadow-gray-200/50">
             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mb-4">
              🚀
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Never Miss Out</h3>
            <p className="text-gray-500 text-sm">
              See your interview schedule and follow-up reminders at a glance so you stay ahead.
            </p>
          </div>

        </div>

      </main>
      
      <footer className="py-6 text-center text-sm text-gray-400 relative z-10">
        © 2025 JobTracker. Built with React & Node.
      </footer>
    </div>
  );
};

export default Home;