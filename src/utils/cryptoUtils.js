import CryptoJS from "crypto-js";

const secretKey = "my_super_secret_key_123";

export const encryptData = (data) => {
  if (!data) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (cipherText) => {
  if (!cipherText) return null;
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) return null;
  return JSON.parse(decrypted);
};
