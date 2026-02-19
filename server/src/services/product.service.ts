import { ProductModel } from "../models/product.model";
import { ApiError } from "../utils/api-error";

interface CreateProductInput {
  nom: string;
  description?: string;
  categorie: string;
  stock: number;
}

interface UpdateProductInput {
  nom?: string;
  description?: string;
  categorie?: string;
  stock?: number;
}

export class ProductService {
  public async getAll(categorie?: string) {
    const query = categorie ? { categorie: new RegExp(`^${categorie}$`, "i") } : {};
    return ProductModel.find(query).sort({ createdAt: -1 });
  }

  public async getById(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new ApiError(404, "Produit introuvable");
    }
    return product;
  }

  public async create(payload: CreateProductInput) {
    return ProductModel.create({
      nom: payload.nom,
      description: payload.description,
      categorie: payload.categorie,
      stock: payload.stock,
    });
  }

  public async update(id: string, payload: UpdateProductInput) {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      {
        ...(payload.nom !== undefined ? { nom: payload.nom } : {}),
        ...(payload.description !== undefined ? { description: payload.description } : {}),
        ...(payload.categorie !== undefined ? { categorie: payload.categorie } : {}),
        ...(payload.stock !== undefined ? { stock: payload.stock } : {}),
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new ApiError(404, "Produit introuvable");
    }
    return product;
  }

  public async delete(id: string) {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError(404, "Produit introuvable");
    }
  }
}
