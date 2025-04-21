export const generateParaphrasePrompt = (text: string) => {
  return `Paraphrase the following text without adding introductions or conclusions. Output only the paraphrased text:
  "${text}"`;
};
export const generateShortenPrompt = (text: string) => {
  // const content = `Paraphrase the following text to make it clearer and more natural, while preserving its original meaning and tone: ${text}`;
  const content = `Shorten the following text: ${text}`;
  return content;
};
