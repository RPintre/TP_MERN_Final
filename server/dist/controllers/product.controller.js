"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const api_error_1 = require("../utils/api-error");
class ProductController {
    constructor() {
        this.getAll = async (req, res) => {
            const categorie = typeof req.query.categorie === "string" ? req.query.categorie : undefined;
            const q = typeof req.query.q === "string" ? req.query.q : undefined;
            const products = await this.productService.getAll(categorie, q);
            res.status(200).json(products);
        };
        this.getById = async (req, res) => {
            const product = await this.productService.getById(this.getId(req));
            res.status(200).json(product);
        };
        this.create = async (req, res) => {
            const { nom, categorie, stock, description } = req.body;
            if (!nom || !categorie || stock === undefined) {
                throw new api_error_1.ApiError(400, "nom, categorie et stock sont obligatoires");
            }
            const product = await this.productService.create({ nom, categorie, stock, description });
            res.status(201).json(product);
        };
        this.update = async (req, res) => {
            const product = await this.productService.update(this.getId(req), req.body);
            res.status(200).json(product);
        };
        this.delete = async (req, res) => {
            await this.productService.delete(this.getId(req));
            res.status(204).send();
        };
        this.productService = new product_service_1.ProductService();
    }
    getId(req) {
        const id = req.params.id;
        if (!id || Array.isArray(id)) {
            throw new api_error_1.ApiError(400, "Parametre id invalide");
        }
        return id;
    }
}
exports.ProductController = ProductController;
