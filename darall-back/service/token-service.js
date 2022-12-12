"use strict";
exports.__esModule = true;
exports.generateTokens = void 0;
var jwt = require('jsonwebtoken');
var secretKey = process.env.SECRET_KEY;
var refreshSecretKey = process.env.REFRESH_SECRET_KEY;
function generateTokens(payload) {
    var accessToken = jwt.sign(payload, secretKey, { expiresIn: 60 * 60 });
    var refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: 60 * 60 * 24 });
    return {
        accessToken: accessToken,
        refreshToken: refreshToken
    };
}
exports.generateTokens = generateTokens;
