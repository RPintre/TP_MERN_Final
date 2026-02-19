import mongoose from "mongoose";
import { OrderModel } from "../models/order.model";
import { ProductModel } from "../models/product.model";
import { ApiError } from "../utils/api-error";

interface OrderItemInput {
  produitId: string;
  quantite: number;
}

interface CreateOrderInput {
  utilisateurId: string;
  articles: OrderItemInput[];
}

export class OrderService {
  public async create(payload: CreateOrderInput) {
    if (!payload.articles.length) {
      throw new ApiError(400, "Les articles de la commande sont obligatoires");
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orderItems = [];

      for (const item of payload.articles) {
        if (item.quantite < 1) {
          throw new ApiError(400, "La quantite doit etre au moins egale a 1");
        }

        const product = await ProductModel.findById(item.produitId).session(session);
        if (!product) {
          throw new ApiError(404, `Produit introuvable: ${item.produitId}`);
        }

        if (product.stock < item.quantite) {
          throw new ApiError(400, `Stock insuffisant pour ${product.nom}`);
        }

        product.stock -= item.quantite;
        await product.save({ session });

        orderItems.push({
          produit: product._id,
          quantite: item.quantite,
        });
      }

      const [order] = await OrderModel.create(
        [
          {
            utilisateur: payload.utilisateurId,
            articles: orderItems,
          },
        ],
        { session }
      );
      if (!order) {
        throw new ApiError(500, "Echec de creation de la commande");
      }

      await session.commitTransaction();
      return OrderModel.findById(order._id).populate("articles.produit");
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  public async getMine(utilisateurId: string) {
    return OrderModel.find({ utilisateur: utilisateurId }).populate("articles.produit").sort({ createdAt: -1 });
  }

  public async getAll() {
    return OrderModel.find().populate("utilisateur", "-motDePasse").populate("articles.produit").sort({ createdAt: -1 });
  }
}
