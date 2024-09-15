import { Router, type Router as TRouter } from "express";
import UserRouter from "./UserRoutes";
import AuthRouter from "./AuthRoutes";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router: TRouter = Router();
router.use("/user", isAuthenticated, UserRouter);
router.use("/auth", AuthRouter);

export default router;
