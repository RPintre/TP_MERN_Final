"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const role_enum_1 = require("../enums/role.enum");
const user_model_1 = require("../models/user.model");
const api_error_1 = require("../utils/api-error");
class UserService {
    async getAll() {
        return user_model_1.UserModel.find().select("-motDePasse").sort({ createdAt: -1 });
    }
    async getById(id) {
        const user = await user_model_1.UserModel.findById(id).select("-motDePasse");
        if (!user) {
            throw new api_error_1.ApiError(404, "Utilisateur introuvable");
        }
        return user;
    }
    async create(payload) {
        const exists = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
        if (exists) {
            throw new api_error_1.ApiError(409, "Cet email est deja utilise");
        }
        const motDePasseHash = await bcryptjs_1.default.hash(payload.motDePasseChiffre, 10);
        const user = await user_model_1.UserModel.create({
            prenom: payload.prenom,
            nom: payload.nom,
            email: payload.email.toLowerCase(),
            motDePasse: motDePasseHash,
            role: payload.role ?? role_enum_1.Role.ADHERENT,
        });
        return user_model_1.UserModel.findById(user.id).select("-motDePasse");
    }
    async update(id, payload) {
        const user = await user_model_1.UserModel.findById(id);
        if (!user) {
            throw new api_error_1.ApiError(404, "Utilisateur introuvable");
        }
        if (payload.email && payload.email !== user.email) {
            const exists = await user_model_1.UserModel.findOne({ email: payload.email.toLowerCase() });
            if (exists && exists.id !== id) {
                throw new api_error_1.ApiError(409, "Cet email est deja utilise");
            }
            user.email = payload.email.toLowerCase();
        }
        if (payload.prenom !== undefined)
            user.prenom = payload.prenom;
        if (payload.nom !== undefined)
            user.nom = payload.nom;
        if (payload.role !== undefined)
            user.role = payload.role;
        if (payload.motDePasseChiffre) {
            user.motDePasse = await bcryptjs_1.default.hash(payload.motDePasseChiffre, 10);
        }
        await user.save();
        return user_model_1.UserModel.findById(id).select("-motDePasse");
    }
    async delete(id) {
        const user = await user_model_1.UserModel.findByIdAndDelete(id);
        if (!user) {
            throw new api_error_1.ApiError(404, "Utilisateur introuvable");
        }
    }
}
exports.UserService = UserService;
