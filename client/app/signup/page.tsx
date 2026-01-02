"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Grid,
  ThemeProvider,
  CssBaseline,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { theme, BRAND_COLOR } from "@/lib/config/theme";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "otp">("form");
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
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue: Dayjs | null) => {
    setFormData({
      ...formData,
      dateOfBirth: newValue ? newValue.format("YYYY-MM-DD") : "",
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Signup failed");
      }

      setStep("otp");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      otp,
    });

    if (result?.error) {
      setError("Invalid OTP");
    } else {
      router.push("/");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          {/* Left Side - Form */}
          <Grid
            size={{ xs: 12, md: 6 }}
            component={Box}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              p: 4,
              backgroundColor: "#ffffff",
            }}
          >
            <Box sx={{ width: "100%", maxWidth: 500 }}>
              <Typography
                component="h1"
                variant="h4"
                sx={{ mb: 4, fontWeight: "bold", color: BRAND_COLOR }}
              >
                {step === "otp" ? "Verify Email" : "Sign Up"}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {step === "otp" ? (
                <Box component="form" onSubmit={handleVerify} noValidate>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    We have sent an OTP to {formData.email}
                  </Typography>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="otp"
                    label="Enter OTP"
                    name="otp"
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2, py: 1.5, fontSize: "1rem" }}
                  >
                    Verify
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleSignup} noValidate>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        name="firstName"
                        required
                        fullWidth
                        id="firstName"
                        label="First Name"
                        autoFocus
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        id="lastName"
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <DatePicker
                        label="Date of Birth"
                        value={
                          formData.dateOfBirth
                            ? dayjs(formData.dateOfBirth)
                            : null
                        }
                        onChange={handleDateChange}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                          },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        id="city"
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        required
                        fullWidth
                        id="country"
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        required
                        fullWidth
                        id="profession"
                        label="Profession"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        select
                        required
                        fullWidth
                        id="maritalStatus"
                        label="Marital Status"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Married">Married</MenuItem>
                        <MenuItem value="Divorced">Divorced</MenuItem>
                        <MenuItem value="Widowed">Widowed</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 4, mb: 2, py: 1.5, fontSize: "1rem" }}
                  >
                    Sign Up
                  </Button>
                  <Grid container justifyContent="flex-end">
                    <Grid size="grow">
                      <Button
                        href="/api/auth/signin"
                        variant="text"
                        sx={{ color: BRAND_COLOR }}
                      >
                        Already have an account? Sign in
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Grid>

          {/* Right Side - Logo */}
          <Grid
            size={{ xs: 0, md: 6 }}
            sx={{
              backgroundColor: BRAND_COLOR,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "relative", width: "300px", height: "300px" }}>
              <Image
                src="/meditation-round-svgrepo-com.svg"
                alt="Mind Mate Logo"
                fill
                style={{
                  objectFit: "contain",
                  filter: "brightness(0) invert(1)",
                }}
                priority
              />
            </Box>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
