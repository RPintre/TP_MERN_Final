import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { ApiError } from "../utils/api-error";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  public create = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Authentification requise");
    }

    const { articles } = req.body as { articles?: { produitId: string; quantite: number }[] };
    if (!articles || !Array.isArray(articles)) {
      throw new ApiError(400, "articles doit etre un tableau");
    }

    const order = await this.orderService.create({ utilisateurId: req.user.id, articles });
    res.status(201).json(order);
  };

  public getMine = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(401, "Authentification requise");
    }

    const orders = await this.orderService.getMine(req.user.id);
    res.status(200).json(orders);
  };

  public getAll = async (_req: Request, res: Response): Promise<void> => {
    const orders = await this.orderService.getAll();
    res.status(200).json(orders);
  };
}
