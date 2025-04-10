import { RequestHandler } from "express";
import Joi from "joi";
import { formatValidationError } from "../helpers/errors";
import { openAiApiConfig } from "../config/openaiApi";
import { generateParaphrasePrompt } from "../utils/prompts";
import { httpClient } from "../config/axios";

export const paraphrase: RequestHandler = async (req, res) => {
  const { text } = req.body;

  const schema = Joi.object({
    text: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(formatValidationError(error));
  }

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const response = await httpClient.post("/completions", {
      ...openAiApiConfig,
      messages: [
        {
          role: "user",
          content: generateParaphrasePrompt(text),
        },
      ],
    });

    const paraphrased = response.data.choices[0].message.content.trim();
    res.json({ paraphrased });
  } catch (error: any) {
    console.error("OpenAI Error:", error.message);
    res.status(500).json({ error: "Something went wrong with OpenAI API" });
  }
};
