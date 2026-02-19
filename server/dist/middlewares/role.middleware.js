"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const api_error_1 = require("../utils/api-error");
const requireRole = (...roles) => (req, _res, next) => {
    if (!req.user) {
        return next(new api_error_1.ApiError(401, "Authentification requise"));
    }
    if (!roles.includes(req.user.role)) {
        return next(new api_error_1.ApiError(403, "Permissions insuffisantes"));
    }
    next();
};
exports.requireRole = requireRole;
