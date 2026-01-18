import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  Fade,
  InputAdornment,
  Box,
  Alert,
} from "@mui/material";
import { Grid } from "@mui/material";
import { Email } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import OtpInput from "../components/OtpInput";
import { LOGIN_MUTATION, VERIFY_OTP_MUTATION } from "../graphql/mutations";

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

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [login, { loading: loginLoading }] = useMutation(LOGIN_MUTATION, {
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

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login({ variables: { email } });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      verifyOTP({ variables: { email, otp } });
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
  };

  return (
    <Grid container sx={{ minHeight: "100vh" }}>
      {/* Left Side - Form */}
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
        <Container maxWidth="xs">
          <Fade in={true} timeout={800}>
            <Box width="100%">
              <Box textAlign="center" mb={4}>
                <Box sx={{ display: { md: "none" }, mb: 2 }}>
                  <img
                    src="/meditation-round-svgrepo-com.svg"
                    alt="Logo"
                    style={{ width: 60, height: 60 }}
                  />
                </Box>
                <Typography
                  component="h1"
                  variant="h4"
                  fontWeight="bold"
                  gutterBottom
                >
                  {step === "email" ? "Welcome Back" : "Verify It's You"}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3 }}
                >
                  {step === "email"
                    ? "Sign in to continue your mindfulness journey"
                    : `We've sent a code to ${email}`}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {step === "email" ? (
                <form onSubmit={handleEmailSubmit} style={{ width: "100%" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
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
                    disabled={loginLoading}
                    sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    {loginLoading ? "Sending..." : "Send Login Code"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} style={{ width: "100%" }}>
                  <Box mb={3} mt={1}>
                    <OtpInput
                      value={otp}
                      onChange={setOtp}
                      length={6}
                      onComplete={(code) =>
                        verifyOTP({ variables: { email, otp: code } })
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
                    {verifyLoading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <Button
                    fullWidth
                    variant="text"
                    onClick={handleBackToEmail}
                    sx={{ mb: 1 }}
                  >
                    Change Email
                  </Button>
                </form>
              )}

              <Stack
                direction="row"
                spacing={0.5}
                mt={3}
                justifyContent="center"
              >
                <Typography variant="body2">Don't have an account?</Typography>
                <Link
                  component="button"
                  variant="body2"
                  fontWeight="bold"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Link>
              </Stack>
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
        <Typography variant="h5" sx={{ opacity: 0.9 }}>
          Welcome back.
        </Typography>
      </Grid>
    </Grid>
  );
}
