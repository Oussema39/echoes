import { RequestHandler } from "express";
import Joi from "joi";
import { formatValidationError } from "../helpers/errors";
import { httpClient } from "../config/axios";
import {
  generateParaphrasePrompt,
  generateShortenPrompt,
} from "../utils/prompts";
import { HF_MODELS_ENDPOINTS } from "../constants/hfModels";

export const paraphrase: RequestHandler = async (req, res) => {
  try {
    const { text } = req.body;

    const schema = Joi.object({
      text: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(formatValidationError(error));
    }

    const payload = { inputs: generateParaphrasePrompt(text) };

    const response = await httpClient.post(
      HF_MODELS_ENDPOINTS.PARAPHRASE,
      payload
    );

    const paraphrased = response.data[0]?.generated_text || null;

    return res.status(200).json({ data: paraphrased });
  } catch (error: any) {
    console.error("HuggingFace Error:", error.message);
    res
      .status(500)
      .json({ error: "Something went wrong with HF Paraphrase API" });
  }
};

export const shorten: RequestHandler = async (req, res) => {
  try {
    const { text } = req.body;

    const schema = Joi.object({
      text: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(formatValidationError(error));
    }

    const payload = { inputs: generateShortenPrompt(text) };

    const response = await httpClient.post(
      HF_MODELS_ENDPOINTS.SHORTEN,
      payload
    );

    const shortened = response.data[0]?.generated_text || null;

    return res.status(200).json({ data: shortened });
  } catch (error: any) {
    console.error("HuggingFace Error:", error.message);
    res.status(500).json({ error: "Something went wrong with HF Shorten API" });
  }
};

export const correct: RequestHandler = async (req, res) => {
  try {
    const { text } = req.body;

    const schema = Joi.object({
      text: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json(formatValidationError(error));
    }

    const payload = { inputs: text };

    const response = await httpClient.post(
      HF_MODELS_ENDPOINTS.CORRECT,
      payload
    );

    const corrected = response.data[0]?.generated_text || null;

    return res.status(200).json({ data: corrected });
  } catch (error: any) {
    console.error("HuggingFace Error:", error.message);
    res.status(500).json({ error: "Something went wrong with HF correct API" });
  }
};
