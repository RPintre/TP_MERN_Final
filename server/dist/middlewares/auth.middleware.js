"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const api_error_1 = require("../utils/api-error");
class AuthMiddleware {
    static protect(req, _res, next) {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return next(new api_error_1.ApiError(401, "Token manquant ou invalide"));
        }
        const token = header.split(" ")[1];
        if (!token) {
            return next(new api_error_1.ApiError(401, "Token manquant"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
            const payload = decoded;
            if (!payload.id || !payload.role) {
                return next(new api_error_1.ApiError(401, "Contenu du token invalide"));
            }
            req.user = { id: payload.id, role: payload.role };
            next();
        }
        catch {
            next(new api_error_1.ApiError(401, "Token invalide ou expire"));
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
