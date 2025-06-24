/**
 * @function - Random Digit Token Generator
 * @param {number} length - number of numerical characters
 * @return {string}
 */
export const generateRandomDigits = (length: number) => {
  let token = '';
  for (let i = 0; i < length; i++) {
    token += Math.floor(Math.random() * 10);
  }
  return token;
};

/**
 * @function - Random Code Generator
 * @param {number} length - number of characters
 * @return {string}
 */
export const generateRandomCharacters = (length = 6) => {
  const characters =
    'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters[Math.floor(Math.random() * characters.length)];
  }
  return code;
};

export const nanoCharacters =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
