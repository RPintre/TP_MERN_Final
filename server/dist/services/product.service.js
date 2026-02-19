"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_model_1 = require("../models/product.model");
const api_error_1 = require("../utils/api-error");
const regex_1 = require("../utils/regex");
class ProductService {
    async getAll(categorie, q) {
        const query = {};
        if (categorie) {
            query.categorie = new RegExp(`^${(0, regex_1.escapeRegex)(categorie)}$`, "i");
        }
        if (q && q.trim()) {
            const texte = new RegExp((0, regex_1.escapeRegex)(q.trim()), "i");
            query.$or = [{ nom: texte }, { description: texte }, { categorie: texte }];
        }
        return product_model_1.ProductModel.find(query).sort({ createdAt: -1 });
    }
    async getById(id) {
        const product = await product_model_1.ProductModel.findById(id);
        if (!product) {
            throw new api_error_1.ApiError(404, "Produit introuvable");
        }
        return product;
    }
    async create(payload) {
        return product_model_1.ProductModel.create({
            nom: payload.nom,
            description: payload.description,
            categorie: payload.categorie,
            stock: payload.stock,
        });
    }
    async update(id, payload) {
        const product = await product_model_1.ProductModel.findByIdAndUpdate(id, {
            ...(payload.nom !== undefined ? { nom: payload.nom } : {}),
            ...(payload.description !== undefined ? { description: payload.description } : {}),
            ...(payload.categorie !== undefined ? { categorie: payload.categorie } : {}),
            ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
        }, { new: true, runValidators: true });
        if (!product) {
            throw new api_error_1.ApiError(404, "Produit introuvable");
        }
        return product;
    }
    async delete(id) {
        const product = await product_model_1.ProductModel.findByIdAndDelete(id);
        if (!product) {
            throw new api_error_1.ApiError(404, "Produit introuvable");
        }
    }
}
exports.ProductService = ProductService;
