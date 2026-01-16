import { db } from "../db";
import { Timestamp } from "firebase-admin/firestore";

const otpCollection = db.collection("otps");

interface OTPRecord {
  email: string;
  code: string;
  expiresAt: Timestamp;
}

export const saveOTP = async (email: string, code: string): Promise<void> => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await otpCollection.doc(email).set({
      email,
      code,
      expiresAt: Timestamp.fromDate(expiresAt),
    });
  } catch (error) {
    console.error(`Error saving OTP for email ${email}:`, error);
    throw new Error("Failed to save OTP");
  }
};

export const verifyOTP = async ( email: string, code: string): Promise<boolean> => {
  try {
    const docRef = otpCollection.doc(email);
  const doc = await docRef.get();
  if (!doc.exists) {
    return false;
  }
  const data = doc.data() as OTPRecord;
  if (data.expiresAt.toDate() < new Date()) {
    await docRef.delete();
    return false;
  }
  if (data.code !== code) {
    return false;
  }
  await docRef.delete();  
  return true;
  } catch (error) {
    console.error(`Error verifying OTP for email ${email}:`, error);
    throw new Error("Failed to verify OTP");
  }
};
