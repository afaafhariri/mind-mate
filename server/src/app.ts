import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { requestLogger, errorLogger } from "./middleware/requestLogger";

const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/auth", authRoutes);

export default app;

app.use(errorLogger);
