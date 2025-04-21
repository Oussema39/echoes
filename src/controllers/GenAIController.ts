import { RequestHandler } from "express";
import Joi from "joi";
import GenAi from "../services/genAiService";
import { generateParaphrasePrompt } from "../utils/prompts";
import { formatValidationError } from "../helpers/errors";
import { initSSE } from "../utils/helpers";

const streamSessions = new Map<string, string>();

export const initStream: RequestHandler = async (req, res) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json(formatValidationError(error));
  }

  const { text } = value;
  const streamId = crypto.randomUUID();

  const prompt = generateParaphrasePrompt(text);
  streamSessions.set(streamId, prompt);

  return res.status(200).json({ streamId });
};

export const generateStream: RequestHandler = async (req, res) => {
  const { streamId } = req.query as { streamId: string };

  if (!streamId || !streamSessions.has(streamId)) {
    return res.status(400).json({ error: "Invalid or expired streamId" });
  }

  const prompt = streamSessions.get(streamId)!;
  streamSessions.delete(streamId);

  initSSE(res);

  try {
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
    console.error("[streamWithSSE] Error:", message);
    res.write(`event: error\ndata: ${JSON.stringify(message)}\n\n`);
    res.end();
  }
};
