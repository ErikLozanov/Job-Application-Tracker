import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useJob, 
  useDeleteJob, 
  useUpdateJob, 
  useGenerateCoverLetter, 
  useGenerateInterviewQuestions 
} from '../../hooks/useJobs';


const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    APPLIED: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
    INTERVIEW: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    OFFER: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20',
  };
  return (
    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ring-1 ${styles[status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
      {status}
    </span>
  );
};

const createCalendarUrl = (job: any) => {
  if (!job.interviewDate) return '';
  const date = new Date(job.interviewDate);
  const start = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = date.toISOString().replace(/-|:|\.\d\d\d/g, ""); 
  const title = encodeURIComponent(`Interview: ${job.jobTitle} at ${job.company}`);
  const details = encodeURIComponent(`Notes: ${job.notes || 'No notes'}`);
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`;
};


const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Hooks
  const { data: job, isLoading, isError } = useJob(id || '');
  const { mutate: removeJob, isPending: isDeleting } = useDeleteJob();
  const { mutate: saveJob, isPending: isSaving } = useUpdateJob();
  const { mutate: generateAI, isPending: isGenerating } = useGenerateCoverLetter();
  const { mutate: generateInterview, isPending: isPrepLoading } = useGenerateInterviewQuestions();

  // State
  const [isEditing, setIsEditing] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [interviewPrep, setInterviewPrep] = useState('');
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
  });

  // Sync Data
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
      });
    }
  }, [job]);

  // Handlers
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
      
      {/* --- Header Card --- */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/50 to-purple-50/50 rounded-full blur-3xl -z-10 group-hover:scale-110 transition-transform duration-700" />

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/30">
                {job.company.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3 max-w-md">
                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="block w-full text-2xl font-bold text-gray-900 bg-white/50 border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Company" />
                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="block w-full text-lg text-gray-600 bg-white/50 border border-gray-200 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Job Title" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{job.company}</h1>
                    <p className="text-xl text-gray-500 font-medium">{job.jobTitle}</p>
                  </>
                )}
              </div>
            </div>

            {!isEditing && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <StatusBadge status={job.status} />
                <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {job.priority} Priority
                </span>
                <span className="text-sm text-gray-400 flex items-center bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  Applied on {new Date(job.appliedDate || Date.now()).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-2.5 rounded-full bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/jobs')} className="px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all shadow-sm">Back</button>
                <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold hover:bg-indigo-100 transition-all shadow-sm">Edit</button>
                <button onClick={handleDelete} disabled={isDeleting} className="px-5 py-2.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 font-bold hover:bg-rose-100 transition-all shadow-sm">
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Content Grid --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Details & Notes */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Edit Form Panel */}
          {isEditing && (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 p-8 space-y-6 animate-fade-in-down">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">Update Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleChange} className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all">
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Job Link</label>
                  <input type="url" name="jobUrl" value={formData.jobUrl} onChange={handleChange} className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date Applied</label>
                  <input type="date" name="appliedDate" value={formData.appliedDate} onChange={handleChange} className="block w-full rounded-xl border-gray-200 bg-gray-50 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                </div>
                {formData.status === 'INTERVIEW' && (
                  <div className="animate-fade-in">
                    <label className="block text-sm font-bold text-amber-600 mb-2">Interview Date</label>
                    <input type="date" name="interviewDate" value={formData.interviewDate} onChange={handleChange} className="block w-full rounded-xl border-amber-200 bg-amber-50 p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all" />
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Update Resume</label>
                <label className="cursor-pointer flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    {resumeFile ? resumeFile.name : (job.resumeName ? `Replace: ${job.resumeName}` : 'Click to upload new resume')}
                  </span>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            </div>
          )}

          {/* Notes Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 p-8 h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-lg">📝</span> Notes & Strategy
            </h3>
            {isEditing ? (
              <textarea name="notes" rows={12} value={formData.notes} onChange={handleChange} className="block w-full rounded-xl border-gray-200 bg-gray-50 p-4 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none font-medium text-gray-700" placeholder="Add notes..." />
            ) : (
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-6 rounded-2xl border border-gray-100 min-h-[12rem]">
                {job.notes || <span className="text-gray-400 italic">No notes added yet. Use the edit button to add details.</span>}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Tools & AI */}
        <div className="space-y-6">
          
          {/* Link Button */}
          {!isEditing && job.jobUrl && (
            <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-4 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all group">
              Open Job Posting <span className="ml-2 group-hover:translate-x-1 transition-transform">↗</span>
            </a>
          )}

          {/* Attachments */}
          {!isEditing && (
            job.resumeUrl ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative overflow-hidden group hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900">Attached Resume</h3>
                    <p className="text-xs text-gray-500 truncate" title={job.resumeName}>{job.resumeName || 'Resume.pdf'}</p>
                  </div>
                </div>
                <a href={job.resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center justify-center w-full py-2 text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">View Document</a>
              </div>
            ) : (
              <div className="bg-amber-50 rounded-2xl shadow-sm border border-amber-100 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-amber-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg></div>
                  <h3 className="text-sm font-bold text-amber-900">Resume Missing</h3>
                </div>
                <button onClick={() => setIsEditing(true)} className="w-full py-2 text-xs font-bold text-amber-700 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 transition-colors">Upload Now</button>
              </div>
            )
          )}

          {/* Calendar (Only visible if Interview Set) */}
          {!isEditing && job.status === 'INTERVIEW' && job.interviewDate && (
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

          {/* --- AI CARD 1: Cover Letter --- */}
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl -z-10 group-hover:bg-indigo-100 transition-colors" />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl p-2 bg-indigo-50 rounded-lg">✨</span>
              <h3 className="text-lg font-bold text-indigo-900">Cover Letter</h3>
            </div>
            
            {!generatedLetter ? (
              <>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Generate a tailored cover letter using Gemini AI based on your resume and notes.
                </p>
                <button onClick={() => generateAI(id!, { onSuccess: (d) => setGeneratedLetter(d.coverLetter) })} disabled={isGenerating} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                  {isGenerating ? <span className="animate-pulse">Writing Magic...</span> : 'Generate Draft'}
                </button>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <textarea readOnly className="w-full h-64 text-xs text-gray-600 bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 resize-none focus:outline-none font-mono leading-relaxed" value={generatedLetter} />
                <div className="flex gap-2">
                  <button onClick={() => setGeneratedLetter('')} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg">Discard</button>
                  <button onClick={() => { navigator.clipboard.writeText(generatedLetter); alert('Copied!'); }} className="flex-1 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg border border-indigo-100 hover:bg-indigo-100">Copy</button>
                </div>
              </div>
            )}
          </div>

          {/* --- AI CARD 2: Interview Coach --- */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-10 group-hover:bg-emerald-100 transition-colors" />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl p-2 bg-emerald-50 rounded-lg">🎤</span>
              <h3 className="text-lg font-bold text-emerald-900">Interview Coach</h3>
            </div>

            {!interviewPrep ? (
              <>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Get custom interview questions and tips based on this role and your experience.
                </p>
                <button onClick={() => generateInterview(id!, { onSuccess: (d) => setInterviewPrep(d.interviewPrep) })} disabled={isPrepLoading} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all disabled:opacity-50">
                  {isPrepLoading ? <span className="animate-pulse">Preparing...</span> : 'Start Coaching'}
                </button>
              </>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="w-full h-80 overflow-y-auto text-xs text-gray-700 bg-emerald-50/50 border border-emerald-100 rounded-lg p-4 leading-relaxed font-mono">
                  <pre className="whitespace-pre-wrap font-sans">{interviewPrep}</pre>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setInterviewPrep('')} className="flex-1 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg">Close</button>
                  <button onClick={() => { navigator.clipboard.writeText(interviewPrep); alert('Copied!'); }} className="flex-1 py-2 text-xs font-bold text-emerald-700 bg-emerald-100 rounded-lg border border-emerald-200 hover:bg-emerald-200">Copy</button>
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