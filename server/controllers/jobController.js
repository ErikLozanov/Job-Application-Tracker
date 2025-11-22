
import prisma from '../config/prisma.js';

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        userId: req.user.id, 
      },
      orderBy: {
        createdAt: 'desc',
      },
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
  const {
    company,
    jobTitle,
    jobUrl,
    status,
    priority,
    appliedDate,
    notes,
  } = req.body;

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