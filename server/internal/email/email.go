package email

import (
	"fmt"
	"net/smtp"
	"os"
)

type Service interface {
	SendOTP(to string, otp string) error
}

type SMTPService struct {
	auth smtp.Auth
	host string
	port string
	from string
}

func NewSMTPService() *SMTPService {
	host := os.Getenv("SMTP_HOST")
	port := os.Getenv("SMTP_PORT")
	username := os.Getenv("SMTP_USERNAME")
	password := os.Getenv("SMTP_PASSWORD")
	from := os.Getenv("SMTP_FROM")

	auth := smtp.PlainAuth("", username, password, host)

	return &SMTPService{
		auth: auth,
		host: host,
		port: port,
		from: from,
	}
}

func (s *SMTPService) SendOTP(to string, otp string) error {
	msg := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: Your OTP Code\r\n"+
		"\r\n"+
		"Your OTP code is: %s\r\n", to, otp))

	addr := fmt.Sprintf("%s:%s", s.host, s.port)
	return smtp.SendMail(addr, s.auth, s.from, []string{to}, msg)
}
