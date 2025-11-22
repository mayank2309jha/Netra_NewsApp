import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Container,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

// Keyframe animation for ticker scroll
const scroll = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const TickerContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: '#1a1a1a',
  color: '#ffffff',
  padding: '12px 0',
  overflow: 'hidden',
  position: 'relative',
  marginBottom: '20px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
}));

const TickerLabel = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#d32f2f',
  padding: '8px 16px',
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 10,
  fontWeight: 'bold',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap',
}));

const DotIcon = styled(FiberManualRecordIcon)(({ theme }) => ({
  fontSize: '8px',
  animation: 'pulse 1.5s ease-in-out infinite',
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.5,
    },
  },
}));

const TickerContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  animation: `${scroll} 90s linear infinite`,
  '&:hover': {
    animationPlayState: 'paused',
  },
  marginLeft: '180px',
}));

const NewsItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  paddingRight: '30px',
  minWidth: 'max-content',
}));

const NewsDot = styled(Box)(({ theme }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: '#d32f2f',
  borderRadius: '50%',
  flexShrink: 0,
}));

const NewsText = styled(Typography)(({ theme }) => ({
  fontSize: '0.95rem',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#ffc107',
  },
  whiteSpace: 'nowrap',
}));

const BreakingNewsTicker = () => {
  const [news, setNews] = useState([
    {
      id: 1,
      title: 'Major political developments in India',
      category: 'India',
    },
    {
      id: 2,
      title: 'Global markets experience significant surge',
      category: 'Business',
    },
    {
      id: 3,
      title: 'New AI breakthrough announced by tech giant',
      category: 'Technology',
    },
    {
      id: 4,
      title: 'International climate summit reaches agreement',
      category: 'World',
    },
    {
      id: 5,
      title: 'Sports: Historic victory in international tournament',
      category: 'Sports',
    },
    {
      id: 6,
      title: 'Scientific discovery changes understanding of universe',
      category: 'Science',
    },
    {
      id: 7,
      title: 'Entertainment: Award ceremony reveals top winners',
      category: 'Entertainment',
    },
    {
      id: 8,
      title: 'Market trends show recovery in tech sector',
      category: 'Business',
    },
  ]);

  const getCategoryColor = (category) => {
    const colors = {
      India: '#ff5722',
      World: '#2196f3',
      Business: '#4caf50',
      Technology: '#9c27b0',
      Sports: '#ff9800',
      Science: '#00bcd4',
      Entertainment: '#e91e63',
    };
    return colors[category] || '#d32f2f';
  };

  // Duplicate news items for seamless scrolling
  const duplicatedNews = [...news, ...news, ...news];

  return (
    <TickerContainer elevation={3}>
      <TickerLabel>
        <DotIcon />
        <span>BREAKING NEWS</span>
      </TickerLabel>

      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TickerContent>
          {duplicatedNews.map((item, index) => (
            <NewsItem key={`${item.id}-${index}`}>
              <NewsDot />
              <NewsText>{item.title}</NewsText>
              <Chip
                label={item.category}
                size="small"
                sx={{
                  backgroundColor: getCategoryColor(item.category),
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  height: '24px',
                  flexShrink: 0,
                }}
              />
            </NewsItem>
          ))}
        </TickerContent>
      </Box>
    </TickerContainer>
  );
};

export default BreakingNewsTicker;