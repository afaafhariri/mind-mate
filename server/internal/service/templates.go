package service

import (
	"fmt"
	"time"
)

func GetOTPTemplate(otp string) string {
	year := time.Now().Year()
	return fmt.Sprintf(`
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; }
    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .header h2 { margin: 0; color: #2c3e50; }
    .content { background-color: #ffffff; padding: 20px; border-radius: 4px; }
    .otp-code { font-size: 32px; font-weight: bold; color: #4CAF50; text-align: center; margin: 20px 0; letter-spacing: 5px; }
    .footer { font-size: 12px; color: #777; text-align: center; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Mind Mate</h2>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Please use the following One-Time Password (OTP) to complete your verification process. This code is valid for 10 minutes.</p>
      <div class="otp-code">%s</div>
      <p>If you did not request this code, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; %d Mind Mate. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`, otp, year)
}
