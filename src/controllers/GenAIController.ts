import { RequestHandler, Response } from "express";
import Joi from "joi";
import GenAi from "../services/genAiService";
import { generateParaphrasePrompt } from "../utils/prompts";
import { formatValidationError } from "../helpers/errors";

const schema = Joi.object({
  text: Joi.string().required(),
});

const initSSE = (res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
};

export const generateStream: RequestHandler = async (req, res) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json(formatValidationError(error));
  }

  const { text } = value;

  initSSE(res);

  try {
    const prompt = generateParaphrasePrompt(text);
    const stream = await GenAi.generateContentStream(prompt);

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${chunk.text}\n\n`);
      }
    }

    res.write("event: end\ndata: done\n\n");
    res.end();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error";
    console.error("[generateStream] Error:", message);
    res.write(`event: error\ndata: ${JSON.stringify(message)}\n\n`);
    res.end();
  }
};
