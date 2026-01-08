import { Router } from "express";
import userRoutes from "./userRoutes";
import walletRoutes from "./walletRoutes";
const router = Router();
router.get("/health", (req, res) => {
    res.json({ status: "ok", message: "Service is running" });
});
router.use("/users", userRoutes);
router.use("/wallets", walletRoutes);
export default router;
