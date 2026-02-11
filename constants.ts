
import { InterviewQuestion } from './types';

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  { id: 1, text: "Tell me about yourself and your background.", category: "General", difficulty: "Easy" },
  { id: 2, text: "What is your greatest professional achievement so far?", category: "General", difficulty: "Moderate" },
  { id: 3, text: "Describe a time you dealt with a difficult team member. How did you handle it?", category: "Behavioral", difficulty: "Moderate" },
  { id: 4, text: "How do you handle high-pressure situations or tight deadlines?", category: "Behavioral", difficulty: "Moderate" },
  { id: 5, text: "Where do you see yourself in five years?", category: "General", difficulty: "Easy" },
  { id: 6, text: "Explain a complex technical concept to someone with a non-technical background.", category: "Technical", difficulty: "Aggressive" },
  { id: 7, text: "Why should we hire you over other candidates?", category: "General", difficulty: "Moderate" }
];

export const INTERVIEW_TYPES = [
  "Frontend Developer",
  "Backend Developer",
  "Product Manager",
  "Data Scientist",
  "UX Designer",
  "General HR"
];
