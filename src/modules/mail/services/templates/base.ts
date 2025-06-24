export function baseTemplate(firstName: string, textBody: string) {
  return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    padding: 20px;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    margin: auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                }
                .header {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                .content {
                    font-size: 16px;
                    line-height: 1.5;
                }
                .footer {
                    font-size: 12px;
                    color: #777777;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Hello ${firstName},</div>
                <div class="content">
                    ${textBody}
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} startup. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}
