const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export const generateInterviewResponse = async (history = [], userData) => {
  try {
    // 🔥 حماية من crash
    if (!API_KEY) {
      console.error("API KEY is missing");
      return "API key is missing.";
    }

    if (!userData) {
      console.error("userData is missing");
      return "User data is missing.";
    }

    // 🧠 system prompt (مهم يكون واضح ومختصر)
    const systemInstruction = `
You are a professional ${userData.type} interviewer for a ${userData.jobTitle} role.

Context (Job Description):
${userData.jd}

Rules:
- Ask only ONE short question at a time.
- Give very brief feedback before next question.
- After 5 questions, give a final evaluation with score, strengths, and improvements.
- Stay professional and friendly.
`;

    // 🔥 مهم: نحط system + history بشكل صحيح
    const contents = [
      {
        role: "user",
        parts: [{ text: systemInstruction + "\n\nStart the interview." }],
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
          maxOutputTokens: 300,
        },
      }),
    });

    // ❗ مهم جدًا
    if (!response.ok) {
      const errorData = await response.json();
      console.error("HTTP ERROR:", errorData);
      return "API Error: " + (errorData.error?.message || "Unknown error");
    }

    const data = await response.json();

    console.log("Gemini Response:", data);

    // 🔥 حماية من undefined
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error("Empty AI response", data);
      return "AI returned empty response.";
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate a response.";
  }
};