export const generateParaphrasePrompt = (text: string) => {
  return `Paraphrase the following text without adding introductions or conclusions. Output only the paraphrased text:
  "${text}"`;
};
export const generateShortenPrompt = (text: string) => {
  // const content = `Paraphrase the following text to make it clearer and more natural, while preserving its original meaning and tone: ${text}`;
  const content = `Shorten the following text: ${text}`;
  return content;
};

export const generateStructuredHtmlPrompt = (userPrompt: string) => {
  return `
You are a professional writing assistant that generates fully structured HTML documents for a rich text editor (Quill).

### Task:
${userPrompt}

### Structure:
- One main title (<h1>)
- Multiple section subtitles (<h2>)
- Paragraphs (<p>) under each section
- Use bullet points (<ul><li>) where appropriate
- Emphasize key terms with <strong> or <em>

### HTML Output Rules:
- Use only the following HTML tags: <h1>, <h2>, <p>, <strong>, <em>, <ul>, <li>, <a>, <blockquote>, <code>, <br>
- No inline styles or unsupported tags
- Do not include <style> blocks or external stylesheets
- The HTML must be valid and Quill-compatible
- Return only the final HTML string

### Apply the corresponding CSS classes from the uploaded CSS file
- <h1>: class "title-main"
- <h2>: class "section-heading"
- <p>: class "paragraph"
- <ul>: class "bullet-list"
- <li>: class "bullet-item"
- <blockquote>: class "quote"
- <code>: class "inline-code"

Now, generate the full HTML document.
  `.trim();
};
