import React, { useState, useEffect } from 'react';
import { useJobs, useUpdateJob } from '../../hooks/useJobs';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import type { Job } from '../../types';
import { Link } from 'react-router-dom';

const JobCard = ({ job, isOverlay }: { job: Job; isOverlay?: boolean }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id.toString(),
    data: { job }, 
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}js, ${transform.y}js, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 
        hover:shadow-md cursor-grab active:cursor-grabbing group relative
        ${isOverlay ? 'rotate-3 scale-105 shadow-xl ring-2 ring-blue-500 z-50' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
          {job.company.charAt(0).toUpperCase()}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border 
          ${job.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400' : 
            job.priority === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400' : 
            'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400'}`}>
          {job.priority}
        </span>
      </div>
      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">{job.company}</h4>
      <p className="text-xs text-gray-500 dark:text-slate-400 truncate mb-3">{job.jobTitle}</p>
      
      <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-slate-700">
        <span className="text-[10px] text-gray-400">
          {new Date(job.updatedAt || job.appliedDate || Date.now()).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
        </span>
        <Link to={`/jobs/${job.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-blue-600 hover:underline">
          View
        </Link>
      </div>
    </div>
  );
};

const Column = ({ status, title, count, children }: { status: string; title: string; count: number; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id: status });

  const colors: Record<string, string> = {
    APPLIED: 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800',
    INTERVIEW: 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800',
    OFFER: 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800',
    REJECTED: 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800',
  };

  return (
    <div ref={setNodeRef} className={`flex-1 min-w-[280px] rounded-2xl p-4 border ${colors[status]} flex flex-col gap-3 min-h-[500px]`}>
      <div className="flex justify-between items-center mb-1 px-1">
        <h3 className="font-bold text-sm text-gray-700 dark:text-gray-200">{title}</h3>
        <span className="bg-white dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          {count}
        </span>
      </div>
      <div className="space-y-3 flex-1">
        {children}
      </div>
    </div>
  );
};

const Kanban = () => {
  const { data: jobs, isLoading } = useJobs();
  const { mutate: updateJob } = useUpdateJob();
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const job = event.active.data.current?.job as Job;
    setActiveJob(job);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const jobId = active.id as string;
    const newStatus = over.id as string;
    
    if (activeJob && activeJob.status !== newStatus) {
      
      const formData = new FormData();
      formData.append('status', newStatus);
      
      updateJob({ id: jobId, data: formData });
    }
    
    setActiveJob(null);
  };

  if (isLoading) return <div className="flex h-64 items-center justify-center text-blue-600 font-medium animate-pulse">Loading board...</div>;

  const getJobsByStatus = (status: string) => jobs?.filter((j) => j.status === status) || [];

  return (
    <div className="h-full overflow-x-auto pb-4">
      <div className="flex justify-between items-center mb-6 px-1">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Board View</h1>
        <Link to="/jobs" className="text-sm font-medium text-gray-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400">
          Switch to List &rarr;
        </Link>
      </div>

      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 min-w-full">
          <Column status="APPLIED" title="Applied" count={getJobsByStatus('APPLIED').length}>
            {getJobsByStatus('APPLIED').map((job) => <JobCard key={job.id} job={job} />)}
          </Column>
          
          <Column status="INTERVIEW" title="Interview" count={getJobsByStatus('INTERVIEW').length}>
            {getJobsByStatus('INTERVIEW').map((job) => <JobCard key={job.id} job={job} />)}
          </Column>
          
          <Column status="OFFER" title="Offer" count={getJobsByStatus('OFFER').length}>
            {getJobsByStatus('OFFER').map((job) => <JobCard key={job.id} job={job} />)}
          </Column>
          
          <Column status="REJECTED" title="Rejected" count={getJobsByStatus('REJECTED').length}>
            {getJobsByStatus('REJECTED').map((job) => <JobCard key={job.id} job={job} />)}
          </Column>
        </div>

        <DragOverlay>
          {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default Kanban;