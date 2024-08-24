import { Router } from "express";
import { addUser } from "../controllers/UserController";

const router = Router();

router.post("/", addUser);

export default router;
