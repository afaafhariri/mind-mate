import * as userRepository from "../repositories/userRepository";
import * as otpRepository from "../repositories/otpRepository";
import * as emailService from "../services/emailService";
import { logger } from "../utils/logger";
import { User } from "../models/user";

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
    signup: async (_: any, args: User) => {
      try {
        // 1. Create or Update User in Firestore
        await userRepository.createUser(args);

        // 2. Generate numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Save OTP to Firestore
        await otpRepository.saveOTP(args.email, otp);

        // 4. Send OTP via Email
        await emailService.sendOTP(args.email, otp);

        logger.info(`Signup process initiated for ${args.email}`);
        return "Signup successful. OTP sent to email.";
      } catch (error: any) {
        logger.error("Error in signup resolver:", error);
        throw new Error("Failed to sign up: " + error.message);
      }
    },

    verifyOTP: async (
      _: any,
      { email, otp }: { email: string; otp: string }
    ) => {
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
    },
  },
};
