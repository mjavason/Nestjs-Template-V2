export function welcomeContent(
  firstName: string,
  email: string,
  code: string,
  expiryInMinutes: number,
) {
  return `
        <p>Hi ${firstName}, welcome to Startup</p>
        <p>
          We’re excited to have you on board with Startup.
        </p>
        <p>
          Simply enter the code below to verify
          <span class="highlight">${email}</span> and complete your
          Startup signup. Once verified, you’ll unlock secure access.
        </p>

        <div class="code-wrapper">
          <div class="code-box">${code}</div>
        </div>

        <div class="note-wrapper">
          <span class="note"
            >⚠️ Email verification code will expire in ${expiryInMinutes} minutes</span
          >
        </div>
`;
}
