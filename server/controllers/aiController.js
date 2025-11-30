import { GoogleGenerativeAI } from '@google/generative-ai';
import prisma from '../config/prisma.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const getPdfParser = () => {
  try {
    const lib = require('pdf-parse');
    
    console.log("PDF-Parse loaded. Type:", typeof lib);
    
    if (typeof lib === 'function') return lib;
    
    if (lib.default && typeof lib.default === 'function') return lib.default;
    
    console.error("PDF-Parse is not a function! It looks like:", lib);
    return null;
  } catch (e) {
    console.error("Failed to load pdf-parse:", e);
    return null;
  }
};

const pdfParse = getPdfParser();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCoverLetter = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(jobId) },
    });

    if (!job) return res.status(404).json({ message: 'Job not found' });

    let resumeText = '';
    
    if (job.resumeUrl) {
      if (!pdfParse) {
        console.warn("Skipping resume parsing: PDF Parser not loaded.");
      } else {
        try {
          console.log("Fetching resume from:", job.resumeUrl);
          const response = await fetch(job.resumeUrl);
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          const pdfData = await pdfParse(buffer);
          resumeText = pdfData.text;
          console.log(" Resume parsed. Length:", resumeText.length);
        } catch (parseError) {
          console.error("Failed to parse resume:", parseError);
        }
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Write a highly professional and persuasive cover letter for a ${job.jobTitle} position at ${job.company}.
      
      ${resumeText ? `
      Here is my RESUME/CV content. Match my actual skills and experience from this text to the job title:
      <RESUME_START>
      ${resumeText.substring(0, 3000)} 
      <RESUME_END>
      ` : 'No resume provided. Use general professional placeholders.'}

      Additional Context/Notes for this application:
      "${job.notes || 'No specific notes provided.'}"

      Instructions:
      - Don't just summarize the resume; explain *why* my experience makes me a great fit for *this specific role* at ${job.company}.
      - Keep it concise (under 300 words).
      - Tone: Enthusiastic, confident, and professional.
      - Use standard cover letter formatting.
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

export const generateInterviewQuestions = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    let resumeText = '';
    if (job.resumeUrl) {
      try {
        const response = await fetch(job.resumeUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const data = await pdfParse(buffer);
        resumeText = data.text;
      } catch (e) {
        console.error("Resume parse failed", e);
      }
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Act as an expert technical interviewer and career coach.
      Generate a Interview Prep Guide for a ${job.jobTitle} position at ${job.company}.
      
      ${resumeText ? `Based on this candidate's resume: ${resumeText.substring(0, 3000)}` : ''}
      
      Job Notes: "${job.notes || ''}"

      Output Format:
      1. **3 Behavioral Questions** (tailored to the company culture if known, or standard STAR method).
      2. **3 Technical/Role-Specific Questions** (based on the job title).
      3. **1 "Curveball" Question** (a tricky or creative question).
      
      For each question, provide a short "Coach's Tip" on what the interviewer is looking for.
      Keep the tone encouraging but professional. Use Markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const interviewPrep = response.text();

    res.json({ interviewPrep });

  } catch (error) {
    console.error('AI Interview Error:', error);
    res.status(500).json({ message: 'Failed to generate interview questions' });
  }
};

export const analyzeResume = async (req, res) => {
  const { jobId } = req.body;

  try {
    const job = await prisma.job.findUnique({ where: { id: parseInt(jobId) } });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (!job.resumeUrl) {
      return res.status(400).json({ message: 'Please upload a resume first.' });
    }
    if (!job.jobDescription) {
      return res.status(400).json({ message: 'Please add the Job Description text.' });
    }

    let resumeText = '';
    try {
      const response = await fetch(job.resumeUrl);
      const arrayBuffer = await response.arrayBuffer();
      const data = await pdfParse(Buffer.from(arrayBuffer));
      resumeText = data.text;
    } catch (e) {
      return res.status(500).json({ message: 'Failed to read resume PDF.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Act as an expert ATS (Applicant Tracking System) and Hiring Manager.
      
      Compare this Candidate Resume:
      "${resumeText.substring(0, 10000)}"

      To this Job Description:
      "${job.jobDescription.substring(0, 10000)}"

      Provide a structured analysis in Markdown format:
      
      1. **Match Score:** Give a score out of 100 based on keyword and skill matching.
      2. **Missing Keywords:** List the top 5 hard skills/keywords found in the JD that are missing from the resume.
      3. **Tailoring Advice:** Give 3 specific bullet points on how to rewrite the resume to rank higher for this specific job.
      
      Keep it concise and actionable.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({ analysis });

  } catch (error) {
    console.error('AI Analyze Error:', error);
    res.status(500).json({ message: 'Failed to analyze resume' });
  }
};