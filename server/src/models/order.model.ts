import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrderItem {
  produit: Types.ObjectId;
  quantite: number;
}

export interface IOrder extends Document {
  utilisateur: Types.ObjectId;
  articles: IOrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    produit: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantite: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    utilisateur: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    articles: { type: [orderItemSchema], required: true, validate: [(val: IOrderItem[]) => val.length > 0, "La commande doit contenir au moins un article"] },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
