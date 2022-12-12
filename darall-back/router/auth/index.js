"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require('express');
var prismaInstance_1 = require("../../prisma/prismaInstance");
var errorHandler_1 = require("../../helpers/errorHandler");
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var generateTokens = require('../../service/token-service').generateTokens;
var auth = express.Router();
auth.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, candidate, sendError, passResult, _b, accessToken, refreshToken;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                return [4 /*yield*/, prismaInstance_1["default"].user.findUnique({
                        where: {
                            login: login
                        }
                    })];
            case 1:
                candidate = _d.sent();
                sendError = function () {
                    return res
                        .status(401)
                        .send({
                        message: 'Неверный логин/пароль',
                        success: false
                    });
                };
                if (candidate) {
                    passResult = bcrypt.compareSync(password, candidate.password);
                    if (passResult) {
                        _b = generateTokens({
                            login: candidate.login,
                            userId: candidate.id
                        }), accessToken = _b.accessToken, refreshToken = _b.refreshToken;
                        res.status(200).
                            send((_c = {},
                            _c['access_token'] = accessToken,
                            _c['refresh_token'] = refreshToken,
                            _c.success = true,
                            _c.message = 'Авторизация прошла успешно',
                            _c));
                    }
                    else {
                        sendError();
                    }
                }
                else {
                    sendError();
                }
                return [2 /*return*/];
        }
    });
}); });
auth.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, candidate, salt, pass;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password;
                return [4 /*yield*/, prismaInstance_1["default"].user.findUnique({
                        where: {
                            login: login
                        }
                    })];
            case 1:
                candidate = _b.sent();
                if (!candidate) return [3 /*break*/, 2];
                res
                    .status(409)
                    .send({
                    success: false,
                    message: 'Пользователь с данным login уже существует'
                });
                return [3 /*break*/, 4];
            case 2:
                salt = bcrypt.genSaltSync(10);
                pass = bcrypt.hashSync(password, salt);
                return [4 /*yield*/, prismaInstance_1["default"].user.create({
                        data: {
                            login: login,
                            password: pass
                        }
                    })
                        .then(function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    res.
                                        status(201).
                                        send({
                                        success: true,
                                        message: 'User saved successfully'
                                    });
                                    return [4 /*yield*/, prismaInstance_1["default"].$disconnect()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })["catch"](function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, (0, errorHandler_1["default"])(res)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
auth.get('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshSecretKey, refreshToken, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                refreshSecretKey = process.env.REFRESH_SECRET_KEY;
                refreshToken = req.headers['x-refresh-token'];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 2, , 4]);
                jwt.verify(refreshToken, refreshSecretKey, function (err, decoded) {
                    return __awaiter(this, void 0, void 0, function () {
                        var login, userId, user, _a, accessToken, refreshToken_1;
                        var _b;
                        var _this = this;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (err) {
                                        console.error(err);
                                        res.status(401).
                                            send({
                                            success: false,
                                            message: 'Неавторизованный пользователь'
                                        });
                                    }
                                    login = decoded.login, userId = decoded.userId;
                                    return [4 /*yield*/, prismaInstance_1["default"].user.findUnique({
                                            where: {
                                                id: userId
                                            }
                                        })["catch"](function (e) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, (0, errorHandler_1["default"])(res)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    user = _c.sent();
                                    if (user) {
                                        _a = generateTokens({
                                            login: login,
                                            userId: userId
                                        }), accessToken = _a.accessToken, refreshToken_1 = _a.refreshToken;
                                        res.status(200).
                                            send((_b = {},
                                            _b['access_token'] = accessToken,
                                            _b['refresh_token'] = refreshToken_1,
                                            _b.success = true,
                                            _b.message = 'Токены обновлены',
                                            _b));
                                    }
                                    else {
                                        res.status(401).send({
                                            success: false,
                                            message: 'Пользователь не найден'
                                        });
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    });
                });
                return [3 /*break*/, 4];
            case 2:
                e_1 = _a.sent();
                return [4 /*yield*/, (0, errorHandler_1["default"])(res)];
            case 3:
                _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = auth;
