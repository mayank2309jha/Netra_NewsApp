import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

const RecommendationContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
}));

const RecommendationTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.1rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const VideoCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  borderRadius: theme.spacing(1),
  '&:hover': {
    boxShadow: theme.shadows[8],
    '& .play-button': {
      opacity: 1,
    },
    '& .video-image': {
      transform: 'scale(1.05)',
    },
  },
}));

const VideoMediaContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.spacing(0.5),
}));

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 90,
  backgroundColor: theme.palette.grey[300],
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  opacity: 0,
  transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  color: '#ff0000',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  '&:hover': {
    backgroundColor: '#ffffff',
  },
}));

const VideoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
}));

const VideoChannel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

const ViewCount = styled(Typography)(({ theme }) => ({
  fontSize: '0.7rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.25),
}));

const YouTubeRecommendation = ({ onVideoClick }) => {
  const videos = [
    {
      id: 1,
      title: 'Breaking News: Latest Political Updates and Analysis',
      channel: 'News Today',
      views: '245K views',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+1',
      url: 'https://youtube.com/watch?v=1',
    },
    {
      id: 2,
      title: 'Global Markets Rally: Economic Recovery Continues',
      channel: 'Finance Channel',
      views: '156K views',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+2',
      url: 'https://youtube.com/watch?v=2',
    },
    {
      id: 3,
      title: 'Tech Innovation: AI and Machine Learning Breakthroughs',
      channel: 'Tech Weekly',
      views: '432K views',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+3',
      url: 'https://youtube.com/watch?v=3',
    },
    {
      id: 4,
      title: 'Sports Highlights: Champions League Finals Preview',
      channel: 'Sports Central',
      views: '512K views',
      thumbnail: 'https://via.placeholder.com/320x180?text=Video+4',
      url: 'https://youtube.com/watch?v=4',
    },
  ];

  const handleVideoClick = (video) => {
    onVideoClick?.(video);
    window.open(video.url, '_blank');
  };

  return (
    <RecommendationContainer elevation={1}>
      <RecommendationTitle variant="h6">
        YouTube Recommendations
      </RecommendationTitle>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            onClick={() => handleVideoClick(video)}
            elevation={0}
            sx={{ border: '1px solid #e0e0e0' }}
          >
            <VideoMediaContainer>
              <StyledCardMedia
                component="img"
                image={video.thumbnail}
                alt={video.title}
                className="video-image"
              />
              <PlayButton
                size="small"
                className="play-button"
              >
                <PlayCircleOutlineIcon sx={{ fontSize: '2rem' }} />
              </PlayButton>
            </VideoMediaContainer>

            <CardContent sx={{ p: 1 }}>
              <VideoTitle>{video.title}</VideoTitle>
              <VideoChannel variant="caption">
                {video.channel}
              </VideoChannel>
              <ViewCount variant="caption">
                {video.views}
              </ViewCount>
            </CardContent>
          </VideoCard>
        ))}
      </Box>
    </RecommendationContainer>
  );
};

export default YouTubeRecommendation;