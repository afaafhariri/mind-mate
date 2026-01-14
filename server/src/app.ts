import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { requestLogger, errorLogger } from "./middleware/requestLogger";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use(requestLogger);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/auth", authRoutes);

export default app;
// Error handling middleware
app.use(errorLogger);
