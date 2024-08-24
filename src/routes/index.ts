import { Router, type Router as TRouter } from "express";
import UserRouter from "./UserRoutes";

const router: TRouter = Router();
router.use("/user", UserRouter);

export default router;
