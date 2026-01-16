import { db } from "../db";
import { Timestamp } from "firebase-admin/firestore";

const otpCollection = db.collection("otps");

interface OTPRecord {
  email: string;
  code: string;
  expiresAt: Timestamp;
}

export const saveOTP = async (email: string, code: string): Promise<void> => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await otpCollection.doc(email).set({
    email,
    code,
    expiresAt: Timestamp.fromDate(expiresAt),
  });
};

export const verifyOTP = async (
  email: string,
  code: string
): Promise<boolean> => {
  const docRef = otpCollection.doc(email);
  const doc = await docRef.get();

  if (!doc.exists) {
    return false;
  }

  const data = doc.data() as OTPRecord;

  // Check expiration
  if (data.expiresAt.toDate() < new Date()) {
    // Clean up expired OTP
    await docRef.delete();
    return false;
  }

  // Check code match
  if (data.code !== code) {
    return false;
  }

  // Valid OTP - consume it so it can't be reused
  await docRef.delete();

  return true;
};
