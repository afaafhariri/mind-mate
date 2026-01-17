import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Grid,
  MenuItem,
  Fade,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Key } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
const COUNTRIES = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "India",
  "Sri Lanka",
  "Pakistan",
  "Bangladesh",
];

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    city: "",
    country: "",
    profession: "",
    maritalStatus: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend Signup mutation -> User created -> OTP Sent
    console.log("Submitting Signup Form:", formData);
    setStep("otp");
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Call backend VerifyOTP mutation
    console.log("Verifying OTP for new user:", otp);
    navigate("/home");
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Side - Forms */}
      <Grid
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="sm">
          <Fade in={true} timeout={800}>
            <Box>
              <Box textAlign="center" mb={4}>
                <Box sx={{ display: { md: "none" }, mb: 2 }}>
                  <img
                    src="/meditation-round-svgrepo-com.svg"
                    alt="Logo"
                    style={{ width: 60, height: 60 }}
                  />
                </Box>
                <Typography component="h1" variant="h4" fontWeight="bold">
                  {step === "form" ? "Create Account" : "Verify Email"}
                </Typography>
                <Typography variant="body1" color="text.secondary" mt={1}>
                  {step === "form"
                    ? "Join us to start your mindfulness journey"
                    : `Enter the code sent to ${formData.email}`}
                </Typography>
              </Box>

              {step === "form" ? (
                <form onSubmit={handleFormSubmit}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="firstName"
                        label="First Name"
                        fullWidth
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="dateOfBirth"
                        label="Date of Birth"
                        type="date"
                        fullWidth
                        required
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="profession"
                        label="Profession"
                        fullWidth
                        required
                        value={formData.profession}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="city"
                        label="City"
                        fullWidth
                        required
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        name="country"
                        label="Country"
                        fullWidth
                        required
                        value={formData.country}
                        onChange={handleChange}
                      >
                        {COUNTRIES.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        name="maritalStatus"
                        label="Marital Status"
                        fullWidth
                        required
                        value={formData.maritalStatus}
                        onChange={handleChange}
                      >
                        {MARITAL_STATUSES.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 4, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    Sign Up
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="otp"
                    label="Enter Verification Code"
                    type={showOtp ? "text" : "password"}
                    id="otp"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Key color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle code visibility"
                              onClick={() => setShowOtp(!showOtp)}
                              edge="end"
                            >
                              {showOtp ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    Verify & Create Account
                  </Button>
                  <Button fullWidth onClick={() => setStep("form")}>
                    Back to details
                  </Button>
                </form>
              )}

              <Box textAlign="center" mt={2}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    fontWeight="bold"
                    onClick={() => navigate("/")}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Grid>

      {/* Right Side - Branding */}
      <Grid
        size={{ xs: 0, md: 6 }}
        sx={{
          bgcolor: "primary.main",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          p: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="/meditation-round-svgrepo-com.svg"
          alt="Mind Mate Logo"
          sx={{
            width: { md: 200, lg: 300 },
            height: { md: 200, lg: 300 },
            mb: 4,
            filter: "brightness(0) invert(1)",
          }}
        />
        <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
          Mind Mate
        </Typography>
        <Typography
          variant="h5"
          sx={{ opacity: 0.9, textAlign: "center", maxWidth: 600 }}
        >
          Your journey to mindfulness starts here.
        </Typography>
      </Grid>
    </Grid>
  );
}
