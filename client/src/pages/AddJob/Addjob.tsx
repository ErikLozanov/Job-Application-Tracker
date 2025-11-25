import React, { useState } from 'react';
import { useCreateJob } from '../../hooks/useJobs';
import { useNavigate } from 'react-router-dom';

const AddJob = () => {
  const navigate = useNavigate();
  const { mutate: createJob, isPending } = useCreateJob();

  // Initial State
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    status: 'APPLIED',
    priority: 'MEDIUM',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0], // Default to today: YYYY-MM-DD
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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Job</h2>
        <button
          onClick={() => navigate(-1)}
          type="button"
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Row 1: Company & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Google, Startup Inc..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
              placeholder="Frontend Developer"
            />
          </div>
        </div>

        {/* Row 2: Status & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Row 3: URL & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="https://linkedin.com/jobs/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
            <input
              type="date"
              name="appliedDate"
              value={formData.appliedDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            rows={4}
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Referral from Mike, tech stack is React..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`px-6 py-2 text-white font-medium rounded shadow transition-colors
              ${isPending 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isPending ? 'Saving...' : 'Add Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddJob;