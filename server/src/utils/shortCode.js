const crypto = require('crypto');

/**
 * Generate a random URL-friendly short code (default length 7)
 */
const generateShortCode = (length = 7) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const bytes = crypto.randomBytes(length);
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters[bytes[i] % characters.length];
    }
    return code;
};

module.exports = {
    generateShortCode,
};
