import React from 'react';

interface JobEditFormProps {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  resumeFile: File | null;
  job: any;
}

const JobEditForm = ({ formData, handleChange, handleFileChange, resumeFile, job }: JobEditFormProps) => {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 dark:border-slate-700/50 p-8 space-y-6 animate-fade-in-down">
      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 pb-2">Update Details</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200">
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Job Link</label>
          <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200" placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date Applied</label>
          <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200" />
        </div>
        {formData.status === 'INTERVIEW' && (
          <div className="animate-fade-in">
            <label className="block text-sm font-bold text-amber-600 dark:text-amber-400 mb-2">Interview Date</label>
            <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="block w-full rounded-xl border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm focus:ring-2 focus:ring-amber-500 text-gray-700 dark:text-gray-200" />
          </div>
        )}
      </div>
      
      {/* Resume Upload */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Update Resume</label>
        <label className="cursor-pointer flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            {resumeFile ? resumeFile.name : (job.resumeName ? `Replace: ${job.resumeName}` : 'Click to upload new resume')}
          </span>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      {/* JOB DESCRIPTION */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Job Description (For AI Analysis)
        </label>
        <textarea 
          name="jobDescription" 
          rows={6} 
          value={formData.jobDescription} 
          onChange={handleChange} 
          className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 resize-none" 
          placeholder="Paste the full job description here..." 
        />
      </div>

      {/* PERSONAL NOTES */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Personal Notes & Strategy
        </label>
        <textarea 
          name="notes" 
          rows={4} 
          value={formData.notes} 
          onChange={handleChange} 
          className="block w-full rounded-xl border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 p-3 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 resize-none" 
          placeholder="Referral name, tech stack details, interview vibes..." 
        />
      </div>

    </div>
  );
};

export default JobEditForm;