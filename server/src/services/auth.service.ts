import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../enums/role.enum";
import { UserModel } from "../models/user.model";
import { ApiError } from "../utils/api-error";

interface RegisterInput {
  prenom: string;
  nom: string;
  email: string;
  motDePasseChiffre: string;
}

interface LoginInput {
  email: string;
  motDePasseChiffre: string;
}

export class AuthService {
  public async register(payload: RegisterInput) {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new ApiError(409, "Cet email est deja utilise");
    }

    const motDePasseHash = await bcrypt.hash(payload.motDePasseChiffre, 10);
    const isFirstUser = (await UserModel.countDocuments()) === 0;

    const user = await UserModel.create({
      prenom: payload.prenom,
      nom: payload.nom,
      email: payload.email.toLowerCase(),
      motDePasse: motDePasseHash,
      role: isFirstUser ? Role.ADMIN : Role.ADHERENT,
    });

    const token = this.generateToken(user.id, user.role);
    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  public async login(payload: LoginInput) {
    const user = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (!user) {
      throw new ApiError(401, "Identifiants invalides");
    }

    const isPasswordValid = await bcrypt.compare(payload.motDePasseChiffre, user.motDePasse);
    if (!isPasswordValid) {
      throw new ApiError(401, "Identifiants invalides");
    }

    const token = this.generateToken(user.id, user.role);
    return {
      token,
      user: this.sanitizeUser(user),
    };
  }

  private generateToken(userId: string, role: Role): string {
    return jwt.sign({ id: userId, role }, env.jwtSecret, { expiresIn: 60 * 60 * 24 * 7 });
  }

  private sanitizeUser(user: { id: string; prenom: string; nom: string; email: string; role: Role }) {
    return {
      id: user.id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
    };
  }
}
