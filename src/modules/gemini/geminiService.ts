import { GetFileMimeType } from "@/utils/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GeminiReadoutModel } from "./geminiModel";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const model = gemini.getGenerativeModel({
  model: "gemini-1.5-pro",
});

export async function ReadMeterFromImage(
  imageFilePath: string
): Promise<GeminiReadoutModel> {
  const fileType = GetFileMimeType(imageFilePath);
  const uploadedFile = await fileManager.uploadFile(imageFilePath, {
    mimeType: fileType,
  });
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadedFile.file.mimeType,
        fileUri: uploadedFile.file.uri,
      },
    },
    { text: "Read the numerical measured value on this meter" },
  ]);
  return {
    responseText: result.response.text(),
    fileUrl: uploadedFile.file.uri,
  };
}

export async function TestGenAIRoute() {
  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = "What is google gemini?";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}
