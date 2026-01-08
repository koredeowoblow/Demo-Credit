import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler.js";
import routes from "./routes/index.js";
const app = express();
app.use(express.json());
app.use(cors());
// Routes
app.use("/api/v1", routes);
// Global Error Handler
app.use(errorHandler);
export default app;
