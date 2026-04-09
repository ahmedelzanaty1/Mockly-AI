export const generateInterviewResponse = async (history = [], userData) => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";


  // لوج للتأكد من وصول البيانات (هتظهر في كونسول المتصفح)
  console.log("--- Gemini Service Debug ---");
  console.log("API Key Exists:", !!API_KEY);
  console.log("User Data Received:", userData);

  try {
    if (!API_KEY) {
      return "Error: The API Key is not found in Vercel settings.";
    }

    // التحقق من وجود البيانات المطلوبة
    if (!userData || !userData.jobTitle) {
      console.error("Validation Failed: userData is incomplete", userData);
      return "Data Error: Missing user information. Please provide all required details.";
    }

    const systemInstruction = `
You are a professional ${userData.type || 'Technical'} interviewer.
Candidate Name: ${userData.name || 'Candidate'}
Role: ${userData.jobTitle}
Job Description: ${userData.jd}

Rules:
1. Ask exactly ONE short question at a time.
2. Provide a very brief feedback on the user's last answer.
3. After 5 questions, provide a final evaluation with:
   - Score: X/10
   - Strengths & Improvements.
4. Keep the conversation professional and focused.
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
        generationConfig: { 
          temperature: 0.7, 
          maxOutputTokens: 800 
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      return `API Error: ${errorData.error?.message || "Something went wrong"}`;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

  } catch (error) {
    console.error("Fatal Error:", error);
    return "error : something went wrong, please try again later.";
  }
};