import bcrypt from "bcryptjs";
import { Role } from "../enums/role.enum";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/api-error";

interface CreateUserInput {
  prenom: string;
  nom: string;
  email: string;
  motDePasseChiffre: string;
  role?: Role;
}

interface UpdateUserInput {
  prenom?: string;
  nom?: string;
  email?: string;
  motDePasseChiffre?: string;
  role?: Role;
}

export class UserService {
  public async getAll() {
    return UserModel.find().select("-motDePasse").sort({ createdAt: -1 });
  }

  public async getById(id: string) {
    const user = await UserModel.findById(id).select("-motDePasse");
    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }
    return user;
  }

  public async create(payload: CreateUserInput) {
    const exists = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (exists) {
      throw new ApiError(409, "Cet email est deja utilise");
    }

    const motDePasseHash = await bcrypt.hash(payload.motDePasseChiffre, 10);
    const user = await UserModel.create({
      prenom: payload.prenom,
      nom: payload.nom,
      email: payload.email.toLowerCase(),
      motDePasse: motDePasseHash,
      role: payload.role ?? Role.ADHERENT,
    });
    return UserModel.findById(user.id).select("-motDePasse");
  }

  public async update(id: string, payload: UpdateUserInput) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }

    if (payload.email && payload.email !== user.email) {
      const exists = await UserModel.findOne({ email: payload.email.toLowerCase() });
      if (exists && exists.id !== id) {
        throw new ApiError(409, "Cet email est deja utilise");
      }
      user.email = payload.email.toLowerCase();
    }

    if (payload.prenom !== undefined) user.prenom = payload.prenom;
    if (payload.nom !== undefined) user.nom = payload.nom;
    if (payload.role !== undefined) user.role = payload.role;
    if (payload.motDePasseChiffre) {
      user.motDePasse = await bcrypt.hash(payload.motDePasseChiffre, 10);
    }

    await user.save();
    return UserModel.findById(id).select("-motDePasse");
  }

  public async delete(id: string) {
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new ApiError(404, "Utilisateur introuvable");
    }
  }
}
