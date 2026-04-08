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

  const handleAISpeech = async (historyUpdate, currentData) => {
    setLoading(true);
    
    // نستخدم الـ currentData لو مبعوتة (في أول مرة) أو الـ state (في المرات اللي بعد كدا)
    const activeData = currentData || userData;

    const aiResponse = await generateInterviewResponse(historyUpdate, activeData);
    setLoading(false);

    const newMessage = { role: 'ai', text: aiResponse };
    setMessages(prev => [...prev, newMessage]);

    speak(aiResponse, () => {
      // السماح بالرد بعد انتهاء الـ AI من الكلام
      console.log("AI finished speaking.");
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
    console.log("Starting Interview with:", data);
    setUserData(data); 
    setStep('interview');

    const initialMessage = {
      role: 'user',
      text: `Hello, I'm ${data.name}. Let's start the ${data.jobTitle} interview.`,
    };

    const history = [initialMessage];
    setMessages(history);

    // 🔥 التعديل: تمرير الـ data مباشرة هنا
    await handleAISpeech(history, data);
  };

  const currentStep = messages.filter(m => m.role === "ai").length;

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col items-center justify-center p-4">
      {step === 'setup' ? (
        <SetupForm onStart={handleStart} />
      ) : (
        <div className="w-full max-w-2xl h-[85vh] flex flex-col">
          <ProgressBar current={currentStep} total={6} />

          <div className="flex-1 overflow-y-auto my-4 p-4 space-y-4 border border-gray-800 rounded-xl">
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} />
            ))}
            {loading && <p className="text-blue-400 animate-pulse text-sm">Thinking...</p>}
          </div>

          <div className="flex flex-col items-center gap-4">
            <VoiceWave isActive={isListening} />
            <VoiceButton isActive={isListening} onClick={handleUserListen} />
            <p className="text-gray-500 text-sm">
              {isListening ? "Listening..." : "Click to speak"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;