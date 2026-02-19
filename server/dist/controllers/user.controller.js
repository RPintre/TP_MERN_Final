"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const api_error_1 = require("../utils/api-error");
class UserController {
    constructor() {
        this.getAll = async (req, res) => {
            const q = typeof req.query.q === "string" ? req.query.q : undefined;
            const users = await this.userService.getAll(q);
            res.status(200).json(users);
        };
        this.getById = async (req, res) => {
            const user = await this.userService.getById(this.getId(req));
            res.status(200).json(user);
        };
        this.create = async (req, res) => {
            const { prenom, nom, email, motDePasseChiffre, role } = req.body;
            if (!prenom || !nom || !email || !motDePasseChiffre) {
                throw new api_error_1.ApiError(400, "prenom, nom, email et motDePasseChiffre sont obligatoires");
            }
            const user = await this.userService.create({ prenom, nom, email, motDePasseChiffre, role });
            res.status(201).json(user);
        };
        this.update = async (req, res) => {
            const user = await this.userService.update(this.getId(req), req.body);
            res.status(200).json(user);
        };
        this.delete = async (req, res) => {
            await this.userService.delete(this.getId(req));
            res.status(204).send();
        };
        this.userService = new user_service_1.UserService();
    }
    getId(req) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new api_error_1.ApiError(400, "Parametre id invalide");
        }
        return id;
    }
}
exports.UserController = UserController;
