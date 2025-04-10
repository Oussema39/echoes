import { Router, type Router as TRouter } from "express";
import UserRouter from "./UserRoutes";
import DocumentRouter from "./DocumentRoutes";
import AuthRouter from "./AuthRoutes";
import AIRouter from "./AIRoutes";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router: TRouter = Router();
router.use("/user", isAuthenticated, UserRouter);
router.use("/document", isAuthenticated, DocumentRouter);
router.use("/auth", AuthRouter);
router.use("/ai", AIRouter);
router.use("/", (_req, res) => {
  return res.send("Hello there! This echoes's server");
});

export default router;
