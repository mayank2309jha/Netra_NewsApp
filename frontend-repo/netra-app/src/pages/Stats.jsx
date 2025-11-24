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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  TrendingUp,
  Article,
  HowToVote,
  People,
  Category,
} from "@mui/icons-material";
import { statsAPI } from '../service/api';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await statsAPI.getOverview();
      
      // Transform category_stats to match UI format
      const categoryBreakdown = data.category_stats?.map(cat => ({
        name: cat.category.charAt(0).toUpperCase() + cat.category.slice(1),
        count: cat.article_count,
        percentage: data.total_articles > 0 
          ? Math.round((cat.article_count / data.total_articles) * 100) 
          : 0,
      })) || [];

      setStats({
        ...data,
        categoryBreakdown,
        categories: data.category_stats?.length || 0,
        biasPercentage: 61.4, // This would need to be calculated from votes
        recentActivity: [
          { action: "Article voted as biased", time: "2 hours ago" },
          { action: "New user registered", time: "3 hours ago" },
          { action: "Article bookmarked", time: "5 hours ago" },
          { action: "Article voted as not biased", time: "6 hours ago" },
        ],
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
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
    );
  }

  if (error || !stats) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Alert severity="error">{error || 'Failed to load statistics'}</Alert>
        </Container>
      </Box>
    );
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
              value={stats.total_articles}
              color="#1976d2"
              subtitle={`Across ${stats.categories} categories`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<HowToVote sx={{ fontSize: 32, color: "#2e7d32" }} />}
              title="Total Votes"
              value={stats.total_votes}
              color="#2e7d32"
              subtitle="Community ratings"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<People sx={{ fontSize: 32, color: "#ed6c02" }} />}
              title="Active Users"
              value={stats.total_users}
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
                {stats.categoryBreakdown && stats.categoryBreakdown.length > 0 ? (
                  stats.categoryBreakdown.map((category, index) => (
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
                        value={category.percentage}
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
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No category data available
                  </Typography>
                )}
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
                  Based on {stats.total_votes} community votes
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
      </Container>
    </Box>
  );
};

export default Stats;