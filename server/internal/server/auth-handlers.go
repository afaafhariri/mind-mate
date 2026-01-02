package server

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"mind-mate-server/internal/database"
	"net/http"
	"time"
)

func (s *Server) SignupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user database.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if user.Email == "" || user.FirstName == "" || user.LastName == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	err = database.CreateUser(user)
	if err != nil {
		http.Error(w, "Error creating user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	otp := generateOTP()

	err = database.SaveOTP(user.Email, otp)
	if err != nil {
		http.Error(w, "Error saving OTP: "+err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Printf("OTP for %s: %s\n", user.Email, otp)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Signup successful. Please verify your email with the OTP sent."})
}

func (s *Server) VerifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req struct {
		Email string `json:"email"`
		OTP   string `json:"otp"`
	}
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	valid, err := database.VerifyOTP(req.Email, req.OTP)
	if err != nil {
		http.Error(w, "Error verifying OTP: "+err.Error(), http.StatusInternalServerError)
		return
	}

	if !valid {
		http.Error(w, "Invalid or expired OTP", http.StatusUnauthorized)
		return
	}

	user, err := database.GetUserByEmail(req.Email)
	if err != nil {
		http.Error(w, "Error retrieving user: "+err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(user)
}

func generateOTP() string {
	rand.Seed(time.Now().UnixNano())
	return fmt.Sprintf("%06d", rand.Intn(1000000))
}
