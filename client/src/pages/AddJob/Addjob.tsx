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

  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('company', formData.company);
    data.append('jobTitle', formData.jobTitle);
    data.append('status', formData.status);
    data.append('priority', formData.priority);
    data.append('jobUrl', formData.jobUrl);
    data.append('appliedDate', formData.appliedDate);
    data.append('notes', formData.notes);

    if (resumeFile) {
      data.append('resume', resumeFile);
    }

    createJob(data as any); 
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
           <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            New Application
          </h1>
          <p className="mt-2 text-gray-500">
            Track a new opportunity. Good luck! 🚀
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button onClick={() => navigate(-1)} type="button" className="text-gray-500 bg-white border border-gray-300 font-medium rounded-full text-sm px-5 py-2.5 hover:bg-gray-50 transition-all">
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          
          <div className="bg-gradient-to-br from-gray-50 to-white p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">1</span>
              Job Details
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Enter the core details about the role.
            </p>

            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 mt-8">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">2</span>
              Attachments
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Upload the specific resume you used for this application so you never forget which version they have.
            </p>
          </div>

          <div className="lg:col-span-2 p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <input type="text" name="company" required value={formData.company} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all" placeholder="e.g. Netflix" />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                  <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all" placeholder="e.g. Senior Frontend Engineer" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all">
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority Level</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Link</label>
                  <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all" placeholder="https://..." />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date Applied</label>
                  <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all" />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Resume (PDF)</label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    {resumeFile ? 'Change File' : 'Upload Resume'}
                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                  </label>
                  <span className="text-sm text-gray-500 italic">
                    {resumeFile ? resumeFile.name : 'No file chosen'}
                  </span>
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                <textarea name="notes" rows={4} value={formData.notes} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-3 focus:bg-white focus:ring-blue-500 transition-all resize-none" placeholder="Paste keywords..." />
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button type="submit" disabled={isPending} className={`inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/30 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isPending ? 'Saving...' : 'Add Application'}
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