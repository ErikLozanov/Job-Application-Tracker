import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log("🔑 Testing API Key:", apiKey ? apiKey.substring(0, 10) + "..." : "UNDEFINED");

async function check() {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", JSON.stringify(data.error, null, 2));
    } else if (data.models) {
      console.log("✅ SUCCESS! Here are your available models:");
      // Filter for 'generateContent' capable models
      const chatModels = data.models
        .filter(m => m.supportedGenerationMethods.includes("generateContent"))
        .map(m => m.name.replace("models/", "")); // Remove the 'models/' prefix for cleaner reading
      
      console.log(chatModels);
    } else {
      console.log("⚠️ No models found. This is unusual.");
      console.log(data);
    }
  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

check();