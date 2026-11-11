const crypto = require('node:crypto');
const secret = process.env.CPF_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('Defina CPF_SECRET com ao menos 32 caracteres no arquivo .env');
}
const key = () => crypto.createHash('sha256').update(secret, 'utf8').digest();
function encrypt(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  return [iv.toString('base64'), cipher.getAuthTag().toString('base64'), data.toString('base64')].join('.');
}
function decrypt(value) {
  if (!value) return '';
  const [iv, tag, data] = value.split('.');
  if (!iv || !tag || !data) return '';
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]).toString('utf8');
  } catch { return ''; }
}
module.exports = { encrypt, decrypt };
