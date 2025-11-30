import React, { useState } from 'react';
import { useGenerateCoverLetter, useGenerateInterviewQuestions, useAnalyzeResume } from '../../../hooks/useJobs';

const createCalendarUrl = (job: any) => {
  if (!job.interviewDate) return '';
  const date = new Date(job.interviewDate);
  const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = date.toISOString().replace(/-|:|\.\d\d\d/g, ""); 
  const title = encodeURIComponent(`Interview: ${job.jobTitle} at ${job.company}`);
  const details = encodeURIComponent(`Notes: ${job.notes || 'No notes'}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
};

interface JobSidebarProps {
  job: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}

const JobSidebar = ({ job, isEditing, setIsEditing }: JobSidebarProps) => {
  const { mutate: generateAI, isPending: isGenerating } = useGenerateCoverLetter();
  const { mutate: generateInterview, isPending: isPrepLoading } = useGenerateInterviewQuestions();
  const { mutate: analyzeResume, isPending: isAnalyzing } = useAnalyzeResume();
  
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [interviewPrep, setInterviewPrep] = useState('');
  const [resumeAnalysis, setResumeAnalysis] = useState('');

  if (isEditing) return null; 

  return (
    <div className="space-y-6 lg:sticky lg:top-24 h-fit">
      
      {/* 1. External Link */}
      {job.jobUrl && (
        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold hover:border-blue-300 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition-all group">
          Open Job Posting <span className="ml-2 group-hover:translate-x-1 transition-transform">↗</span>
        </a>
      )}

      {/* 2. Attachments Card */}
      {job.resumeUrl ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 relative overflow-hidden group hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Attached Resume</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={job.resumeName}>{job.resumeName || 'Resume.pdf'}</p>
            </div>
          </div>
          <a href={job.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center w-full py-2 text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-lg transition-colors">View Document</a>
        </div>
      ) : (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-sm border border-amber-100 dark:border-amber-800 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white dark:bg-amber-900/40 rounded-lg shadow-sm text-amber-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">Resume Missing</h3>
          </div>
          <button onClick={() => setIsEditing(true)} className="w-full py-2 text-xs font-bold text-amber-700 dark:text-amber-300 bg-white dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/50 transition-colors">Upload Now</button>
        </div>
      )}

      {/* 3. Google Calendar */}
      {job.status === 'INTERVIEW' && job.interviewDate && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30 p-5 text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Upcoming Interview</h3>
            <span className="text-2xl">📅</span>
          </div>
          <p className="font-medium text-white/90 mb-4 text-sm">
            {new Date(job.interviewDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <a href={createCalendarUrl(job)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-2.5 text-sm font-bold text-amber-600 bg-white rounded-xl hover:bg-amber-50 transition-colors shadow-sm">
            Add to Google Calendar
          </a>
        </div>
      )}

      {/* --- AI 1: Resume Match --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900/50 p-6 relative overflow-hidden group transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 dark:bg-purple-900/20 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">🚀</span>
          <h3 className="text-lg font-bold text-purple-900 dark:text-purple-200">Resume Match</h3>
        </div>

        {!resumeAnalysis ? (
          <>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
              Analyze how well your resume matches this job description.
            </p>
            <button onClick={() => analyzeResume(job.id, { onSuccess: (d) => setResumeAnalysis(d.analysis) })} disabled={isAnalyzing} className="w-full py-3 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-500/30 hover:bg-purple-700 transition-all disabled:opacity-50">
              {isAnalyzing ? <span className="animate-pulse">Analyzing...</span> : 'Analyze Match'}
            </button>
          </>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="w-full h-80 overflow-y-auto text-xs text-gray-700 dark:text-slate-300 bg-purple-50/50 dark:bg-slate-900/50 border border-purple-100 dark:border-purple-900/30 rounded-lg p-4 leading-relaxed font-mono">
              <pre className="whitespace-pre-wrap font-sans">{resumeAnalysis}</pre>
            </div>
            <button onClick={() => setResumeAnalysis('')} className="w-full py-2 text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-700 bg-gray-100 dark:bg-slate-700 rounded-lg">Close Analysis</button>
          </div>
        )}
      </div>

      {/* --- AI 2: Cover Letter --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-indigo-100 dark:border-indigo-900/50 p-6 relative overflow-hidden group transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">✨</span>
          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200">Cover Letter</h3>
        </div>
        
        {!generatedLetter ? (
          <>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
              Generate a tailored cover letter using Gemini AI based on your resume and notes.
            </p>
            <button onClick={() => generateAI(job.id, { onSuccess: (d) => setGeneratedLetter(d.coverLetter) })} disabled={isGenerating} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all disabled:opacity-50">
              {isGenerating ? <span className="animate-pulse">Writing Magic...</span> : 'Generate Draft'}
            </button>
          </>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <textarea readOnly className="w-full h-64 text-xs text-gray-600 dark:text-slate-300 bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/30 rounded-lg p-3 resize-none focus:outline-none font-mono leading-relaxed" value={generatedLetter} />
            <div className="flex gap-2">
              <button onClick={() => setGeneratedLetter('')} className="flex-1 py-2 text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-700 bg-gray-100 dark:bg-slate-700 rounded-lg">Discard</button>
              <button onClick={() => { navigator.clipboard.writeText(generatedLetter); alert('Copied!'); }} className="flex-1 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-100">Copy</button>
            </div>
          </div>
        )}
      </div>

      {/* --- AI 3: Interview Coach --- */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/50 p-6 relative overflow-hidden group transition-colors duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-2xl -z-10" />
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">🎤</span>
          <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">Interview Coach</h3>
        </div>

        {!interviewPrep ? (
          <>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6 leading-relaxed">
              Get custom interview questions and tips based on this role and your experience.
            </p>
            <button onClick={() => generateInterview(job.id, { onSuccess: (d) => setInterviewPrep(d.interviewPrep) })} disabled={isPrepLoading} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all disabled:opacity-50">
              {isPrepLoading ? <span className="animate-pulse">Preparing...</span> : 'Start Coaching'}
            </button>
          </>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="w-full h-80 overflow-y-auto text-xs text-gray-700 dark:text-slate-300 bg-emerald-50/50 dark:bg-slate-900/50 border border-emerald-100 dark:border-emerald-900/30 rounded-lg p-4 leading-relaxed whitespace-pre-wrap font-mono">
              {interviewPrep}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setInterviewPrep('')} className="flex-1 py-2 text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-gray-700 bg-gray-100 dark:bg-slate-700 rounded-lg">Close</button>
              <button onClick={() => { navigator.clipboard.writeText(interviewPrep); alert('Copied!'); }} className="flex-1 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-200">Copy</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default JobSidebar;