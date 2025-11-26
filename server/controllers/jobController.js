
import prisma from '../config/prisma.js';
import supabase from '../config/supabase.js';

export const getAllJobs = async (req, res) => {
  const { limit, search, status } = req.query;

  const whereClause = {
    userId: req.user.id, 
  };

  if (status && status !== 'ALL') {
    whereClause.status = status;
  }

  if (search) {
    whereClause.OR = [
      { company: { contains: search, mode: 'insensitive' } }, 
      { jobTitle: { contains: search, mode: 'insensitive' } },
    ];
  }

  try {
    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: 'desc', 
      },
      take: limit ? parseInt(limit) : undefined, 
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await prisma.job.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id, 
      },
    });

    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  // Extract text fields
  const {
    company,
    jobTitle,
    jobUrl,
    status,
    priority,
    appliedDate,
    notes,
  } = req.body;

  let resumeUrl = null;
  let resumeName = null;

  if (req.file) {
    try {
      const fileName = `${req.user.id}/${Date.now()}_${req.file.originalname}`;

      const { data, error } = await supabase.storage
        .from('resumes') 
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName);

      resumeUrl = urlData.publicUrl;
      resumeName = req.file.originalname;

    } catch (uploadError) {
      console.error('Upload Error:', uploadError);
    }
  }

  try {
    const newJob = await prisma.job.create({
      data: {
        company,
        jobTitle,
        jobUrl,
        status,
        priority,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        notes,
        resumeUrl, 
        resumeName, 
        userId: req.user.id,
      },
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const {
    company,
    jobTitle,
    jobUrl,
    status,
    priority,
    appliedDate,
    interviewDate,
    notes,
  } = req.body;

  try {
    const job = await prisma.job.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // If it exists and belongs to them, update it
    const updatedJob = await prisma.job.update({
      where: {
        id: parseInt(id),
      },
      data: {
        company,
        jobTitle,
        jobUrl,
        status,
        priority,
        appliedDate: appliedDate ? new Date(appliedDate) : null,
        interviewDate: interviewDate ? new Date(interviewDate) : null,
        notes,
      },
    });
    res.json(updatedJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await prisma.job.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id,
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await prisma.job.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.json({ message: 'Job removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getJobStats = async (req, res) => {
  try {
    const stats = await prisma.job.groupBy({
      by: ['status'],
      where: {
        userId: req.user.id,
      },
      _count: {
        status: true,
      },
    });

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.status;
      return acc;
    }, {});

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};