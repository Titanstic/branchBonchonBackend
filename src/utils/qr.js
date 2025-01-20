const CryptoJS = require('crypto-js');

const encryptWithAES = (text) => {
    const passphrase = 'bonchon_axra';
    return CryptoJS.AES.encrypt(text, passphrase).toString();
};

const decryptWithAES = (ciphertext) => {
    const passphrase = 'bonchon_axra';
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = { encryptWithAES, decryptWithAES };