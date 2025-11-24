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
  Button
} from "@mui/material";
import {
  TrendingUp,
  Article,
  HowToVote,
  People,
  Category,
} from "@mui/icons-material";
import { statsAPI } from '../service/api';
import Navbar from "../components/Navbar";
import SearchNavbar from "../components/SearchNavbar";

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
        biasPercentage: Math.round((data.total_votes / (data.total_articles || 1)) * 10) || 0,
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError("Unable to load stats — Backend may not be running or endpoint missing.");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card sx={{ border: "1px solid #e0e0e0", borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ backgroundColor: `${color}20`, p: 2, borderRadius: 2 }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">{title}</Typography>
            <Typography variant="h4" fontWeight="bold">{value}</Typography>
            {subtitle && <Typography variant="caption" color="textSecondary">{subtitle}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <SearchNavbar />
      <Navbar />

      <Container sx={{ py: 4 }} maxWidth="lg">
        
        {loading && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            <Button variant="contained" onClick={fetchStats}>Retry</Button>
          </Box>
        )}

        {!loading && !error && stats && (
          <>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Platform Statistics
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<Article />} title="Total Articles" value={stats.total_articles} color="#1976d2" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<HowToVote />} title="Total Votes" value={stats.total_votes} color="#2e7d32" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<People />} title="Users" value={stats.total_users} color="#ed6c02" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={<Category />} title="Categories" value={stats.categories} color="#9c27b0" />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Stats;
