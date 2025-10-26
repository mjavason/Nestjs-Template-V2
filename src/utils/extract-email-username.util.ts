export function extractEmailUsername(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex === -1) {
    throw new Error('Invalid email address');
  }
  return email.slice(0, atIndex);
}
