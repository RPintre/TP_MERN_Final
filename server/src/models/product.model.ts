import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  nom: string;
  description?: string;
  categorie: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    nom: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    categorie: { type: String, required: true, trim: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model<IProduct>("Product", productSchema);
