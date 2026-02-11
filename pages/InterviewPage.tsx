
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InterviewSession, AnswerRecord, InterviewQuestion } from '../types';
import { INTERVIEW_QUESTIONS } from '../constants';
import { analyzeAnswer, generateAggregateFeedback } from '../services/geminiService';

interface Props {
  session: InterviewSession;
  role: string;
  onComplete: (session: InterviewSession) => void;
}

const InterviewPage: React.FC<Props> = ({ session, role, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<number | null>(null);

  const currentQuestion = INTERVIEW_QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => (prev + " " + finalTranscript).trim());
        }
      };
    }

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = useCallback(() => {
    setTranscript("");
    setApiError(null);
    setIsRecording(true);
    setTimeLeft(90);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already started");
      }
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn("Recognition already stopped");
      }
    }
  }, []);

  const processAnalysis = async (skipAnalysis = false) => {
    setIsProcessing(true);
    setApiError(null);

    try {
      let feedback = null;
      if (!skipAnalysis) {
        feedback = await analyzeAnswer(currentQuestion.text, transcript, role);
      } else {
        feedback = {
          confidenceScore: 0,
          clarityScore: 0,
          technicalDepthScore: 0,
          overallScore: 0,
          summary: "Analysis skipped due to API limitations.",
          strengths: ["Session data captured"],
          weaknesses: ["AI analysis unavailable"],
          tipsForImprovement: ["Try again when quota resets"]
        };
      }
      
      const newAnswer: AnswerRecord = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.text,
        transcript: transcript,
        feedback: feedback
      };

      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);

      if (currentQuestionIndex < INTERVIEW_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setIsProcessing(false);
        setTranscript("");
      } else {
        let sessionFeedback;
        try {
          sessionFeedback = await generateAggregateFeedback({ role, answers: updatedAnswers });
        } catch (e) {
          sessionFeedback = feedback;
        }
        onComplete({
          ...session,
          answers: updatedAnswers,
          overallPerformance: sessionFeedback
        });
      }
    } catch (err: any) {
      console.error("Feedback analysis failed", err);
      setApiError(err.message || "Quota exceeded. Please try again in a moment.");
      setIsProcessing(false);
    }
  };

  const handleNext = () => {
    stopRecording();
    processAnalysis(false);
  };

  return (
    <div className="min-h-screen p-8 lg:p-16 fade-in">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Video and controls */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className={`relative rounded-[3rem] overflow-hidden shadow-2xl aspect-video transition-all duration-500 border-4 ${isRecording ? 'border-pink-500 recording-glow scale-[1.01]' : 'border-indigo-500/30 shadow-indigo-500/10'}`}>
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className="w-full h-full object-cover scale-x-[-1] grayscale-[0.2]"
            />
            
            {/* Overlay indicators */}
            <div className="absolute top-10 left-10 flex items-center gap-6">
              {isRecording ? (
                <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black shadow-xl animate-pulse">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                  RECORDING
                </div>
              ) : (
                <div className="glass-dark text-white px-6 py-3 rounded-2xl font-black border border-white/20 tracking-widest text-sm">
                  STANDBY
                </div>
              )}
              <div className="bg-indigo-600/90 text-white px-6 py-3 rounded-2xl font-black font-mono border border-indigo-400/30 text-2xl shadow-xl">
                00:{timeLeft.toString().padStart(2, '0')}
              </div>
            </div>

            {!isRecording && !isProcessing && !apiError && (
               <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl flex flex-col items-center justify-center gap-8 group">
                   <button 
                    onClick={startRecording}
                    className="btn-vibrant text-white w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-all hover:scale-110 active:scale-95"
                   >
                       <i className="fas fa-play text-4xl"></i>
                   </button>
                   <p className="text-white font-black text-xl tracking-tighter uppercase">Initialize Response</p>
               </div>
            )}
          </div>

          <div className="glass-dark p-12 rounded-[3.5rem] border border-white/10 relative shadow-2xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-6 pointer-events-none">
              <i className="fas fa-wave-square text-6xl"></i>
            </div>
            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-[0.4em] mb-8">Audio Intelligence Engine</h4>
            <div className="min-h-[160px] text-slate-200 text-2xl leading-relaxed italic font-medium selection:bg-indigo-500/40">
                {transcript ? (
                   <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                      {transcript}
                   </span>
                ) : (
                  <span className="text-slate-500">{isRecording ? "Listening for your response..." : "Audio channel ready. Awaiting input."}</span>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Card & Status */}
        <div className="lg:col-span-4 flex flex-col gap-10">
          <div className="glass-dark p-12 rounded-[3.5rem] border border-white/10 shadow-3xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {apiError ? (
              <div className="flex flex-col gap-8 animate-in fade-in zoom-in duration-500">
                <div className="bg-rose-500/20 border border-rose-500/40 p-8 rounded-3xl">
                  <div className="w-16 h-16 bg-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mb-6">
                    <i className="fas fa-triangle-exclamation text-2xl"></i>
                  </div>
                  <h4 className="text-rose-400 text-xl font-black mb-3">AI CONGESTION</h4>
                  <p className="text-slate-300 leading-relaxed font-medium">
                    Analysis failed due to rate limits. Would you like to retry or proceed to capture the response data without real-time analysis?
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <button onClick={() => processAnalysis(false)} className="w-full btn-vibrant text-white py-6 rounded-2xl font-black uppercase tracking-widest text-sm">
                    Retry Analysis
                  </button>
                  <button onClick={() => processAnalysis(true)} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-6 rounded-2xl font-black uppercase tracking-widest text-sm border border-white/10">
                    Skip & Continue
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-12">
                  <span className="bg-indigo-600/20 text-indigo-300 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] border border-indigo-500/30 shadow-lg shadow-indigo-500/5">
                    STAGE {currentQuestionIndex + 1}
                  </span>
                  <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] border shadow-lg ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-emerald-500/5' : 
                    currentQuestion.difficulty === 'Moderate' ? 'bg-orange-500/20 text-orange-300 border-orange-500/30 shadow-orange-500/5' : 'bg-rose-500/20 text-rose-300 border-rose-500/30 shadow-rose-500/5'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                
                <h3 className="text-4xl font-black text-white mb-14 leading-[1.1] tracking-tighter">
                  {currentQuestion.text}
                </h3>

                <div className="space-y-8">
                   {isProcessing ? (
                     <div className="bg-white/5 p-14 rounded-[3rem] flex flex-col items-center gap-8 border border-white/10 animate-pulse">
                        <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-indigo-300 font-black uppercase tracking-[0.3em] text-xs text-center leading-relaxed">Gemini Analyzing<br/>Linguistic Patterns...</p>
                     </div>
                   ) : (
                    <>
                      <button 
                        disabled={!isRecording}
                        onClick={handleNext}
                        className="w-full btn-vibrant text-white py-8 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-4 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-[0.2em] shadow-2xl"
                      >
                        Commit <i className="fas fa-chevron-right text-sm"></i>
                      </button>
                      <div className="flex justify-center gap-6">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                        <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      </div>
                    </>
                   )}
                </div>
              </>
            )}
          </div>

          <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-12 rounded-[3.5rem] border border-white/10 text-white shadow-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-pink-500/20 transition-all duration-700"></div>
            <h4 className="font-black mb-6 flex items-center gap-4 text-pink-400 uppercase tracking-[0.3em] text-xs">
              <i className="fas fa-sparkles"></i> Pro Strategy
            </h4>
            <p className="text-slate-200 text-lg leading-relaxed font-medium">
              Structure your answers using the <span className="text-indigo-400 font-bold">STAR</span> method: Situation, Task, Action, and Result for maximum impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
