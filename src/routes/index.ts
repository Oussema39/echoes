import { Router, type Router as TRouter } from "express";
import UserRouter from "./UserRoutes";
import AuthRouter from "./AuthRoutes";

const router: TRouter = Router();
router.use("/user", UserRouter);
router.use("/auth", AuthRouter);

export default router;
