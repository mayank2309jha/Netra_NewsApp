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
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("netra_user");

    if (!token || !storedUser) {
      navigate("/auth");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setEditedUser(userData);
  }, [navigate]);

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

    const storedUsers = JSON.parse(localStorage.getItem("netra_users") || "[]");
    const userIndex = storedUsers.findIndex((u) => u.id === user.id);

    if (userIndex !== -1) {
      storedUsers[userIndex] = { ...storedUsers[userIndex], ...editedUser };
      localStorage.setItem("netra_users", JSON.stringify(storedUsers));
      localStorage.setItem("netra_user", JSON.stringify(editedUser));
    }

    setUser(editedUser);
    setIsEditing(false);
    setSuccess("Profile updated successfully!");
    setError("");
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

  if (!user) {
    return null;
  }

  return (
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
                        Member since {formatDate(user.createdAt)}
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
                          {formatDate(user.createdAt)}
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

                <Box
                  sx={{
                    backgroundColor: "#f9f9f9",
                    p: 2,
                    borderRadius: 1,
                    border: "1px solid #e0e0e0",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontFamily: "'Inter', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong>Note:</strong> This is simulated data stored in your
                    browser's localStorage. When connected to the database, this
                    information will be fetched from the backend and can be
                    updated through API calls.
                  </Typography>
                </Box>
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
  );
};

export default Profile;
