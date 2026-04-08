import React, { useState } from 'react';
import SetupForm from './features/Interview/SetupForm';
import { VoiceButton, ChatBubble } from './components/UI';
import { useVoice } from './hooks/useVoice';
import { generateInterviewResponse } from './services/gemini';
import VoiceWave from "./components/VoiceWave";
import ProgressBar from "./components/ProgressBar";

function App() {
  const [step, setStep] = useState('setup');
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const { speak, listen, isListening } = useVoice();

  // ميزة الـ Progress bar تعتمد على عدد ردود الـ AI
  const totalQuestions = 6;
  const currentStep = messages.filter(m => m.role === "ai").length;

  const handleAISpeech = async (historyUpdate, currentData) => {
    setLoading(true);
    
    // نستخدم الـ currentData الممررة مباشرة أو الـ state
    const dataToUse = currentData || userData;
    
    const aiResponse = await generateInterviewResponse(historyUpdate, dataToUse);
    setLoading(false);

    const newMessage = { role: 'ai', text: aiResponse };
    setMessages(prev => [...prev, newMessage]);

    speak(aiResponse, () => {
      // لا يبدأ الاستماع التلقائي إلا إذا لم تنتهِ المقابلة (أقل من 5 أسئلة + التقييم)
      if (currentStep < totalQuestions) {
        handleUserListen();
      }
    });
  };

  const handleUserListen = () => {
    if (loading) return;
    listen(async (userText) => {
      const userMessage = { role: 'user', text: userText };
      const updatedHistory = [...messages, userMessage];
      setMessages(updatedHistory);
      await handleAISpeech(updatedHistory);
    });
  };

  const handleStart = async (data) => {
    setUserData(data); // تحديث الـ state للاستخدام المستقبلي
    setStep('interview');

    const initialMessage = {
      role: 'user',
      text: `Hello, I am ${data.name}. I am ready for the ${data.jobTitle} interview.`,
    };

    const history = [initialMessage];
    setMessages(history);

    // 🔥 التعديل الجوهري: نمرر الـ data مباشرة هنا لتجنب تأخير الـ state
    await handleAISpeech(history, data);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col items-center justify-center p-4">
      {step === 'setup' ? (
        <SetupForm onStart={handleStart} />
      ) : (
        <div className="w-full max-w-2xl h-[85vh] flex flex-col">
          
          {/* Progress Bar */}
          <div className="w-full mb-4">
            <ProgressBar current={currentStep} total={totalQuestions} />
          </div>

          {/* 💬 Messages */}
          <div className="flex-1 overflow-y-auto mb-6 p-4 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} />
            ))}
            {loading && (
              <div className="text-blue-400 animate-pulse text-sm ml-2">
                AI Interviewer is thinking...
              </div>
            )}
          </div>

          {/* 🎤 Control */}
          <div className="flex flex-col items-center gap-4 border-t border-gray-800 pt-6">
            <VoiceWave isActive={isListening} />
            
            <VoiceButton isActive={isListening} onClick={handleUserListen} />

            <p className="text-gray-400 text-sm">
              {loading
                ? "Processing your answer..."
                : isListening
                ? "Listening... Speak now"
                : "Click the mic to speak"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;