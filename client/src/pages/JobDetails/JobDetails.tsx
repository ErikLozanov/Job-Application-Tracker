import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJob, useDeleteJob, useUpdateJob, useGenerateCoverLetter } from '../../hooks/useJobs';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: 'bg-blue-100 text-blue-800 border-blue-200',
    INTERVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
    OFFER: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    REJECTED: 'bg-rose-100 text-rose-800 border-rose-200',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: job, isLoading, isError } = useJob(id || '');
  const { mutate: removeJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: saveJob, isPending: isSaving } = useUpdateJob();
  const { mutate: generateAI, isPending: isGenerating } = useGenerateCoverLetter();

  const [isEditing, setIsEditing] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  
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
    saveJob({ id: id!, data: formData }, { onSuccess: () => setIsEditing(false) });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job application?')) {
      removeJob(id!);
    }
  };

  const handleGenerateAI = () => {
    generateAI(id!, {
      onSuccess: (data) => setGeneratedLetter(data.coverLetter)
    });
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-blue-600 font-medium animate-pulse">Loading details...</div>;
  if (isError || !job) return <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700">Job not found.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30">
                {job.company.charAt(0).toUpperCase()}
              </div>
              
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text" name="company" value={formData.company} onChange={handleChange}
                      className="block w-full text-2xl font-bold text-gray-900 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 placeholder-gray-400"
                      placeholder="Company"
                    />
                    <input
                      type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange}
                      className="block w-full text-lg text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:ring-0 px-0 placeholder-gray-400"
                      placeholder="Job Title"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{job.company}</h1>
                    <p className="text-xl text-gray-500 font-medium">{job.jobTitle}</p>
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <StatusBadge status={job.status} />
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200`}>
                  {job.priority} Priority
                </span>
                <span className="text-sm text-gray-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Applied {new Date(job.appliedDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/jobs')} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Back
                </button>
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors border border-blue-100">
                  Edit
                </button>
                <button onClick={handleDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl bg-red-50 text-red-700 font-bold hover:bg-red-100 transition-colors border border-red-100">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          {isEditing && (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Application Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
                  <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Applied</label>
                  <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          )}

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-white/50 p-6 h-full">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Notes & Strategy</h3>
            {isEditing ? (
              <textarea
                name="notes" rows={8} value={formData.notes} onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-4 text-sm leading-relaxed shadow-inner focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Add details about the role, interview questions, or key requirements..."
              />
            ) : (
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100 min-h-[10rem]">
                {job.notes || <span className="text-gray-400 italic">No notes added yet.</span>}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          
          {!isEditing && job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" 
               className="block w-full text-center py-3 px-4 rounded-xl bg-white border border-gray-200 text-blue-600 font-bold hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm">
              Open Job Posting ↗
            </a>
          )}
          {job.resumeUrl && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Attached Resume</h3>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]" title={job.resumeName || 'Resume.pdf'}>
                      {job.resumeName || 'Resume.pdf'}
                    </p>
                  </div>
                </div>
              </div>
              
              <a 
                href={job.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center w-full py-2.5 text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors"
              >
                View Document
              </a>
            </div>
          )}
          <div className="bg-gradient-to-b from-indigo-50 to-white rounded-2xl shadow-sm border border-indigo-100 p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200 rounded-full blur-2xl opacity-50 -z-10"/>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-bold text-indigo-900">AI Assistant</h3>
            </div>
            
            <p className="text-sm text-indigo-600/80 mb-6 leading-relaxed">
              Need a cover letter? Our AI can write a tailored draft based on your notes and job details instantly.
            </p>

            {!generatedLetter ? (
              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Writing Magic...
                  </span>
                ) : 'Generate Cover Letter'}
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <textarea
                  readOnly
                  className="w-full h-64 text-xs text-gray-600 bg-white border border-indigo-100 rounded-lg p-3 resize-none focus:outline-none"
                  value={generatedLetter}
                />
                <div className="flex gap-2">
                  <button onClick={() => setGeneratedLetter('')} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Discard
                  </button>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(generatedLetter); alert('Copied!'); }} 
                    className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 border border-indigo-100"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default JobDetails;