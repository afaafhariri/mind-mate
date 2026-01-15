import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Implement signup logic
    console.log("Signup:", formData);
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h5"
            component="h1"
            gutterBottom
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  name="firstName"
                  label="First Name"
                  fullWidth
                  variant="outlined"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  variant="outlined"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Stack>

              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                fullWidth
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <Button type="submit" variant="contained" size="large" fullWidth>
                Sign Up
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate("/")}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
