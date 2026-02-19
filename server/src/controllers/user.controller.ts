import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ApiError } from "../utils/api-error";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getAll();
    res.status(200).json(users);
  };

  public getById = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getById(this.getId(req));
    res.status(200).json(user);
  };

  public create = async (req: Request, res: Response): Promise<void> => {
    const { prenom, nom, email, motDePasseChiffre, role } = req.body;
    if (!prenom || !nom || !email || !motDePasseChiffre) {
      throw new ApiError(400, "prenom, nom, email et motDePasseChiffre sont obligatoires");
    }

    const user = await this.userService.create({ prenom, nom, email, motDePasseChiffre, role });
    res.status(201).json(user);
  };

  public update = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.update(this.getId(req), req.body);
    res.status(200).json(user);
  };

  public delete = async (req: Request, res: Response): Promise<void> => {
    await this.userService.delete(this.getId(req));
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
