import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    '& .card-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const CardMediaStyled = styled(CardMedia)(({ theme }) => ({
  height: 200,
  overflow: 'hidden',
  backgroundColor: theme.palette.grey[300],
  '& img': {
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
}));

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
}));

const Headline = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  lineHeight: 1.4,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.primary,
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const SourceContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SourceLogo = styled(Avatar)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: theme.palette.primary.light,
  fontSize: '0.85rem',
  fontWeight: 'bold',
}));

const SourceInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.25),
  flex: 1,
}));

const SourceName = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const AuthorName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const PublishDate = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const NewsCard = ({ 
  headline, 
  image, 
  author, 
  sourceName, 
  sourceLogo, 
  publishDate, 
  category,
  onClick 
}) => {
  const getCategoryColor = (cat) => {
    const colors = {
      India: '#ff5722',
      World: '#2196f3',
      Business: '#4caf50',
      Technology: '#9c27b0',
      Sports: '#ff9800',
      Science: '#00bcd4',
      Entertainment: '#e91e63',
      Local: '#ffb300',
    };
    return colors[cat] || '#d32f2f';
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return `${d.getHours()}h ago`;
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const getSourceInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <StyledCard onClick={onClick} elevation={2}>
      {/* Card Image */}
      <CardMediaStyled
        className="card-image"
        image={image || 'https://via.placeholder.com/400x200?text=News+Image'}
        title={headline}
        component="img"
      />

      {/* Card Content */}
      <CardContentStyled>
        {/* Headline */}
        <Headline variant="h6">
          {headline || 'Untitled Article'}
        </Headline>

        {/* Source Information */}
        <SourceContainer>
          <SourceLogo>
            {getSourceInitials(sourceName)}
          </SourceLogo>
          <SourceInfo>
            <SourceName>{sourceName}</SourceName>
            <AuthorName>by {author || 'Unknown'}</AuthorName>
          </SourceInfo>
        </SourceContainer>

        {/* Publish Date and Category */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <PublishDate>
            <AccessTimeIcon sx={{ fontSize: '0.8rem' }} />
            {formatDate(publishDate)}
          </PublishDate>
          {category && (
            <Chip
              label={category}
              size="small"
              sx={{
                backgroundColor: getCategoryColor(category),
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                height: '24px',
              }}
            />
          )}
        </Box>
      </CardContentStyled>
    </StyledCard>
  );
};

export default NewsCard;