const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

export function generateTokens(payload) {
      const accessToken = jwt.sign(
        payload,
        secretKey,
        {expiresIn: 60 * 60 });

      const refreshToken = jwt.sign(
        payload,
        refreshSecretKey,
        {expiresIn: 60 * 60 * 24 });

      return {
        accessToken,
        refreshToken
      }
    }
