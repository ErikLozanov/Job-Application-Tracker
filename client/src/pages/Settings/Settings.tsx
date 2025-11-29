import React, { useState } from 'react';
import { useUpdateProfile, useDeleteAccount, useUser } from '../../hooks/useAuth'; // Import useUser

const Settings = () => {
  const [password, setPassword] = useState('');
  
  // 1. Fetch User Data
  const { data: user, isLoading } = useUser();
  
  const { mutate: update, isPending: isUpdating } = useUpdateProfile();
  const { mutate: removeAccount, isPending: isDeleting } = useDeleteAccount();

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    update({ password });
    setPassword('');
  };

  const handleDelete = () => {
    const confirmText = prompt("Type 'DELETE' to confirm account deletion. This cannot be undone.");
    if (confirmText === 'DELETE') {
      removeAccount();
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Settings</h1>
        <p className="mt-2 text-gray-500">Manage your account security.</p>
      </div>

      {/* --- Security Card --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Account Details</h3>
        </div>
        
        <div className="p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
            
            {/* 2. Read-Only Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={user?.email || ''} // Display the email
                disabled // Make it unchangeable
                className="block w-full rounded-lg border-gray-200 bg-gray-100 text-gray-500 p-2.5 shadow-sm cursor-not-allowed select-none"
              />
              <p className="mt-1 text-xs text-gray-400">Email address cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password"
                className="block w-full rounded-lg border-gray-300 bg-white p-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={isUpdating || !password}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100/50">
          <h3 className="text-lg font-bold text-red-900">Account Deletion</h3>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-red-800">Delete Account</h4>
            <p className="text-sm text-red-600/80 mt-1">
              Once you delete your account, there is no going back. All your jobs and data will be permanently removed.
            </p>
          </div>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-full hover:bg-red-50 hover:border-red-300 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default Settings;