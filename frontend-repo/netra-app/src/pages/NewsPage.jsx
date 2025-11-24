import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import SearchNavbar from '../components/SearchNavbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  Container, Grid, Box, Card, CardContent, Typography, Divider, Button, Stack,
  TextField, Avatar, CircularProgress, Alert, Chip
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { articlesAPI, votingAPI, authAPI } from '../service/api';

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

const NewsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState('');
  const isAuthenticated = authAPI.isAuthenticated();

  useEffect(() => {
    if (id) {
      fetchArticle();
    } else {
      setLoading(false);
      setError("Invalid Article ID");
    }
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await articlesAPI.getArticle(id);
      setArticle(data);
      
      setComments([
        { id: 1, author: 'John Doe', avatar: 'JD', timestamp: '2 hours ago', content: 'This seems neutral.' },
        { id: 2, author: 'Sarah Smith', avatar: 'SS', timestamp: '1 hour ago', content: 'Feels emotionally worded.' },
      ]);

    } catch (err) {
      console.error('Error fetching article:', err);
      setError('Failed to load the article.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (isBiased) => {
    if (!isAuthenticated) return alert('Login to vote');
    setVoting(true);
    try {
      const response = await votingAPI.voteArticle(id, isBiased);
      setArticle(prev => ({
        ...prev,
        vote_stats: response.vote_stats,
        user_vote: isBiased,
      }));
      setVoteSuccess(`Vote recorded: ${isBiased ? 'Biased' : 'Not Biased'}`);
      setTimeout(() => setVoteSuccess(''), 2500);
    } catch (err) {
      alert('Voting failed.');
    } finally {
      setVoting(false);
    }
  };

  const handleAddComment = () => {
    if (!isAuthenticated) return alert("Login to comment");
    if (!newComment.trim()) return;
    
    setComments([
      { id: Date.now(), author: 'You', avatar: 'ME', timestamp: 'Just now', content: newComment },
      ...comments
    ]);
    setNewComment('');
  };

  const formatDate = (d) => d ? d : "Recent";
  const getStat = (k) => article?.vote_stats?.[k] || 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <SearchNavbar />
        <Navbar />

        <Container maxWidth="lg" sx={{ py: 4 }}>

          {/* Loader */}
          {loading && (
            <Box sx={{ textAlign: 'center', mt: 12 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {!loading && (error || !article) && (
            <Box sx={{ textAlign: 'center', mt: 10 }}>
              <Alert severity="error" sx={{ maxWidth: 400, mx: 'auto', mb: 2 }}>
                {error || "Article not found"}
              </Alert>
              <Button variant="contained" onClick={() => navigate('/')}>Back Home</Button>
            </Box>
          )}

          {/* Main content */}
          {!loading && !error && article && (
            <Grid container spacing={3}>
              {/* Article */}
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                      {article.headline}
                    </Typography>

                    <Chip label={article.category} color="primary" size="small" sx={{ mb: 2 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16 }} />
                      {formatDate(article.publish_date)}
                    </Typography>

                    <Box sx={{ width: '100%', height: 350, my: 3, bgcolor: '#eee', borderRadius: 2, overflow: 'hidden' }}>
                      {article.featured_image && (
                        <img src={article.featured_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </Box>

                    <Button variant="outlined" href={article.article_link} target="_blank">Read Full Article</Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Sidebar */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Community Verdict</Typography>

                    <Box sx={{ my: 2 }}>
                      Not Biased: {getStat('not_biased_percentage')}% <br/>
                      Biased: {getStat('biased_percentage')}%
                    </Box>

                    {voteSuccess && <Alert severity="success">{voteSuccess}</Alert>}

                    <Button fullWidth variant="contained" sx={{ my: 1 }} onClick={() => handleVote(false)} disabled={voting}>
                      <ThumbUpIcon sx={{ mr: 1 }} /> Not Biased
                    </Button>

                    <Button fullWidth variant="outlined" color="error" onClick={() => handleVote(true)} disabled={voting}>
                      <ThumbDownIcon sx={{ mr: 1 }} /> Biased
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default NewsPage;
