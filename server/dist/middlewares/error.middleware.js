"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const api_error_1 = require("../utils/api-error");
class ErrorMiddleware {
    static handle(err, _req, res, _next) {
        if (err instanceof api_error_1.ApiError) {
            res.status(err.statusCode).json({ message: err.message });
            return;
        }
        if (err instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({ message: err.message });
            return;
        }
        if (err instanceof mongoose_1.default.Error.CastError) {
            res.status(400).json({ message: "Format d'identifiant invalide" });
            return;
        }
        if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
            res.status(409).json({ message: "La ressource existe deja" });
            return;
        }
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
exports.ErrorMiddleware = ErrorMiddleware;
