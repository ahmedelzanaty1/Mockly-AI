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

  const handleAISpeech = async (historyUpdate) => {
    setLoading(true);

    const aiResponse = await generateInterviewResponse(historyUpdate, userData);

    setLoading(false);

    const newMessage = { role: 'ai', text: aiResponse };

    setMessages(prev => [...prev, newMessage]);

    speak(aiResponse, () => {
      handleUserListen(); // يرجع يسمع تلقائي
    });
  };

  const handleUserListen = () => {
    if (loading) return; // يمنع الكلام وقت processing

    listen(async (userText) => {
      const userMessage = { role: 'user', text: userText };

      const updatedHistory = [...messages, userMessage];

      setMessages(updatedHistory);

      await handleAISpeech(updatedHistory);
    });
  };
  <VoiceWave isActive={isListening} />
  const totalQuestions = 6;

  const currentStep = messages.filter(m => m.role === "ai").length;

<ProgressBar current={currentStep} total={totalQuestions} />

  const handleStart = async (data) => {
    setUserData(data);
    setStep('interview');

    const initialMessage = {
      role: 'user',
      text: `Start the interview for ${data.jobTitle}`,
    };

    const history = [initialMessage];

    setMessages(history);

    await handleAISpeech(history);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 flex flex-col items-center justify-center p-4">
      {step === 'setup' ? (
        <SetupForm onStart={handleStart} />
      ) : (
        <div className="w-full max-w-2xl h-[85vh] flex flex-col">
          
          {/* 💬 Messages */}
          <div className="flex-1 overflow-y-auto mb-6 p-4 space-y-4">
            {messages.map((m, i) => (
              <ChatBubble key={i} role={m.role} text={m.text} />
            ))}
          </div>

          {/* 🎤 Control */}
          <div className="flex flex-col items-center gap-4 border-t border-gray-800 pt-6">
            <VoiceButton isActive={isListening} onClick={handleUserListen} />

            <p className="text-gray-400">
              {loading
                ? "AI is thinking..."
                : isListening
                ? "Listening... Speak now"
                : "Click mic to start"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;