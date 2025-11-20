import React from 'react';
import {Container,Grid,Box,Card,CardContent,Typography,Divider,Chip,Paper,Button,Stack} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const ArticleContent = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh' }}>
      <Grid container spacing={3}>
        {/* Main Content Area - Left Side */}
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
              <Box
                sx={{width: '100%',height: '300px',backgroundColor: '#e0e0e0',borderRadius: 1,mb: 3,display: 'flex',alignItems: 'center',justifyContent: 'center'}}
              >
                <Typography color="textSecondary">Featured Image</Typography>
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
        </Grid>

        {/* Voting Panel - Right Side */}
        <Grid item xs={12} md={4}>
          {/* Voting Card */}
          <Card elevation={2} sx={{ position: 'sticky', top: 20, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6"sx={{fontWeight: 700,mb: 3,textAlign: 'center',color: '#1976d2',}}
              >
                Is This Article Biased?
              </Typography>

              <Stack spacing={2} sx={{ mb: 3 }}>
                {/* Biased Button */}
                <Button variant="outlined" color="error" fullWidth size="large" startIcon={<ThumbDownIcon />}sx={{py: 1.5,fontSize: '0.95rem',fontWeight: 600,}}
                >
                  Yes, It's Biased
                </Button>

                {/* Not Biased Button */}
                <Button variant="outlined" color="success" fullWidth size="large" startIcon={<ThumbUpIcon />} sx={{ py: 1.5, fontSize: '0.95rem',fontWeight: 600,}}
                >
                  No, It's Not Biased
                </Button>
              </Stack>

              <Divider sx={{ mb: 3 }} />

              {/* Voting Statistics */}
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textAlign: 'center',
                  color: '#666',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                }}
              >
                Community Verdict (1,245 votes)
              </Typography>

              {/* Biased Progress */}
              <Box sx={{ mb: 2.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Biased
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    765 (61%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: '61%',
                      backgroundColor: '#d32f2f',
                    }}
                  />
                </Box>
              </Box>

              {/* Not Biased Progress */}
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 1,
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    Not Biased
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>
                    480 (39%)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: '39%',
                      backgroundColor: '#388e3c',
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Article Metadata */}
          <Paper sx={{ p: 3, backgroundColor: '#f5f5f5' }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Article Info
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Source
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Hindustan Times
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Published
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  24-10-2025
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Author
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Unknown Author
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#999',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                  }}
                >
                  Community Verdict
                </Typography>
                <Chip
                  label="61% Found Biased"
                  color="error"
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArticleContent;