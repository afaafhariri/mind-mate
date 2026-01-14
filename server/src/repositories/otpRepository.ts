import { query } from "../config/db";

export const saveOTP = async (email: string, code: string) => {
  const text = `
    INSERT INTO otps (email, code, expires_at)
    VALUES ($1, $2, NOW() + INTERVAL '10 minutes')
    ON CONFLICT (email) DO UPDATE SET
      code = EXCLUDED.code,
      expires_at = EXCLUDED.expires_at
  `;
  await query(text, [email, code]);
};

export const verifyOTP = async (
  email: string,
  code: string
): Promise<boolean> => {
  const text = `SELECT code, expires_at FROM otps WHERE email = $1`;
  const res = await query(text, [email]);

  if (res.rows.length === 0) {
    return false;
  }

  const { code: storedCode, expires_at } = res.rows[0];

  if (new Date() > new Date(expires_at)) {
    return false;
  }

  if (storedCode !== code) {
    return false;
  }

  // Delete OTP after successful verification
  await query("DELETE FROM otps WHERE email = $1", [email]);

  return true;
};
