const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const generateInterviewResponse = async (history, userData) => {
  try {
    const systemInstruction = `
You are a professional ${userData.type} interviewer for a ${userData.jobTitle} position.
Context (Job Description): ${userData.jd}

Rules:
1. Ask only one question at a time.
2. Give short feedback before next question.
3. After 5-6 questions, give final evaluation with score.
`;

    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction }],
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
        },
      }),
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates.length) {
      throw new Error("No response from Gemini");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate a response.";
  }
};