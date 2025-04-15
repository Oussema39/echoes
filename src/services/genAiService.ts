import { GenerateContentResponse, GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_FLASH_API_KEY;

export class GenAiService {
  private ai: GoogleGenAI;
  private defaultModel = "gemini-2.0-flash";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateContent(
    contents: string,
    model: string = this.defaultModel
  ): Promise<GenerateContentResponse> {
    const response = await this.ai.models.generateContent({ model, contents });
    return response;
  }

  async generateContentStream(
    contents: string,
    model: string = this.defaultModel
  ): Promise<AsyncGenerator<GenerateContentResponse>> {
    const response = await this.ai.models.generateContentStream({
      model,
      contents,
    });
    return response;
  }
}

export default new GenAiService(GEMINI_API_KEY);
