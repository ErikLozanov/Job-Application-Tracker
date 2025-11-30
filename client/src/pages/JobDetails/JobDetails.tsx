import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  useJob, 
  useDeleteJob, 
  useUpdateJob, 
} from '../../hooks/useJobs';
import JobHeader from './components/JobHeader';
import JobEditForm from './components/JobEditForm';
import JobSidebar from './components/JobSideBar';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data: job, isLoading, isError } = useJob(id || '');
  const { mutate: removeJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: saveJob, isPending: isSaving } = useUpdateJob();

  const [isEditing, setIsEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    jobTitle: '',
    status: 'APPLIED',
    priority: 'MEDIUM',
    jobUrl: '',
    appliedDate: '',
    interviewDate: '',
    notes: '',
    jobDescription: '',
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
        interviewDate: job.interviewDate ? new Date(job.interviewDate).toISOString().split('T')[0] : '',
        notes: job.notes || '',
        jobDescription: job.jobDescription || '',
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (resumeFile) data.append('resume', resumeFile);

    saveJob({ id: id!, data }, { 
      onSuccess: () => {
        setIsEditing(false);
        setResumeFile(null);
      } 
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this job application?')) {
      removeJob(id!);
    }
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-blue-600 font-medium animate-pulse">Loading details...</div>;
  if (isError || !job) return <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl text-red-700">Job not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      {/* 1. Header Component */}
      <JobHeader 
        job={job} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        formData={formData} 
        handleChange={handleChange as any} 
        handleSave={handleSave} 
        handleDelete={handleDelete} 
        isSaving={isSaving}
        isDeleting={isDeleting}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Left Column (Details / Notes / Description)  */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Edit Form */}
          {isEditing && (
            <JobEditForm 
              formData={formData} 
              handleChange={handleChange as any} 
              handleFileChange={handleFileChange}
              resumeFile={resumeFile}
              job={job}
            />
          )}

          {/* View Mode: Job Description */}
          {!isEditing && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-slate-700/50 p-8 flex flex-col transition-colors duration-300">
              <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">📄</span> Job Description
              </h3>
              
              {job.jobDescription ? (
                <div className="prose prose-sm max-w-none text-gray-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 max-h-[12rem] overflow-y-auto">
                  {job.jobDescription}
                </div>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-2xl p-6 text-center">
                  <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                    No Job Description Added
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
                    Paste the job description to enable the AI Resume Matcher.
                  </p>
                  <button 
                    onClick={() => setIsEditing(true)} 
                    className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700 px-4 py-2 rounded-lg hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Add Description
                  </button>
                </div>
              )}
            </div>
          )}

          {/* View Mode: Notes */}
          {!isEditing && (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-slate-700/50 p-8 flex-1 flex flex-col transition-colors duration-300">
              <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="text-lg">📝</span> Notes & Strategy
              </h3>
              <div className="prose prose-sm max-w-none text-gray-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed bg-gray-50/50 dark:bg-slate-900/50 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 flex-1">
                {job.notes || <span className="text-gray-400 italic">No notes added yet. Use edit button to add details.</span>}
              </div>
            </div>
          )}
        </div>

        {/* 3. Right Column (Sidebar Tools) */}
        <div className="space-y-6">
          <JobSidebar job={job} isEditing={isEditing} setIsEditing={setIsEditing} />
        </div>

      </div>
    </div>
  );
};

export default JobDetails;