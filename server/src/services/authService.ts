import { Request, Response } from "express";
import crypto from "crypto";
import * as userRepository from "../repositories/userRepository";
import * as otpRepository from "../repositories/otpRepository";
import * as emailService from "./emailService";
import { logger } from "../utils/logger";
import { User,createUserDTO } from "../models/user";
import { generateToken } from "../utils/jasonWebToken";

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const signup = async (req: Request, res: Response) => {
  try {
    const user: createUserDTO = req.body;

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

    if (!user) {
      return res.status(404).json({ message: "User account not found" });
    }

    const token = generateToken(user.id || user.email, user.email);

    res.status(200).json({ message: "OTP verified successfully", user, token });
  } catch (error: any) {
    logger.error("Verify OTP error", error);
    res.status(500).json({ message: "Error verifying OTP: " + error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found with email " + email });
    }

    const otp = generateOTP();
    await otpRepository.saveOTP(email, otp);

    logger.info("OTP generated for login", { email, otp });
    await emailService.sendOTP(email, otp);

    res.status(200).json({
      message: `Login OTP sent to ${email}. Please verify to complete login.`,
    });
  } catch (error: any) {
    logger.error("Login error", error);
    res.status(500).json({ message: "Error during login: " + error.message });
  }
};