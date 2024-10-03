import { Router, type Router as TRouter } from "express";
import UserRouter from "./UserRoutes";
import AuthRouter from "./AuthRoutes";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router: TRouter = Router();
router.use("/user", isAuthenticated, UserRouter);
router.use("/auth", AuthRouter);
router.use("/", (_req, res) => {
  return res.send("Hello there! This echoes's server");
});

export default router;
