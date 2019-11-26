const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const iv = crypto.randomBytes(16);

const encrypt = (text, encryption_key) => {
  const key = crypto
    .createHash("sha256")
    .update(String(encryption_key))
    .digest("base64")
    .substr(0, 32);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
};

const decrypt = (text, decryption_key) => {
  const key = crypto
    .createHash("sha256")
    .update(String(decryption_key))
    .digest("base64")
    .substr(0, 32);
  const iv = Buffer.from(text.iv, "hex");
  const encryptedText = Buffer.from(text.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };
