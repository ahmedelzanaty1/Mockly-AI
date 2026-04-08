

export const generateInterviewResponse = async (history = [], userData) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

  try {
    if (!API_KEY) {
      console.error("Critical Error: VITE_GEMINI_API_KEY is undefined. Check your .env file.");
      return "Internal Error: API configuration missing.";
    }

    if (!userData || !userData.jobTitle) {
      console.error("userData is missing or incomplete");
      return "User data is required to start the interview.";
    }

    const systemInstruction = `
You are a professional ${userData.type || 'technical'} interviewer.
Role: ${userData.jobTitle}
Context (JD): ${userData.jd || 'General professional interview'}

Rules:
- Ask only ONE short, relevant question at a time.
- Provide a very brief feedback (praising or clarifying) before the next question.
- After exactly 5 questions, provide a final evaluation:
  * Score: X/10
  * Strengths: [Bullet points]
  * Areas for improvement: [Bullet points]
- Maintain a professional and encouraging tone.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: `System Instructions: ${systemInstruction}\n\nProceed with the interview now.` }],
      },
      ...history.map((msg) => ({
        role: msg.role === "ai" ? "model" : "user",
        parts: [{ text: msg.text }],
      })),
    ];

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500, 
          topP: 0.9,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API HTTP Error:", errorData);
      return `Error: ${errorData.error?.message || "Failed to connect to AI"}`;
    }

    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Unexpected API Response Format:", data);
      return "The AI couldn't generate a response. Please try again.";
    }

    return responseText;

  } catch (error) {
    console.error("Unexpected Error in generateInterviewResponse:", error);
    return "Something went wrong. Please check your connection.";
  }
};