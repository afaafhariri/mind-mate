import { Router } from "express";
import * as authService from "../services/authService";

const authRouter = Router();

authRouter.post("/signup", authService.signup);
authRouter.post("/verify", authService.verifyOTP);
authRouter.post("/login", authService.login);

export default authRouter;