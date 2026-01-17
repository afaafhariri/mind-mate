import * as userRepository from "../repositories/userRepository";
import * as otpRepository from "../repositories/otpRepository";
import * as emailService from "../services/emailService";
import { logger } from "../utils/logger";
import { User, createUserDTO } from "../models/user";
import { login } from "../services/authService";

export const resolvers = {
  Query: {
    getUser: async (_: any, { email }: { email: string }) => {
      try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } catch (error) {
        logger.error("Error in getUser resolver:", error);
        throw error;
      }
    },
  },
  Mutation: {
    signup: async (_: any, args: createUserDTO) => {
      try {
        await userRepository.createUser(args);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await otpRepository.saveOTP(args.email, otp);
        await emailService.sendOTP(args.email, otp);
        logger.info(`Signup process initiated for ${args.email}`);
        return "Signup successful. OTP sent to email.";
      } catch (error: any) {
        logger.error("Error in signup resolver:", error);
        throw new Error("Failed to sign up: " + error.message);
      }
    },

    login: async (_: any, {email, otp }: { email: string; otp: string }) => {
      try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
           throw new Error("User not found. Please sign up.");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await otpRepository.saveOTP(email, otp);
        await emailService.sendOTP(email, otp);
        logger.info(`Login OTP sent to ${email}`);
        return `OTP sent to ${email}`;
      } catch (error: any) {
        logger.error("Error in login resolver:", error);
        throw new Error("Failed to initiate login: " + error.message);
      }
    },

    verifyOTP: async (_: any, { email, otp }: { email: string; otp: string }) => {
      try {
        const isValid = await otpRepository.verifyOTP(email, otp);
        if (!isValid) {
          return false;
        }
        logger.info(`OTP verified successfully for ${email}`);
        return true;
      } catch (error) {
        logger.error("Error in verifyOTP resolver:", error);
        throw new Error("Failed to verify OTP");
      }
    }
  },
};
