import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchNavbar from '../components/SearchNavbar';
import BreakingNewsTicker from "../components/BreakingNewsTicker";
import NewsCard from "../components/NewsCard";
import Filter from "../components/Filter";
import YouTubeRecommendation from "../components/YouTube";
import { Box, CircularProgress, Alert, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../service/api';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function Home(){
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    categories: ["india"],
    sources: [],
    dateRange: 'all',
  });
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    per_page: 20,
    total_pages: 1,
  });

  useEffect(() => {
    fetchArticles();
  }, [filters, pagination.page]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.per_page,
        sort_by: 'recent',
      };

      // Handle Filters: Send strictly formatted params to backend
      if (filters.categories && filters.categories.length > 0) {
        params.category = filters.categories[0]; 
      }

      if (filters.sources && filters.sources.length > 0) {
        params.sources = filters.sources.join(',');
      }

      if (filters.dateRange && filters.dateRange !== 'all') {
        params.dateRange = filters.dateRange;
      }

      if (filters.search) {
        params.search = filters.search;
      }

      const response = await articlesAPI.getArticles(params);
      
      setArticles(response.articles || []);
      setPagination(prev => ({
        ...prev,
        total_pages: response.pagination?.total_pages || 1,
        total_items: response.pagination?.total_items || 0,
      }));

    } catch (err) {
      console.error('Error fetching articles:', err);
      if (err.code === "ERR_NETWORK") {
        setError('Cannot connect to server. Ensure your backend is running.');
      } else {
        setError('Failed to load articles. Please check your database connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 })); 
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <SearchNavbar />
        <Navbar />
        <BreakingNewsTicker />
        
        <Box sx={{ display: 'flex', px: 4, py: 4, gap: 4, maxWidth: '1400px', margin: '0 auto' }}>
          {/* LEFT SIDEBAR */}
          <Box sx={{ width: '320px', flexShrink: 0, position: 'sticky', top: 20, height: 'fit-content' }}>
            <Filter onFilterChange={handleFilterChange} />
            {/*<YouTubeRecommendation />*/}
          </Box>

          {/* RIGHT SECTION */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 3 }}
                action={<Button color="inherit" size="small" onClick={fetchArticles}>Retry</Button>}
              >
                {error}
              </Alert>
            )}

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
              </Box>
            ) : articles.length > 0 ? (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 3,
                '@media (max-width: 1024px)': { gridTemplateColumns: '1fr' }
              }}>
                {articles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </Box>
            ) : (
              !error && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="textSecondary">No articles found</Typography>
                  <Button onClick={() => handleFilterChange({ categories: [], sources: [], dateRange: 'all' })}>
                    Clear Filters
                  </Button>
                </Box>
              )
            )}
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default Home;