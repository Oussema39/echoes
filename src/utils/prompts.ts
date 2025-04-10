export const generateParaphrasePrompt = (text: string) => {
  const content = `Paraphrase the following text to make it clearer and more natural, while preserving its original meaning and tone:\n\n"${text}"`;
  return content;
};
