import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  MenuItem,
  Fade,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import OtpInput from "../components/OtpInput";
import { SIGNUP_MUTATION, VERIFY_OTP_MUTATION } from "../graphql/mutations";

interface VerifyOtpData {
  verifyOTP: {
    token: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

interface VerifyOtpVars {
  email: string;
  otp: string;
}

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
  const [error, setError] = useState("");

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

  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: () => {
      setStep("otp");
      setError("");
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const [verifyOTP, { loading: verifyLoading }] = useMutation<
    VerifyOtpData,
    VerifyOtpVars
  >(VERIFY_OTP_MUTATION, {
    onCompleted: (data) => {
      const { token, user } = data.verifyOTP;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    },
    onError: (err: { message: string }) => {
      setError(err.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ variables: formData });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyOTP({ variables: { email: formData.email, otp } });
    }
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

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

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
                      <DatePicker
                        label="Date of Birth"
                        value={
                          formData.dateOfBirth
                            ? dayjs(formData.dateOfBirth)
                            : null
                        }
                        onChange={(newValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: newValue
                              ? newValue.format("YYYY-MM-DD")
                              : "",
                          }));
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            name: "dateOfBirth",
                          },
                        }}
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
                    disabled={signupLoading}
                    sx={{ mt: 4, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    {signupLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <Box mb={3} mt={1}>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                      onComplete={(code) =>
                        verifyOTP({
                          variables: { email: formData.email, otp: code },
                        })
                      }
                    />
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={verifyLoading || otp.length !== 6}
                    sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    {verifyLoading ? "Verifying..." : "Verify & Create Account"}
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
