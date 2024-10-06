import { ENCRYPTION_KEY } from "../config";
import cryptoJs from "crypto-js";


const encrypt = (content) => {
  return cryptoJs.AES.encrypt(content, ENCRYPTION_KEY).toString()
}

const decrypt = (encryptedKey) => {
  const bytes = cryptoJs.AES.decrypt(encryptedKey, ENCRYPTION_KEY)
  const originalText = bytes.toString(cryptoJs.enc.Utf8)
  return originalText
}

const generateID = () => {
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
export default {
  encrypt,
  decrypt,
  generateID,
} 