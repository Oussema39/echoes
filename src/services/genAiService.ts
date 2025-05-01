import {
  File,
  GenerateContentResponse,
  GoogleGenAI,
  UploadFileConfig,
} from "@google/genai";
import { IGenerateContentProps } from "../interface/IGenerateContentProps";

const GEMINI_API_KEY = process.env.GEMINI_FLASH_API_KEY;

export class GenAiService {
  private ai: GoogleGenAI;
  private defaultModel = "gemini-2.0-flash";

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async uploadFile(file: string, config?: UploadFileConfig): Promise<File> {
    const response = await this.ai.files.upload({
      file,
      config,
    });
    return response;
  }

  async generateContent({
    contents,
    model = this.defaultModel,
    file,
    fileConfig,
  }: IGenerateContentProps): Promise<GenerateContentResponse> {
    if (file) {
      await this.uploadFile(file, fileConfig);
    }

    const response = await this.ai.models.generateContent({ model, contents });
    return response;
  }

  async generateContentStream({
    contents,
    model = this.defaultModel,
    file,
    fileConfig,
  }: IGenerateContentProps): Promise<AsyncGenerator<GenerateContentResponse>> {
    if (file) {
      await this.uploadFile(file, fileConfig);
    }
    const response = await this.ai.models.generateContentStream({
      model,
      contents,
    });
    return response;
  }
}

export default new GenAiService(GEMINI_API_KEY);
