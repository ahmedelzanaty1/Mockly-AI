export const generateInterviewResponse = async (history = [], userData) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  try {
    // للتأكد من وصول البيانات
    if (!API_KEY) {
      console.error("Vercel Check: API Key is missing!");
      return "API key is missing. Please set VITE_GEMINI_API_KEY in Vercel settings.";
    }

    if (!userData || !userData.jobTitle) {
      console.error("Context Check: userData is null or incomplete", userData);
      return "User data is missing. Please restart the setup.";
    }

    const systemInstruction = `
You are a professional ${userData.type} interviewer.
Candidate Name: ${userData.name}
Role: ${userData.jobTitle}
Job Description: ${userData.jd}

Rules:
- Ask only ONE short question at a time.
- Give very brief encouraging feedback before the next question.
- After 5 questions, provide a final evaluation with Score (X/10), Strengths, and Improvements.
- Start by welcoming the candidate.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\n\nStart the interview now." }],
      },
      ...history.map((msg) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
    ];

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return `API Error: ${error.error?.message || "Unknown error"}`;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

  } catch (error) {
    console.error("Fatal Gemini Error:", error);
    return "Connection error. Please try again.";
  }
};