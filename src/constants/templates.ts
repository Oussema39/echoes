type DocumentHtmlTemplateProps = {
  body: string;
  styles?: string;
  title?: string;
};

export const documentHtmlTemplate = ({
  body,
  styles,
  title,
}: DocumentHtmlTemplateProps) =>
  `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
            ${title ? `<title>${title}</title>` : ""}
            ${styles ? `<style>${styles}</style>` : ""}
        </head>
        <body>
            <div id="content">${body}</div>
        </body>
    </html>
`;
