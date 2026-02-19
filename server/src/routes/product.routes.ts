import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../enums/role.enum";
import { asyncHandler } from "../utils/async-handler";

const router = Router();
const controller = new ProductController();

router.get("/", asyncHandler(controller.getAll));
router.get("/:id", asyncHandler(controller.getById));

router.post("/", AuthMiddleware.protect, requireRole(Role.ADMIN), asyncHandler(controller.create));
router.put("/:id", AuthMiddleware.protect, requireRole(Role.ADMIN), asyncHandler(controller.update));
router.delete("/:id", AuthMiddleware.protect, requireRole(Role.ADMIN), asyncHandler(controller.delete));

export default router;

