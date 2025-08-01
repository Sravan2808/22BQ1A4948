import { customAlphabet } from 'nanoid';

export const generateShortCode = () => {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 7);
  return nanoid();
};
