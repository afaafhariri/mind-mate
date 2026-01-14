import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { logger } from "./utils/logger";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/auth", authRoutes);

export default app;
