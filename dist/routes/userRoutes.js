import { Router } from "express";
import { UserController } from "../controllers/userController.js";
import { tryCatch } from "../utils/try-catch.js";
const router = Router();
const userController = new UserController();
router.post("/register", tryCatch(userController.register));
router.post("/login", tryCatch(userController.login));
export default router;
