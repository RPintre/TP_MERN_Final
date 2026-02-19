"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order.service");
const api_error_1 = require("../utils/api-error");
class OrderController {
    constructor() {
        this.create = async (req, res) => {
            if (!req.user) {
                throw new api_error_1.ApiError(401, "Authentification requise");
            }
            const { articles } = req.body;
            if (!articles || !Array.isArray(articles)) {
                throw new api_error_1.ApiError(400, "articles doit etre un tableau");
            }
            const order = await this.orderService.create({ utilisateurId: req.user.id, articles });
            res.status(201).json(order);
        };
        this.getMine = async (req, res) => {
            if (!req.user) {
                throw new api_error_1.ApiError(401, "Authentification requise");
            }
            const orders = await this.orderService.getMine(req.user.id);
            res.status(200).json(orders);
        };
        this.getAll = async (_req, res) => {
            const orders = await this.orderService.getAll();
            res.status(200).json(orders);
        };
        this.orderService = new order_service_1.OrderService();
    }
}
exports.OrderController = OrderController;
