import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from 'react-router-dom';

const NewsCard = ({ article }) => {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  // Debug log to see what article data we're receiving
  React.useEffect(() => {
    console.log('NewsCard received article:', article);
  }, [article]);

  const handleCardClick = () => {
    navigate(`/article/${article.id}`);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    return dateString;
  };

  // Safety check for article object
  if (!article) {
    console.error('NewsCard: No article data provided');
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      }}
      onClick={handleCardClick}
    >
      {article.featured_image && !imageError ? (
        <CardMedia
          component="img"
          height="200"
          image={article.featured_image}
          alt={article.headline || 'Article image'}
          onError={handleImageError}
          sx={{ objectFit: 'cover', backgroundColor: '#f0f0f0' }}
        />
      ) : (
        <Box
          sx={{
            height: 200,
            backgroundColor: '#e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="textSecondary">
            No Image Available
          </Typography>
        </Box>
      )}
      <CardContent>
        {/* Category and Bookmark */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          {article.category && (
            <Chip
              label={article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              size="small"
              color="primary"
              sx={{ fontFamily: "'Inter', sans-serif" }}
            />
          )}
          <IconButton
            size="small"
            onClick={handleBookmarkClick}
            sx={{ ml: 'auto' }}
          >
            {bookmarked ? <BookmarkIcon color="primary" /> : <BookmarkBorderIcon />}
          </IconButton>
        </Box>

        {/* Headline */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            mb: 1,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.headline || 'Untitled Article'}
        </Typography>

        {/* Author */}
        {article.author && (
          <Typography
            variant="body2"
            sx={{
              color: '#666',
              fontFamily: "'Inter', sans-serif",
              mb: 1,
              fontSize: '0.875rem',
            }}
          >
            by {article.author}
          </Typography>
        )}

        {/* Source and Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {article.source_logo && !imageError && (
            <img
              src={article.source_logo}
              alt={article.source_name}
              style={{ width: 20, height: 20, objectFit: 'contain' }}
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
          <Typography variant="caption" sx={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>
            {article.source_name || 'Unknown Source'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            •
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 14, color: '#999' }} />
            <Typography variant="caption" sx={{ color: '#999', fontFamily: "'Inter', sans-serif" }}>
              {formatDate(article.publish_date)}
            </Typography>
          </Box>
        </Box>

        {/* Vote Stats */}
        {article.vote_stats && (
          <Box sx={{ display: 'flex', gap: 2, pt: 1, borderTop: '1px solid #f0f0f0' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbUpIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
              <Typography variant="caption" sx={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>
                {article.vote_stats.not_biased_percentage || 0}% Not Biased
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThumbDownIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
              <Typography variant="caption" sx={{ color: '#666', fontFamily: "'Inter', sans-serif" }}>
                {article.vote_stats.biased_percentage || 0}% Biased
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsCard;