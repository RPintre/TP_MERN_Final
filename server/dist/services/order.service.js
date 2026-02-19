"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
const api_error_1 = require("../utils/api-error");
class OrderService {
    async create(payload) {
        if (!payload.articles.length) {
            throw new api_error_1.ApiError(400, "Les articles de la commande sont obligatoires");
        }
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const orderItems = [];
            for (const item of payload.articles) {
                if (item.quantite < 1) {
                    throw new api_error_1.ApiError(400, "La quantite doit etre au moins egale a 1");
                }
                const product = await product_model_1.ProductModel.findById(item.produitId).session(session);
                if (!product) {
                    throw new api_error_1.ApiError(404, `Produit introuvable: ${item.produitId}`);
                }
                if (product.stock < item.quantite) {
                    throw new api_error_1.ApiError(400, `Stock insuffisant pour ${product.nom}`);
                }
                product.stock -= item.quantite;
                await product.save({ session });
                orderItems.push({
                    produit: product._id,
                    quantite: item.quantite,
                });
            }
            const [order] = await order_model_1.OrderModel.create([
                {
                    utilisateur: payload.utilisateurId,
                    articles: orderItems,
                },
            ], { session });
            if (!order) {
                throw new api_error_1.ApiError(500, "Echec de creation de la commande");
            }
            await session.commitTransaction();
            return order_model_1.OrderModel.findById(order._id).populate("articles.produit");
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async getMine(utilisateurId) {
        return order_model_1.OrderModel.find({ utilisateur: utilisateurId }).populate("articles.produit").sort({ createdAt: -1 });
    }
    async getAll() {
        return order_model_1.OrderModel.find().populate("utilisateur", "-motDePasse").populate("articles.produit").sort({ createdAt: -1 });
    }
}
exports.OrderService = OrderService;
