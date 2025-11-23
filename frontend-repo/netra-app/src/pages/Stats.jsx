import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  TrendingUp,
  Article,
  HowToVote,
  People,
  Category,
} from "@mui/icons-material";

const Stats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("netra_users") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("netra_user") || "{}");

    const mockStats = {
      totalArticles: 500,
      totalVotes: 1245,
      totalUsers: storedUsers.length || 10,
      categories: 9,
      userVotes: 0,
      userBookmarks: 0,
      topCategory: "India",
      biasPercentage: 61.4,
      categoryBreakdown: [
        { name: "India", count: 85, percentage: 17 },
        { name: "World", count: 75, percentage: 15 },
        { name: "Sports", count: 65, percentage: 13 },
        { name: "Business", count: 60, percentage: 12 },
        { name: "Technology", count: 55, percentage: 11 },
        { name: "Science", count: 50, percentage: 10 },
        { name: "Entertainment", count: 45, percentage: 9 },
        { name: "Local", count: 40, percentage: 8 },
        { name: "Health", count: 25, percentage: 5 },
      ],
      recentActivity: [
        { action: "Article voted as biased", time: "2 hours ago" },
        { action: "New user registered", time: "3 hours ago" },
        { action: "Article bookmarked", time: "5 hours ago" },
        { action: "Article voted as not biased", time: "6 hours ago" },
      ],
    };

    setStats(mockStats);
  }, []);

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: "#666",
                fontFamily: "'Inter', sans-serif",
                display: "block",
              }}
            >
              {title}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                fontFamily: "'Inter', sans-serif",
                color: "#000",
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{
                  color: "#999",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (!stats) {
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
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontFamily: "'Inter', sans-serif",
              mb: 1,
            }}
          >
            Platform Statistics
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Real-time overview of NETRA platform activity
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Article sx={{ fontSize: 32, color: "#1976d2" }} />}
              title="Total Articles"
              value={stats.totalArticles}
              color="#1976d2"
              subtitle="Across 9 categories"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HowToVote sx={{ fontSize: 32, color: "#2e7d32" }} />}
              title="Total Votes"
              value={stats.totalVotes}
              color="#2e7d32"
              subtitle="Community ratings"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People sx={{ fontSize: 32, color: "#ed6c02" }} />}
              title="Active Users"
              value={stats.totalUsers}
              color="#ed6c02"
              subtitle="Registered members"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Category sx={{ fontSize: 32, color: "#9c27b0" }} />}
              title="Categories"
              value={stats.categories}
              color="#9c27b0"
              subtitle="News sections"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Inter', sans-serif",
                  mb: 3,
                }}
              >
                Articles by Category
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {stats.categoryBreakdown.map((category, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        {category.count} articles ({category.percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={category.percentage * 5.88}
                      sx={{
                        height: 8,
                        borderRadius: 1,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#000",
                          borderRadius: 1,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Inter', sans-serif",
                  mb: 3,
                }}
              >
                Overall Bias Rating
              </Typography>
              <Box sx={{ textAlign: "center", py: 2 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: "'Inter', sans-serif",
                    mb: 1,
                  }}
                >
                  {stats.biasPercentage}%
                </Typography>
                <Chip
                  label="Biased"
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    fontWeight: 600,
                    fontFamily: "'Inter', sans-serif",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                    fontFamily: "'Inter', sans-serif",
                    mt: 2,
                  }}
                >
                  Based on {stats.totalVotes} community votes
                </Typography>
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "'Inter', sans-serif",
                  mb: 2,
                }}
              >
                Recent Activity
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {stats.recentActivity.map((activity, index) => (
                  <Box key={index}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Inter', sans-serif",
                        mb: 0.5,
                      }}
                    >
                      {activity.action}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#999",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: "#f9f9f9",
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
            <strong>Note:</strong> These are simulated statistics. When
            connected to the database, real-time data will be fetched from the
            backend API endpoint: GET /api/stats/overview
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Stats;
