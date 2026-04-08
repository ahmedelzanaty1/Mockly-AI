This is a professional README.md file tailored for your Mockly.AI project. It highlights the tech stack, the sophisticated voice-loop logic, and the core features you've built.

🚀 Mockly.AI | AI-Powered Interview Simulator
Mockly.AI is a cutting-edge, web-based platform designed to help job seekers master their interview skills. By leveraging Google's Gemini AI and the Web Speech API, the platform creates a realistic, voice-first interview experience that mimics a real-life HR or Technical screening.

✨ Features
🎤 Auto-Conversation Mode: A seamless "Hands-Free" experience. The AI speaks, and the system automatically toggles the microphone to listen to your response.

🧠 Intelligent Interviewer: Powered by Gemini 1.5 Flash, the AI analyzes your Job Description (JD) and asks tailored, one-at-a-time questions.

🌊 Real-time Voice Visualizer: Dynamic pulse animation that provides visual feedback while you speak.

📊 Progress Tracking: A visual progress bar showing your journey through the interview stages.

📝 Automated Feedback: Receive a comprehensive evaluation at the end of each session, including a score, strengths, and areas for improvement.

🛠️ Tech Stack
Frontend: React.js (Vite)

Styling: Tailwind CSS

AI Engine: Google Gemini API

Voice Engine: Web Speech API (Speech-to-Text & Text-to-Speech)

Icons: Lucide React

📂 Project Structure
Plaintext
src/
├── components/      # Reusable UI components (Progress bar, Visualizer, Bubbles)
├── features/        # Interview logic and Setup forms
├── hooks/           # Custom hooks (useVoice for speech management)
├── services/        # API service layer for Gemini integration
├── utils/           # Helper functions and local storage management
└── App.jsx          # Main application controller and State logic
🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

A Google AI Studio API Key

Installation
Clone the repository:

Bash
git clone https://github.com/your-username/ai-interview-simulator.git
cd ai-interview-simulator
Install dependencies:

Bash
npm install
Environment Setup:
Create a .env file in the root directory and add your Gemini API Key:

Code snippet
VITE_GEMINI_API_KEY=your_api_key_here
Run the development server:

Bash
npm run dev
🧠 How it Works
Setup: The user enters their name, target job title, and pastes the Job Description.

Initialization: The AI generates a customized system prompt and asks the first question.

The Loop: * TTS: The system converts AI text to speech.

STT: Once the AI finishes speaking, the microphone activates.

Processing: The user's voice is transcribed and sent back to the AI with the full conversation history.

Feedback: After 5 questions, the AI summarizes the performance and provides a final report.

🛡️ License
Distributed under the MIT License. See LICENSE for more information.

👨‍💻 Developed by
[Ahmed Elzanaty] - DevOps Engineer & Software Engineer 
