import { Router } from "express";
import * as authController from "../controllers/authController";

const router = Router();

router.post("/signup", authController.signup);
router.post("/verify", authController.verifyOTP);

export default router;
