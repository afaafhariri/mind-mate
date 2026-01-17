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
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Key } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: Call backend Login mutation -> Sends OTP
      console.log("Requesting OTP for:", email);
      setStep("otp");
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp) {
      // TODO: Call backend VerifyOTP mutation
      console.log("Verifying OTP:", otp);
      navigate("/home");
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
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
                    sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1.5 }}
                  >
                    Send Login Code
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} style={{ width: "100%" }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="otp"
                    label="Enter OTP"
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
                              aria-label="toggle password visibility"
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
                    Verify & Login
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
