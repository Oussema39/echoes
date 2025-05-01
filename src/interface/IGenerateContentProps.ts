import { UploadFileConfig } from "@google/genai";

export interface IGenerateContentProps {
  contents: string;
  model?: string;
  file?: string;
  fileConfig?: UploadFileConfig;
}
