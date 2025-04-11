export const generateParaphrasePrompt = (text: string) => {
  // const content = `Paraphrase the following text to make it clearer and more natural, while preserving its original meaning and tone: ${text}`;
  const content = `paraphrase: ${text}`;
  return content;
};

export const generateShortenPrompt = (text: string) => {
  // const content = `Paraphrase the following text to make it clearer and more natural, while preserving its original meaning and tone: ${text}`;
  const content = `Shorten the following text: ${text}`;
  return content;
};
