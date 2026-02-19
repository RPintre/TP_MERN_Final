import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";

export class ErrorMiddleware {
  public static handle(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({ message: err.message });
      return;
    }

    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ message: err.message });
      return;
    }

    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({ message: "Format d'identifiant invalide" });
      return;
    }

    if (typeof err === "object" && err !== null && "code" in err && (err as { code?: number }).code === 11000) {
      res.status(409).json({ message: "La ressource existe deja" });
      return;
    }

    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
