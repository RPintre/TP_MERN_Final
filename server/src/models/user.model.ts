import mongoose, { Document, Schema } from "mongoose";
import { Role } from "../enums/role.enum";

export interface IUser extends Document {
  prenom: string;
  nom: string;
  email: string;
  motDePasse: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    prenom: { type: String, required: true, trim: true },
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    motDePasse: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: Object.values(Role), default: Role.ADHERENT },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
