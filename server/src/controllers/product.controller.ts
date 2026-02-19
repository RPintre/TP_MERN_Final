import { Request, Response } from "express";
import { ProductService } from "../services/product.service";
import { ApiError } from "../utils/api-error";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public getAll = async (req: Request, res: Response): Promise<void> => {
    const categorie = typeof req.query.categorie === "string" ? req.query.categorie : undefined;
    const q = typeof req.query.q === "string" ? req.query.q : undefined;
    const products = await this.productService.getAll(categorie, q);
    res.status(200).json(products);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.getById(this.getId(req));
    res.status(200).json(product);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { nom, categorie, stock, description } = req.body;
    if (!nom || !categorie || stock === undefined) {
      throw new ApiError(400, "nom, categorie et stock sont obligatoires");
    }

    const product = await this.productService.create({ nom, categorie, stock, description });
    res.status(201).json(product);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const product = await this.productService.update(this.getId(req), req.body);
    res.status(200).json(product);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    await this.productService.delete(this.getId(req));
    res.status(204).send();
  };

  private getId(req: Request): string {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      throw new ApiError(400, "Parametre id invalide");
    }
    return id;
  }
}
