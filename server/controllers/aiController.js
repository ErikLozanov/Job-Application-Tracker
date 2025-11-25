import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/prisma.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCoverLetter = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Write a professional and enthusiastic cover letter for a ${job.jobTitle} position at ${job.company}.
      
      Key details to include:
      - Express strong interest in ${job.company}.
      - Mention that I have relevant skills for a ${job.jobTitle}.
      - Use these specific notes from my research: "${job.notes || 'No specific notes provided.'}"
      
      Keep it concise (under 250 words), professional, and ready to copy-paste.
      Do not include placeholders like "[Your Name]" unless necessary.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const coverLetter = response.text();

    res.json({ coverLetter });

  } catch (error) {
    console.error('Gemini Error:', error);
    res.status(500).json({ message: 'Failed to generate cover letter' });
  }
};