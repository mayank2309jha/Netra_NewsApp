// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Container,
//   Card,
//   CardContent,
//   CardMedia,
//   Grid,
// } from "@mui/material";
// import Navbar from "../components/Navbar";
// import SearchNavbar from "../components/SearchNavbar"

// // Mock news data by category
// const mockNewsData = {
//   india: [
//     {
//       id: 1,
//       title: "India's Economic Growth Reaches 7.2% in Q3",
//       description:
//         "India's GDP growth accelerates to 7.2% in the third quarter, driven by strong domestic consumption and investment.",
//       image:
//         "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=250&fit=crop",
//       category: "india",
//       date: "2024-11-20",
//     },
//     {
//       id: 2,
//       title: "New Rail Corridor Opens in Northern India",
//       description:
//         "A new high-speed rail corridor connecting major cities in Northern India is officially inaugurated.",
//       image:
//         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
//       category: "india",
//       date: "2024-11-19",
//     },
//     {
//       id: 3,
//       title: "Tech Industry Boom in Bangalore",
//       description:
//         "Bangalore sees record number of startup funding rounds as tech ecosystem continues to flourish.",
//       image:
//         "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
//       category: "india",
//       date: "2024-11-18",
//     },
//   ],
//   world: [
//     {
//       id: 4,
//       title: "Global Climate Summit Reaches Historic Agreement",
//       description:
//         "World leaders agree on new climate targets to limit global warming to 1.5 degrees Celsius.",
//       image:
//         "https://images.unsplash.com/photo-1569163139394-de4798aa62b3?w=400&h=250&fit=crop",
//       category: "world",
//       date: "2024-11-20",
//     },
//     {
//       id: 5,
//       title: "Space Agency Announces Mars Mission",
//       description:
//         "International space agency unveils plans for the first crewed mission to Mars scheduled for 2030.",
//       image:
//         "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop",
//       category: "world",
//       date: "2024-11-19",
//     },
//     {
//       id: 6,
//       title: "Trade Negotiations Between Major Economies",
//       description:
//         "US and EU finalize new trade agreement, reducing tariffs on multiple sectors.",
//       image:
//         "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
//       category: "world",
//       date: "2024-11-18",
//     },
//   ],
//   local: [
//     {
//       id: 7,
//       title: "City Council Approves New Park Development",
//       description:
//         "Local government approves a $50 million project to develop a new public park in the city center.",
//       image:
//         "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
//       category: "local",
//       date: "2024-11-20",
//     },
//     {
//       id: 8,
//       title: "Community Center Opens New Programs",
//       description:
//         "Local community center launches new educational and recreational programs for residents.",
//       image:
//         "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
//       category: "local",
//       date: "2024-11-19",
//     },
//     {
//       id: 9,
//       title: "Traffic Infrastructure Improvements Announced",
//       description:
//         "City announces plans to improve traffic flow with new smart traffic management system.",
//       image:
//         "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop",
//       category: "local",
//       date: "2024-11-18",
//     },
//   ],
//   sports: [
//     {
//       id: 10,
//       title: "India Cricket Team Wins T20 Series",
//       description:
//         "Indian cricket team clinches the T20 series with a thrilling final match victory.",
//       image:
//         "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
//       category: "sports",
//       date: "2024-11-20",
//     },
//     {
//       id: 11,
//       title: "Football World Cup Quarterfinals Begin",
//       description:
//         "The most anticipated quarterfinal matches of the football world cup begin today.",
//       image:
//         "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
//       category: "sports",
//       date: "2024-11-19",
//     },
//     {
//       id: 12,
//       title: "Tennis Champion Defends Title",
//       description:
//         "Defending champion successfully wins the international tennis tournament for the third year.",
//       image:
//         "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=250&fit=crop",
//       category: "sports",
//       date: "2024-11-18",
//     },
//   ],
//   business: [
//     {
//       id: 13,
//       title: "Tech Giant Announces New Product Line",
//       description:
//         "Leading technology company unveils revolutionary new product line targeting the enterprise market.",
//       image:
//         "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
//       category: "business",
//       date: "2024-11-20",
//     },
//     {
//       id: 14,
//       title: "Stock Market Reaches All-Time High",
//       description:
//         "Major stock indices reach record highs as investor confidence continues to grow.",
//       image:
//         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
//       category: "business",
//       date: "2024-11-19",
//     },
//     {
//       id: 15,
//       title: "Merger and Acquisition Activity Increases",
//       description:
//         "Corporate mergers and acquisitions reach record levels in 2024.",
//       image:
//         "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop",
//       category: "business",
//       date: "2024-11-18",
//     },
//   ],
//   science: [
//     {
//       id: 16,
//       title: "Breakthrough in Cancer Research",
//       description:
//         "Scientists discover new treatment method that shows 85% effectiveness in clinical trials.",
//       image:
//         "https://images.unsplash.com/photo-1576091160550-112173f7b856?w=400&h=250&fit=crop",
//       category: "science",
//       date: "2024-11-20",
//     },
//     {
//       id: 17,
//       title: "New Species Discovered in Deep Ocean",
//       description:
//         "Marine biologists discover a completely new species in the deepest parts of the ocean.",
//       image:
//         "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop",
//       category: "science",
//       date: "2024-11-19",
//     },
//     {
//       id: 18,
//       title: "Quantum Computing Advances Made",
//       description:
//         "Researchers achieve major milestone in quantum computing with improved error correction.",
//       image:
//         "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
//       category: "science",
//       date: "2024-11-18",
//     },
//   ],
//   technology: [
//     {
//       id: 19,
//       title: "AI Language Model Reaches New Capabilities",
//       description:
//         "Latest AI model demonstrates unprecedented understanding and generation of human language.",
//       image:
//         "https://images.unsplash.com/photo-1677442d019cecf8e57a4a01e5f12bb07f60ae0b0?w=400&h=250&fit=crop",
//       category: "technology",
//       date: "2024-11-20",
//     },
//     {
//       id: 20,
//       title: "Cybersecurity Threats on the Rise",
//       description:
//         "Experts warn of increasing cybersecurity threats targeting major corporations worldwide.",
//       image:
//         "https://images.unsplash.com/photo-1526374965328-7f5ae4e8b69e?w=400&h=250&fit=crop",
//       category: "technology",
//       date: "2024-11-19",
//     },
//     {
//       id: 21,
//       title: "5G Network Expansion Continues",
//       description:
//         "Major telecom companies expand 5G coverage to rural areas across the country.",
//       image:
//         "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
//       category: "technology",
//       date: "2024-11-18",
//     },
//   ],
//   entertainment: [
//     {
//       id: 22,
//       title: "Blockbuster Movie Breaks Box Office Records",
//       description:
//         "Latest superhero film becomes the highest-grossing movie in the studio's history.",
//       image:
//         "https://images.unsplash.com/photo-1489599849228-ed524120baf6?w=400&h=250&fit=crop",
//       category: "entertainment",
//       date: "2024-11-20",
//     },
//     {
//       id: 23,
//       title: "Music Festival Announces Star-Studded Lineup",
//       description:
//         "Annual music festival reveals exciting lineup featuring top international artists.",
//       image:
//         "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=250&fit=crop",
//       category: "entertainment",
//       date: "2024-11-19",
//     },
//     {
//       id: 24,
//       title: "Popular TV Series Gets Renewed for Season 5",
//       description:
//         "Hit television series receives renewal announcement after record-breaking viewership.",
//       image:
//         "https://images.unsplash.com/photo-1489599849228-ed524120baf6?w=400&h=250&fit=crop",
//       category: "entertainment",
//       date: "2024-11-18",
//     },
//   ],
// };

// const CategoryPage = () => {
//   const { category } = useParams();
//   const navigate = useNavigate();

//   // Get news for the current category, default to empty array if category doesn't exist
//   const news = mockNewsData[category?.toLowerCase()] || [];

//   const handleArticleClick = (id) => {
//     navigate(`/article/${id}`);
//   };

//   return (
//     <>
//       <SearchNavbar />
//       <Navbar />
//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         <Typography
//           variant="h4"
//           sx={{
//             mb: 4,
//             textTransform: "capitalize",
//             fontWeight: 600,
//             color: "#333333",
//           }}
//         >
//           {category} News
//         </Typography>

//         {news.length === 0 ? (
//           <Typography color="textSecondary">
//             No news found for this category.
//           </Typography>
//         ) : (
//           <Grid container spacing={3}>
//             {news.map((article) => (
//               <Grid item xs={12} sm={6} md={4} key={article.id}>
//                 <Card
//                   onClick={() => handleArticleClick(article.id)}
//                   sx={{
//                     cursor: "pointer",
//                     height: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     transition: "all 0.3s ease",
//                     "&:hover": {
//                       boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
//                       transform: "translateY(-4px)",
//                     },
//                   }}
//                 >
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={article.image}
//                     alt={article.title}
//                   />
//                   <CardContent sx={{ flexGrow: 1 }}>
//                     <Typography
//                       variant="h6"
//                       sx={{
//                         mb: 1,
//                         fontSize: "1.1rem",
//                         fontWeight: 600,
//                         color: "#000",
//                         lineHeight: 1.4,
//                       }}
//                     >
//                       {article.title}
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       color="textSecondary"
//                       sx={{ mb: 2, lineHeight: 1.5 }}
//                     >
//                       {article.description}
//                     </Typography>
//                     <Typography variant="caption" color="textSecondary">
//                       {new Date(article.date).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         )}
//       </Container>
//     </>
//   );
// };

// export default CategoryPage;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import Navbar from "../components/Navbar";
import SearchNavbar from "../components/SearchNavbar";
import NewsCard from "../components/NewsCard";
import { articlesAPI } from "../service/api";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (category) {
      fetchCategoryArticles();
    }
  }, [category]);

  const fetchCategoryArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await articlesAPI.getArticles({ category: category.toLowerCase() });
      setArticles(response.articles || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load category articles.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SearchNavbar />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 4, textTransform: "capitalize", fontWeight: 600 }}>
          {category} News
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : articles.length === 0 ? (
          <Typography color="textSecondary">No articles found for this category.</Typography>
        ) : (
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <NewsCard article={article} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default CategoryPage;
