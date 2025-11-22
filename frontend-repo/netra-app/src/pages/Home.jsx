import React, { useState } from 'react';
import Navbar from "../components/Navbar"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchNavbar from '../components/SearchNavbar';
import BreakingNewsTicker from "../components/BreakingNewsTicker";
import NewsCard from "../components/NewsCard";
import Filter from "../components/Filter";
import YouTubeRecommendation from "../components/YouTube";
import { Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function Home(){
  const navigate = useNavigate()
    const [filters, setFilters] = useState({
      categories: [],
      sources: [],
      dateRange: 'all',
    });

    const newsData = [
        {
            id: 1,
            headline: 'Breaking: Major Political Developments',
            image: 'https://via.placeholder.com/400x200?text=News+1',
            author: 'John Doe',
            sourceName: 'Times India',
            publishDate: new Date(),
            category: 'India',
        },
        {
            id: 2,
            headline: 'Global Markets React to Economic News',
            image: 'https://via.placeholder.com/400x200?text=News+2',
            author: 'Jane Smith',
            sourceName: 'Reuters',
            publishDate: new Date(Date.now() - 3600000),
            category: 'Business',
        },
        {
            id: 3,
            headline: 'New Technology Breakthrough Announced',
            image: 'https://via.placeholder.com/400x200?text=News+3',
            author: 'Tech Reporter',
            sourceName: 'Tech Crunch',
            publishDate: new Date(Date.now() - 7200000),
            category: 'Technology',
        },
        {
            id: 4,
            headline: 'Sports Team Wins Championship',
            image: 'https://via.placeholder.com/400x200?text=News+4',
            author: 'Sports Desk',
            sourceName: 'Sports Today',
            publishDate: new Date(Date.now() - 86400000),
            category: 'Sports',
        },
        {
            id: 5,
            headline: 'Entertainment Industry Update',
            image: 'https://via.placeholder.com/400x200?text=News+5',
            author: 'Entertainment Editor',
            sourceName: 'Bollywood Times',
            publishDate: new Date(Date.now() - 172800000),
            category: 'Entertainment',
        },
        {
            id: 6,
            headline: 'Scientific Discovery in Medical Field',
            image: 'https://via.placeholder.com/400x200?text=News+6',
            author: 'Science Correspondent',
            sourceName: 'Science Daily',
            publishDate: new Date(Date.now() - 259200000),
            category: 'Science',
        },
    ];

    const handleFilterChange = (newFilters) => {
      setFilters(newFilters);
      console.log('Filters applied:', newFilters);
    };

    const handleVideoClick = (video) => {
      console.log('Video clicked:', video);
    };

    return (
        <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <SearchNavbar />
                <Navbar />
                <BreakingNewsTicker/>
                
                {/* Main Content Area */}
                <Box sx={{ 
                  display: 'flex', 
                  px: 4,
                  py: 4,
                  gap: 4,
                  maxWidth: '1400px',
                  margin: '0 auto'
                }}>
                  {/* LEFT SIDEBAR: Fixed width */}
                  <Box sx={{ 
                    width: '320px',
                    flexShrink: 0,
                    position: 'sticky',
                    top: 20,
                    height: 'fit-content'
                  }}>
                    <Filter onFilterChange={handleFilterChange} />
                    <YouTubeRecommendation onVideoClick={handleVideoClick} />
                  </Box>

                  {/* RIGHT SECTION: News Cards Grid */}
                  <Box sx={{ 
                    flex: 1,
                    minWidth: 0
                  }}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 3,
                      '@media (max-width: 1024px)': {
                        gridTemplateColumns: '1fr',
                      },
                      '@media (max-width: 768px)': {
                        gridTemplateColumns: '1fr',
                      }
                    }}>
                      {newsData.map((news) => (
                        <NewsCard
                          key={news.id}
                          headline={news.headline}
                          image={news.image}
                          author={news.author}
                          sourceName={news.sourceName}
                          publishDate={news.publishDate}
                          category={news.category}
                          onClick={() => console.log('Clicked:', news.id)}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
            </div>
        </ThemeProvider>
    </>
    )
}

export default Home