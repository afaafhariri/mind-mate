import prisma from "../config/db";

export const saveOTP = async (email: string, code: string) => {
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

  await prisma.otp.upsert({
    where: { email },
    update: {
      code,
      expiresAt,
    },
    create: {
      email,
      code,
      expiresAt,
    },
  });
};

export const verifyOTP = async (
  email: string,
  code: string
): Promise<boolean> => {
  const otpRecord = await prisma.otp.findUnique({
    where: { email },
  });

  if (!otpRecord) {
    return false;
  }

  if (new Date() > otpRecord.expiresAt) {
    return false;
  }

  if (otpRecord.code !== code) {
    return false;
  }

  await prisma.otp.delete({
    where: { email },
  });

  return true;
};
