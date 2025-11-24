import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
} from "@mui/icons-material";
import { authAPI } from '../service/api';

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setSuccess("");
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.login(loginData.username, loginData.password);
      
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (registerData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (registerData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      await authAPI.register(
        registerData.username,
        registerData.email,
        registerData.password
      );

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#000",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              N👁TRA
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#666",
                mt: 1,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              News Evaluation & Transparency Rating
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              borderBottom: "1px solid #e0e0e0",
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                color: "#666",
                "&.Mui-selected": {
                  color: "#000",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {activeTab === 0 && (
            <Box component="form" onSubmit={handleLogin}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={loginData.username}
                onChange={handleLoginChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={loginData.password}
                onChange={handleLoginChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </Box>
          )}

          {activeTab === 1 && (
            <Box component="form" onSubmit={handleRegister}>
              <TextField
                fullWidth
                name="username"
                label="Username"
                value={registerData.username}
                onChange={handleRegisterChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
                helperText="3-80 characters"
              />

              <TextField
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="Minimum 8 characters"
              />

              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#666" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "#fff",
                  textTransform: "none",
                  fontSize: "16px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  "&:hover": {
                    backgroundColor: "#333",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                  },
                }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </Box>
          )}

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography
              variant="caption"
              sx={{
                color: "#999",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              By continuing, you agree to NETRA's Terms of Service and Privacy
              Policy
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;