"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const role_enum_1 = require("../enums/role.enum");
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../utils/api-error");
class AuthService {
    async register(payload) {
        const existing = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
        if (existing) {
            throw new api_error_1.ApiError(409, "Cet email est deja utilise");
        }
        const motDePasseHash = await bcryptjs_1.default.hash(payload.motDePasseChiffre, 10);
        const isFirstUser = (await user_model_1.UserModel.countDocuments()) === 0;
        const user = await user_model_1.UserModel.create({
            prenom: payload.prenom,
            nom: payload.nom,
            email: payload.email.toLowerCase(),
            motDePasse: motDePasseHash,
            role: isFirstUser ? role_enum_1.Role.ADMIN : role_enum_1.Role.ADHERENT,
        });
        const token = this.generateToken(user.id, user.role);
        return {
            token,
            user: this.sanitizeUser(user),
        };
    }
    async login(payload) {
        const user = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
        if (!user) {
            throw new api_error_1.ApiError(401, "Identifiants invalides");
        }
        const isPasswordValid = await bcryptjs_1.default.compare(payload.motDePasseChiffre, user.motDePasse);
        if (!isPasswordValid) {
            throw new api_error_1.ApiError(401, "Identifiants invalides");
        }
        const token = this.generateToken(user.id, user.role);
        return {
            token,
            user: this.sanitizeUser(user),
        };
    }
    generateToken(userId, role) {
        return jsonwebtoken_1.default.sign({ id: userId, role }, env_1.env.jwtSecret, { expiresIn: 60 * 60 * 24 * 7 });
    }
    sanitizeUser(user) {
        return {
            id: user.id,
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            role: user.role,
        };
    }
}
exports.AuthService = AuthService;
