
export interface InterviewQuestion {
  id: number;
  text: string;
  category: string;
  difficulty: 'Easy' | 'Moderate' | 'Aggressive';
}

export interface FeedbackData {
  confidenceScore: number;
  clarityScore: number;
  technicalDepthScore: number;
  overallScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  tipsForImprovement: string[];
}

export interface AnswerRecord {
  questionId: number;
  questionText: string;
  transcript: string;
  videoBlob?: Blob;
  feedback?: FeedbackData;
}

export interface InterviewSession {
  id: string;
  type: string;
  date: string;
  answers: AnswerRecord[];
  overallPerformance?: FeedbackData;
}

export type AppView = 'LANDING' | 'SETUP' | 'INTERVIEW' | 'RESULT' | 'DASHBOARD';
