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
            ${title ? `<title>${title}</title>` : ""}
            ${styles ? `<style>${styles}</style>` : ""}
        </head>
        <body>
            <div class="ql-editor ql-container">${body}</div>
        </body>
    </html>
`;
