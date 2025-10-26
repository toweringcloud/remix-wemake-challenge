import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function listAvailableModels() {
  try {
    const genAI = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
      apiVersion: "v1",
    });

    console.log("Fetching available models...\n");

    // ✅✅✅ Promise의 결과를 직접 await로 받습니다. ✅✅✅
    const result = await genAI.models.list();

    console.log("--- Models supporting 'generateContent' ---");

    // ✅✅✅ 결과 객체 안의 'models' 배열을 순회합니다. ✅✅✅
    if (result && result.models && Array.isArray(result.models)) {
      for (const model of result.models) {
        if (model.supportedGenerationMethods.includes("generateContent")) {
          console.log(`✅ Model Name: ${model.name}`);
          console.log(`   Display Name: ${model.displayName}`);
          console.log(`   Description: ${model.description}\n`);
        }
      }
      console.log("-------------------------------------------");
      console.log("\n위 목록에 있는 'Model Name' 중 하나를 코드에 사용하세요.");
    } else {
      console.error(
        "Could not retrieve models list correctly. Response:",
        result
      );
    }
  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

listAvailableModels();
