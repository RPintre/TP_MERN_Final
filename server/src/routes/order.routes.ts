import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../enums/role.enum";
import { asyncHandler } from "../utils/async-handler";

const router = Router();
const controller = new OrderController();

router.use(AuthMiddleware.protect);

router.post("/", asyncHandler(controller.create));
router.get("/mine", asyncHandler(controller.getMine));
router.get("/", requireRole(Role.ADMIN), asyncHandler(controller.getAll));

export default router;

