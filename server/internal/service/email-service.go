package service

import (
	"fmt"
	"log"
	"os"
	"strconv"

	"github.com/wneessen/go-mail"
)

func SendOTP(to string, otp string) error {
	host := os.Getenv("SMTP_HOST")
	portStr := os.Getenv("SMTP_PORT")
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	if portStr == "" {
		portStr = "587"
	}
	port, _ := strconv.Atoi(portStr)

	m := mail.NewMsg()
	if err := m.From(from); err != nil {
		return fmt.Errorf("failed to set from address: %w", err)
	}
	if err := m.To(to); err != nil {
		return fmt.Errorf("failed to set to address: %w", err)
	}
	m.Subject("Your OTP Code")
	m.SetBodyString(mail.TypeTextPlain, fmt.Sprintf("Your OTP code is: %s\n", otp))
	m.SetBodyString(mail.TypeTextHTML, GetOTPTemplate(otp))

	// Setup client
	// Note: go-mail handles TLS/StartTLS automatically based on port usually,
	// but might need explicit config depending on the server (e.g. gmail vs others).
	// Assuming options similar to nodemailer default.

	// Node implementation used secure: false, which implies opportunistic TLS (StartTLS).

	client, err := mail.NewClient(host,
		mail.WithPort(port),
		mail.WithSMTPAuth(mail.SMTPAuthPlain),
		mail.WithUsername(username),
		mail.WithPassword(password),
		mail.WithTLSPolicy(mail.TLSOpportunistic), // Like nodemailer secure: false
	)

	if err != nil {
		return fmt.Errorf("failed to create mail client: %w", err)
	}

	if err := client.DialAndSend(m); err != nil {
		log.Printf("Error sending email to %s: %v", to, err)
		return err
	}

	log.Printf("Email sent to %s", to)
	return nil
}
