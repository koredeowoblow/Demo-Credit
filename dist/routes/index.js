import { Router } from "express";
import userRoutes from "./userRoutes.js";
import walletRoutes from "./walletRoutes.js";
const router = Router();
router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Service is running" });
});
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
export default router;
