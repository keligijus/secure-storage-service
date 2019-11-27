const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const makeKey = key => {
  return crypto
    .createHash("sha256")
    .update(String(key))
    .digest("base64")
    .substr(0, 32);
};

const encrypt = (text, encryption_key) => {
  const key = makeKey(encryption_key);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const decrypt = (textAndIv, decryption_key) => {
  const key = makeKey(decryption_key);
  const iv = Buffer.from(textAndIv.iv, "hex");
  const encryptedText = Buffer.from(textAndIv.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };
