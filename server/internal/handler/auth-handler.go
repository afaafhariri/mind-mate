package handler

import (
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"mind-mate-server/internal/auth"
	"mind-mate-server/internal/repository"
	"mind-mate-server/internal/service"

	"github.com/gin-gonic/gin"
)

type SignupRequest struct {
	FirstName     string `json:"firstName" binding:"required"`
	LastName      string `json:"lastName" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	DateOfBirth   string `json:"dateOfBirth" binding:"required"`
	City          string `json:"city" binding:"required"`
	Country       string `json:"country" binding:"required"`
	Profession    string `json:"profession" binding:"required"`
	MaritalStatus string `json:"maritalStatus" binding:"required"`
}

type LoginRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	OTP   string `json:"otp" binding:"required"`
}

type AuthResponse struct {
	Token string      `json:"token,omitempty"`
	User  interface{} `json:"user,omitempty"`
}

type MessageResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func Signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	err := repository.CreateUser(req.Email, req.FirstName, req.LastName, req.DateOfBirth, req.City, req.Country, req.Profession, req.MaritalStatus)
	if err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	otp := generateOTP()
	if err := repository.SaveOTP(req.Email, otp); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate OTP"})
		return
	}

	if err := service.SendOTP(req.Email, otp); err != nil {
		log.Printf("Failed to send OTP: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to send OTP email"})
		return
	}

	c.JSON(http.StatusOK, MessageResponse{Message: "Signup successful. OTP sent to email."})
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	user, err := repository.GetUserByEmail(req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to check user"})
		return
	}
	if user == nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "User not found. Please sign up."})
		return
	}

	otp := generateOTP()
	if err := repository.SaveOTP(req.Email, otp); err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate OTP"})
		return
	}

	if err := service.SendOTP(req.Email, otp); err != nil {
		log.Printf("Failed to send OTP: %v", err)
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to initiate login"})
		return
	}

	c.JSON(http.StatusOK, MessageResponse{Message: "OTP sent to " + req.Email})
}

func VerifyOTP(c *gin.Context) {
	var req VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
		return
	}

	isValid, err := repository.VerifyOTP(req.Email, req.OTP)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to verify OTP"})
		return
	}
	if !isValid {
		c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid or expired OTP"})
		return
	}

	user, err := repository.GetUserByEmail(req.Email)
	if err != nil || user == nil {
		c.JSON(http.StatusNotFound, ErrorResponse{Error: "User not found"})
		return
	}

	token, err := auth.GenerateToken(req.Email, user.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, AuthResponse{
		Token: token,
		User:  user,
	})
}

func generateOTP() string {
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	return strconv.Itoa(100000 + r.Intn(900000))
}
