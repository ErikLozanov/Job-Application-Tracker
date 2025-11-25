import React, { useState } from 'react';
import { useCreateJob } from '../../hooks/useJobs';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();
  const { mutate: createJob, isPending } = useCreateJob();

  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    status: 'APPLIED',
    priority: 'MEDIUM',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createJob(formData);
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            New Application
          </h1>
          <p className="mt-2 text-gray-500">
            Track a new opportunity. Good luck! 🚀
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="text-gray-500 bg-white border border-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                1
              </span>
              Job Details
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Enter the core details about the role. The more accurate your info, the better our AI can help you later.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 mt-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                2
              </span>
              Notes & Strategy
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Paste keywords from the job description or names of people you spoke with here.
            </p>

            <div className="hidden lg:block mt-12 relative h-32 opacity-50">
               <div className="absolute top-0 left-0 w-24 h-24 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
               <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
            </div>
          </div>

          <div className="lg:col-span-2 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                    placeholder="e.g. Netflix"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    required
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Current Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="INTERVIEW">Interview</option>
                      <option value="OFFER">Offer</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Priority Level
                  </label>
                  <div className="relative">
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="block w-full appearance-none rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Job Link
                  </label>
                  <input
                    type="url"
                    name="jobUrl"
                    value={formData.jobUrl}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                    placeholder="https://..."
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                    Date Applied
                  </label>
                  <input
                    type="date"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleChange}
                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-focus-within:text-blue-600 transition-colors">
                  Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 text-gray-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 transition-all resize-none"
                  placeholder="Paste job description keywords here..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`
                    inline-flex items-center justify-center px-8 py-3 
                    text-base font-bold text-white transition-all duration-200 
                    bg-gradient-to-r from-blue-600 to-indigo-600 
                    rounded-full shadow-lg shadow-blue-500/30 
                    hover:from-blue-700 hover:to-indigo-700 
                    hover:shadow-blue-500/50 hover:-translate-y-1
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${isPending ? 'opacity-70 cursor-not-allowed' : ''}
                  `}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Add Application'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddJob;