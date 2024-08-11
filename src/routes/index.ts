import express from "express";
const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).send("Hello World !");
});

export default router;
