"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const api_error_1 = require("../utils/api-error");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            const { prenom, nom, email, motDePasseChiffre } = req.body;
            if (!prenom || !nom || !email || !motDePasseChiffre) {
                throw new api_error_1.ApiError(400, "prenom, nom, email et motDePasseChiffre sont obligatoires");
            }
            const result = await this.authService.register({ prenom, nom, email, motDePasseChiffre });
            res.status(201).json(result);
        };
        this.login = async (req, res) => {
            const { email, motDePasseChiffre } = req.body;
            if (!email || !motDePasseChiffre) {
                throw new api_error_1.ApiError(400, "email et motDePasseChiffre sont obligatoires");
            }
            const result = await this.authService.login({ email, motDePasseChiffre });
            res.status(200).json(result);
        };
        this.authService = new auth_service_1.AuthService();
    }
}
exports.AuthController = AuthController;
