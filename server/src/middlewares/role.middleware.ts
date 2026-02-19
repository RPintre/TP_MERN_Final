import { NextFunction, Request, Response } from "express";
import { Role } from "../enums/role.enum";
import { ApiError } from "../utils/api-error";

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, "Authentification requise"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, "Permissions insuffisantes"));
    }

    next();
  };
