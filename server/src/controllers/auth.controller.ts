import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiError } from "../utils/api-error";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const { prenom, nom, email, motDePasseChiffre } = req.body;
    if (!prenom || !nom || !email || !motDePasseChiffre) {
      throw new ApiError(400, "prenom, nom, email et motDePasseChiffre sont obligatoires");
    }

    const result = await this.authService.register({ prenom, nom, email, motDePasseChiffre });
    res.status(201).json(result);
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const { email, motDePasseChiffre } = req.body;
    if (!email || !motDePasseChiffre) {
      throw new ApiError(400, "email et motDePasseChiffre sont obligatoires");
    }

    const result = await this.authService.login({ email, motDePasseChiffre });
    res.status(200).json(result);
  };
}
