import { Router } from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/UserController";

const router = Router();

router.get("/", getUsers);
router.post("/", addUser);
router.patch("/", updateUser);
router.delete("/:userId", deleteUser);

export default router;
