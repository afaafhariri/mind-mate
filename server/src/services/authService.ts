import { Request, Response } from "express";
import crypto from "crypto";
import * as userRepository from "../repositories/userRepository";
import * as otpRepository from "../repositories/otpRepository";
import * as emailService from "./emailService";
import { logger } from "../utils/logger";
import { User } from "../models/user";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const signup = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    if (!user.email || !user.firstName || !user.lastName || !user.dateOfBirth) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await userRepository.createUser(user);

    const otp = generateOTP();
    await otpRepository.saveOTP(user.email, otp);

    logger.info("OTP generated", { email: user.email, otp });

    await emailService.sendOTP(user.email, otp);

    res.status(200).json({
      message: `Signup successful. Please verify your email with the OTP sent to ${user.email}.`,
    });
  } catch (error: any) {
    logger.error("Signup error", error);
    res.status(500).json({ message: "Error creating user: " + error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const isValid = await otpRepository.verifyOTP(email, otp);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    const user = await userRepository.getUserByEmail(email);

    res.status(200).json({ message: "OTP verified successfully", user });
  } catch (error: any) {
    logger.error("Verify OTP error", error);
    res.status(500).json({ message: "Error verifying OTP: " + error.message });
  }
};
