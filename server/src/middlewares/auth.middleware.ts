import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { Role } from "../enums/role.enum";
import { ApiError } from "../utils/api-error";

interface TokenPayload extends JwtPayload {
  id: string;
  role: Role;
}

export class AuthMiddleware {
  public static protect(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(new ApiError(401, "Token manquant ou invalide"));
    }

    const token = header.split(" ")[1];
    if (!token) {
      return next(new ApiError(401, "Token manquant"));
    }

    try {
      const decoded = jwt.verify(token, env.jwtSecret) as unknown;
      const payload = decoded as TokenPayload;
      if (!payload.id || !payload.role) {
        return next(new ApiError(401, "Contenu du token invalide"));
      }
      req.user = { id: payload.id, role: payload.role };
      next();
    } catch {
      next(new ApiError(401, "Token invalide ou expire"));
    }
  }
}
