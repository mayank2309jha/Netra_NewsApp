import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Avatar,
  Divider,
  Grid,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  Edit,
  Save,
  Cancel,
  Logout,
} from "@mui/icons-material";
import { authAPI } from '../service/api';
import SearchNavbar from '../components/SearchNavbar';
import Navbar from '../components/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      setLoading(false);
      setTimeout(() => navigate("/auth"), 100);
      return;
    }

    // First try to get user from localStorage
    const storedUser = localStorage.getItem("netra_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setEditedUser(parsedUser);
        setLoading(false);
        
        // Optionally fetch fresh data from backend in background
        try {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          setEditedUser(userData);
          // Update localStorage with fresh data
          localStorage.setItem("netra_user", JSON.stringify(userData));
        } catch (err) {
          console.log('Background refresh failed:', err);
          // Keep using localStorage data
        }
        return;
      } catch (e) {
        console.error('Failed to parse stored user:', e);
      }
    }

    // If no stored user, fetch from API
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      setEditedUser(userData);
      localStorage.setItem("netra_user", JSON.stringify(userData));
    } catch (err) {
      console.error('Error fetching user data:', err);
      // If token is invalid, redirect to auth
      if (err.response?.status === 401) {
        authAPI.logout();
      } else {
        setError('Failed to load profile data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setError("");
  };

  const handleChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (editedUser.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedUser.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Update local storage
    localStorage.setItem("netra_user", JSON.stringify(editedUser));

    setUser(editedUser);
    setIsEditing(false);
    setSuccess("Profile updated successfully!");
    setError("");

    // Note: In production, you would call an API endpoint to update the user profile
    // await api.put('/auth/profile', editedUser);
  };

  const handleLogout = () => {
    authAPI.logout();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <>
        <SearchNavbar />
        <Navbar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <SearchNavbar />
        <Navbar />
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Alert severity="info">Redirecting to login...</Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <SearchNavbar />
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          py: 4,
        }}
      >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Button
              onClick={() => setActiveTab(0)}
              sx={{
                flex: 1,
                py: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                color: activeTab === 0 ? "#000" : "#666",
                backgroundColor: activeTab === 0 ? "#fff" : "#f5f5f5",
                borderRadius: 0,
                borderBottom: activeTab === 0 ? "3px solid #1976d2" : "none",
                "&:hover": {
                  backgroundColor: activeTab === 0 ? "#fff" : "#e0e0e0",
                },
              }}
            >
              Personal Info
            </Button>
            <Button
              onClick={() => setActiveTab(1)}
              sx={{
                flex: 1,
                py: 2,
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                color: activeTab === 1 ? "#000" : "#666",
                backgroundColor: activeTab === 1 ? "#fff" : "#f5f5f5",
                borderRadius: 0,
                borderBottom: activeTab === 1 ? "3px solid #1976d2" : "none",
                "&:hover": {
                  backgroundColor: activeTab === 1 ? "#fff" : "#e0e0e0",
                },
              }}
            >
              Preferences
            </Button>
          </Box>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              <Box>
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                  </Alert>
                )}
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#000",
                        fontSize: "32px",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(user.username)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {user.username}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        Member since {formatDate(user.created_at)}
                      </Typography>
                    </Box>
                  </Box>

                  {!isEditing ? (
                    <Button
                      startIcon={<Edit />}
                      onClick={handleEdit}
                      sx={{
                        textTransform: "none",
                        color: "#000",
                        borderColor: "#000",
                        fontFamily: "'Inter', sans-serif",
                        "&:hover": {
                          borderColor: "#000",
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                      variant="outlined"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        startIcon={<Save />}
                        onClick={handleSave}
                        sx={{
                          textTransform: "none",
                          backgroundColor: "#000",
                          fontFamily: "'Inter', sans-serif",
                          "&:hover": {
                            backgroundColor: "#333",
                          },
                        }}
                        variant="contained"
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        sx={{
                          textTransform: "none",
                          color: "#666",
                          borderColor: "#ccc",
                          fontFamily: "'Inter', sans-serif",
                        }}
                        variant="outlined"
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Person sx={{ color: "#666" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666",
                            fontFamily: "'Inter', sans-serif",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Username
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            name="username"
                            value={editedUser.username}
                            onChange={handleChange}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontFamily: "'Inter', sans-serif",
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {user.username}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Email sx={{ color: "#666" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666",
                            fontFamily: "'Inter', sans-serif",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Email Address
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            name="email"
                            type="email"
                            value={editedUser.email}
                            onChange={handleChange}
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                fontFamily: "'Inter', sans-serif",
                              },
                            }}
                          />
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{
                              fontFamily: "'Inter', sans-serif",
                              fontWeight: 500,
                            }}
                          >
                            {user.email}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <CalendarToday sx={{ color: "#666" }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666",
                            fontFamily: "'Inter', sans-serif",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          Member Since
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {formatDate(user.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography sx={{ color: "#666", fontSize: "20px" }}>
                          #
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#666",
                            fontFamily: "'Inter', sans-serif",
                            display: "block",
                            mb: 0.5,
                          }}
                        >
                          User ID
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 500,
                          }}
                        >
                          {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Note about data source */}
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "'Inter', sans-serif",
                      color: "#666",
                    }}
                  >
                    <strong>Note:</strong> This information is fetched from the backend database. 
                    When you edit and save your profile, the changes are stored locally. 
                    In a production environment, profile updates would be sent to the backend through API calls.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: "#999",
                    fontFamily: "'Inter', sans-serif",
                    mb: 1,
                  }}
                >
                  Preferences Coming Soon
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  This section will include notification settings, display
                  preferences, and more.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
    </>
  );
};

export default Profile;