import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Button,
  Stack,
  TextField,
  Avatar,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ArticleContent = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      timestamp: '2 hours ago',
      content: 'This article seems to present facts without much bias. The reporting is straightforward about the incident.',
    },
    {
      id: 2,
      author: 'Sarah Smith',
      avatar: 'SS',
      timestamp: '1 hour ago',
      content: 'I noticed the headline emphasizes tragedy more than providing factual updates. Could be seen as sensationalism.',
    },
    {
      id: 3,
      author: 'Mike Johnson',
      avatar: 'MJ',
      timestamp: '45 minutes ago',
      content: 'The coverage seems balanced. Government response is being documented properly without excessive criticism or praise.',
    },
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'You',
        avatar: 'YO',
        timestamp: 'just now',
        content: newComment,
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Main Content Area */}
        <Grid item xs={12} md={8}>
          <Card elevation={2} sx={{ mb: 4 }}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              {/* Source Info */}
              <Stack direction="row" spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
                <Box
                  sx={{height: '40px',width: '40px',borderRadius: '4px',backgroundColor: '#e0e0e0'}}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Hindustan Times
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    24-10-2025
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Headline */}
              <Typography variant="h4" component="h1" sx={{fontWeight: 700,mb: 2,lineHeight: 1.4,fontSize: { xs: 'h5.fontSize', md: 'h4.fontSize' }}}
              >
                More - Kurnool Bus Tragedy LIVE Updates: 19 bodies recovered, Telangana government sets up helpline
              </Typography>

              {/* Author */}
              <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
                By Unknown Author
              </Typography>

              {/* Featured Image Placeholder */}
              <Box sx={{width: '100%',height: '400px',borderRadius: 1,mb: 3,overflow: 'hidden',backgroundColor: '#e0e0e0',}}>
                  <img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQAsqchnsjWAto11GIB3Xk9qVap94Nrqe31NUPIGiSemT8toD9wVjjlARdUKnvb68CSMEc&fopt=w560-h336-rw-dcCVKGKDFkc4kC" alt="Featured article image"
                    style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}/>
              </Box>


              <Divider sx={{ mb: 3 }} />

              {/* Article Body */}
              <Typography variant="body1"sx={{lineHeight: 1.8,color: '#333',mb: 3,fontSize: '1rem',}}
              >
                This is the article content area. The article headline discusses important developments in the current news cycle. Users can read the full content here and then vote on whether they believe the article presents biased coverage or not.
                <br />
                <br />
                This voting mechanism helps identify patterns in media bias across different news publishers and channels. The community verdict is calculated based on user votes to determine the overall bias perception.
                <br />
                <br />
                Key points from the article include analysis of the news story, expert opinions, and contextual information to help users make an informed decision about bias.
              </Typography>

              {/* Source Link Button */}
              <Button
                variant="outlined"
                color="primary"
                sx={{ mt: 2 }}
              >
                Read Full Article on Source
              </Button>
            </CardContent>
          </Card>

          {/* Discussion Section */}
          <Card elevation={2}>
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Discussion ({comments.length})
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Comment Input */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Share your thoughts
                </Typography>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="What's your take on this article's bias?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f9f9f9',
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      endIcon={<SendIcon />}
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ mb: 3 }} />

              {/* Comments Thread */}
              <Stack spacing={3}>
                {comments.map((comment) => (
                  <Box key={comment.id}>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: '#1976d2',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                        }}
                      >
                        {comment.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {comment.author}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {comment.timestamp}
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#333',
                            lineHeight: 1.6,
                            backgroundColor: '#f5f5f5',
                            p: 1.5,
                            borderRadius: 1,
                          }}
                        >
                          {comment.content}
                        </Typography>
                      </Box>
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))}
              </Stack>

              {comments.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    No comments yet. Be the first to share your thoughts!
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar - Empty for now, can be used for related articles or sidebar widgets */}
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Related Articles
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArticleContent;