import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useDeleteJob, useUpdateJob } from '../../hooks/useJobs';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, isError } = useJob(id || '');
  const { mutate: removeJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: saveJob, isPending: isSaving } = useUpdateJob();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    status: 'APPLIED',
    priority: 'MEDIUM',
    jobUrl: '',
    appliedDate: '',
    notes: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company,
        jobTitle: job.jobTitle,
        status: job.status,
        priority: job.priority,
        jobUrl: job.jobUrl || '',
        appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
        notes: job.notes || '',
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    saveJob(
      { id: id!, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false); 
        },
      }
    );
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job application?')) {
      removeJob(id!);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Loading job details...</div>;
  if (isError || !job) return <div className="text-center mt-10 text-red-500">Job not found.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
      
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-200">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="block w-full text-lg font-medium text-gray-900 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Company Name"
              />
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="block w-full text-sm text-gray-500 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Job Title"
              />
            </div>
          ) : (
            <>
              <h3 className="text-lg leading-6 font-medium text-gray-900">{job.company}</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{job.jobTitle}</p>
            </>
          )}
        </div>

        <div className="flex space-x-3 ml-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-3 py-1 border border-transparent rounded text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/jobs')}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 border border-blue-600 text-blue-600 rounded text-sm hover:bg-blue-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-1 border border-transparent rounded text-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${job.status === 'APPLIED' ? 'bg-blue-100 text-blue-800' : 
                    job.status === 'OFFER' ? 'bg-green-100 text-green-800' : 
                    job.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {job.status}
                </span>
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Priority</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
              {isEditing ? (
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              ) : (
                job.priority.toLowerCase()
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Date Applied</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="date"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              ) : (
                job.appliedDate ? new Date(job.appliedDate).toLocaleDateString() : 'N/A'
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Job URL</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input
                  type="url"
                  name="jobUrl"
                  value={formData.jobUrl}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                  placeholder="https://..."
                />
              ) : (
                job.jobUrl ? (
                  <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {job.jobUrl.slice(0, 50)}{job.jobUrl.length > 50 ? '...' : ''}
                  </a>
                ) : 'N/A'
              )}
            </dd>
          </div>

          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Notes</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <textarea
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="max-w-lg shadow-sm block w-full focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
                />
              ) : (
                <span className="whitespace-pre-wrap">{job.notes || 'No notes added.'}</span>
              )}
            </dd>
          </div>

        </dl>
      </div>
    </div>
  );
};

export default JobDetails;