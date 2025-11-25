// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   LinearProgress,
//   Chip,
//   CircularProgress,
//   Alert,
//   Button,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import {
//   Article,
//   HowToVote,
//   People,
//   Category,
//   Bookmark,
//   TrendingUp,
//   Business,
//   Person,
// } from "@mui/icons-material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
// } from "recharts";
// import { statsAPI } from "../service/api";
// import Navbar from "../components/Navbar";
// import SearchNavbar from "../components/SearchNavbar";

// // Color palette for charts
// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C", "#8DD1E1"];
// const BIAS_COLORS = { biased: "#ef5350", not_biased: "#66bb6a" };

// const Stats = () => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // All stats data
//   const [overview, setOverview] = useState(null);
//   const [votingStats, setVotingStats] = useState(null);
//   const [bookmarkStats, setBookmarkStats] = useState(null);
//   const [sourceStats, setSourceStats] = useState(null);
//   const [categoryStats, setCategoryStats] = useState(null);
//   const [authorStats, setAuthorStats] = useState(null);
//   const [engagementStats, setEngagementStats] = useState(null);

//   useEffect(() => {
//     fetchAllStats();
//   }, []);

//   const fetchAllStats = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await statsAPI.getAllStats();
//       setOverview(data.overview);
//       setVotingStats(data.voting);
//       setBookmarkStats(data.bookmarks);
//       setSourceStats(data.sources);
//       setCategoryStats(data.categories);
//       setAuthorStats(data.authors);
//       setEngagementStats(data.engagement);
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//       setError("Unable to load statistics. Please ensure the backend is running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   // Stat Card Component
//   const StatCard = ({ icon, title, value, color, subtitle }) => (
//     <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
//       <CardContent>
//         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//           <Box sx={{ backgroundColor: `${color}15`, borderRadius: 2, p: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
//             {icon}
//           </Box>
//           <Box>
//             <Typography variant="caption" sx={{ color: "#666", display: "block" }}>{title}</Typography>
//             <Typography variant="h4" sx={{ fontWeight: "bold" }}>{value?.toLocaleString() || 0}</Typography>
//             {subtitle && <Typography variant="caption" sx={{ color: "#999" }}>{subtitle}</Typography>}
//           </Box>
//         </Box>
//       </CardContent>
//     </Card>
//   );

//   // Section Card Component
//   const SectionCard = ({ title, children }) => (
//     <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, mb: 3 }}>
//       <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3 }}>{title}</Typography>
//       {children}
//     </Paper>
//   );

//   // Overview Tab Content
//   const OverviewContent = () => {
//     if (!overview) return null;
    
//     const categoryBreakdown = overview.category_stats?.map((cat, idx) => ({
//       name: cat.category?.charAt(0).toUpperCase() + cat.category?.slice(1),
//       count: cat.article_count,
//       percentage: overview.total_articles > 0 ? Math.round((cat.article_count / overview.total_articles) * 100) : 0,
//     })) || [];

//     return (
//       <>
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard icon={<Article sx={{ fontSize: 32, color: "#1976d2" }} />} title="Total Articles" value={overview.total_articles} color="#1976d2" subtitle={`Across ${overview.category_stats?.length || 0} categories`} />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard icon={<HowToVote sx={{ fontSize: 32, color: "#2e7d32" }} />} title="Total Votes" value={overview.total_votes} color="#2e7d32" subtitle="Community ratings" />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard icon={<People sx={{ fontSize: 32, color: "#ed6c02" }} />} title="Active Users" value={overview.total_users} color="#ed6c02" subtitle="Registered members" />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard icon={<Bookmark sx={{ fontSize: 32, color: "#9c27b0" }} />} title="Bookmarks" value={overview.total_bookmarks} color="#9c27b0" subtitle="Saved articles" />
//           </Grid>
//         </Grid>

//         <Grid container spacing={3}>
//           <Grid item xs={12} md={8}>
//             <SectionCard title="Articles by Category">
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 {categoryBreakdown.map((category, index) => (
//                   <Box key={index}>
//                     <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 500 }}>{category.name}</Typography>
//                       <Typography variant="body2" sx={{ color: "#666" }}>{category.count} articles ({category.percentage}%)</Typography>
//                     </Box>
//                     <LinearProgress variant="determinate" value={Math.min(category.percentage * 2, 100)} sx={{ height: 8, borderRadius: 1, backgroundColor: "#e0e0e0", "& .MuiLinearProgress-bar": { backgroundColor: COLORS[index % COLORS.length], borderRadius: 1 } }} />
//                   </Box>
//                 ))}
//               </Box>
//             </SectionCard>
//           </Grid>

//           <Grid item xs={12} md={4}>
//             <SectionCard title="Overall Bias Rating">
//               <Box sx={{ textAlign: "center", py: 2 }}>
//                 <Typography variant="h2" sx={{ fontWeight: "bold", mb: 1 }}>{overview.bias_percentage}%</Typography>
//                 <Chip label="Biased" sx={{ backgroundColor: overview.bias_percentage > 50 ? "#ef5350" : "#66bb6a", color: "#fff", fontWeight: 600 }} />
//                 <Typography variant="body2" sx={{ color: "#666", mt: 2 }}>Based on {overview.total_votes?.toLocaleString()} community votes</Typography>
//               </Box>
//             </SectionCard>

//             <SectionCard title="Recent Activity">
//               <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//                 {overview.recent_activity?.slice(0, 5).map((activity, index) => (
//                   <Box key={index}>
//                     <Typography variant="body2" sx={{ mb: 0.5 }}>{activity.action}</Typography>
//                     <Typography variant="caption" sx={{ color: "#999" }}>{activity.time}</Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </SectionCard>
//           </Grid>
//         </Grid>
//       </>
//     );
//   };

//   // Voting Patterns Tab Content
//   const VotingPatternsContent = () => {
//     if (!votingStats) return <Typography>No voting data available</Typography>;

//     const sourceData = votingStats.votes_by_source?.slice(0, 8).map(s => ({
//       name: s.source?.substring(0, 15) || "Unknown",
//       biased: s.biased,
//       notBiased: s.not_biased,
//     }));

//     const categoryData = votingStats.votes_by_category?.map(c => ({
//       name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
//       biased: c.biased,
//       notBiased: c.not_biased,
//       biasRatio: c.bias_ratio,
//     }));

//     const timeData = votingStats.votes_over_time?.map(t => ({
//       date: t.date?.substring(5),
//       biased: t.biased,
//       notBiased: t.not_biased,
//     }));

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <SectionCard title="Votes by News Source">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={sourceData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="notBiased" name="Not Biased" fill={BIAS_COLORS.not_biased} />
//                 <Bar dataKey="biased" name="Biased" fill={BIAS_COLORS.biased} />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Votes by Category">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={categoryData} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="notBiased" name="Not Biased" fill={BIAS_COLORS.not_biased} stackId="a" />
//                 <Bar dataKey="biased" name="Biased" fill={BIAS_COLORS.biased} stackId="a" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Bias Ratio by Category">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} label={({ name, biasRatio }) => `${name}: ${biasRatio}%`} outerRadius={100} fill="#8884d8" dataKey="biasRatio">
//                   {categoryData?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12}>
//           <SectionCard title="Voting Trends Over Time (Last 30 Days)">
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={timeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Area type="monotone" dataKey="notBiased" name="Not Biased" stackId="1" stroke={BIAS_COLORS.not_biased} fill={BIAS_COLORS.not_biased} />
//                 <Area type="monotone" dataKey="biased" name="Biased" stackId="1" stroke={BIAS_COLORS.biased} fill={BIAS_COLORS.biased} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Bookmark Patterns Tab Content
//   const BookmarkPatternsContent = () => {
//     if (!bookmarkStats) return <Typography>No bookmark data available</Typography>;

//     const sourceData = bookmarkStats.bookmarks_by_source?.map(s => ({
//       name: s.source?.substring(0, 20) || "Unknown",
//       value: s.count,
//     }));

//     const categoryData = bookmarkStats.bookmarks_by_category?.map(c => ({
//       name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
//       count: c.count,
//     }));

//     const timeData = bookmarkStats.bookmarks_over_time?.map(t => ({
//       date: t.date?.substring(5),
//       count: t.count,
//     }));

//     const biasData = [
//       { name: "Not Biased", value: bookmarkStats.bookmarked_bias_distribution?.not_biased || 0 },
//       { name: "Biased", value: bookmarkStats.bookmarked_bias_distribution?.biased || 0 },
//     ];

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <SectionCard title="Bookmarks by News Source">
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie data={sourceData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} outerRadius={100} fill="#8884d8" dataKey="value">
//                   {sourceData?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Bookmarks by Category">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={categoryData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="#9c27b0" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Bias in Bookmarked Articles">
//             <ResponsiveContainer width="100%" height={250}>
//               <PieChart>
//                 <Pie data={biasData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value" label>
//                   <Cell fill={BIAS_COLORS.not_biased} />
//                   <Cell fill={BIAS_COLORS.biased} />
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Bookmarks Over Time">
//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={timeData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="count" stroke="#9c27b0" strokeWidth={2} dot={{ fill: "#9c27b0" }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Agency/Source Patterns Tab Content
//   const AgencyPatternsContent = () => {
//     if (!sourceStats) return <Typography>No source data available</Typography>;

//     const biasData = sourceStats.bias_by_source?.slice(0, 10).map(s => ({
//       name: s.source?.substring(0, 15) || "Unknown",
//       biasRatio: s.bias_ratio,
//       totalVotes: s.total_votes,
//     }));

//     const lovedData = sourceStats.most_loved_sources?.slice(0, 8).map(s => ({
//       name: s.source?.substring(0, 15) || "Unknown",
//       votes: s.not_biased_votes,
//     }));

//     const leastTrustedData = sourceStats.least_trusted_sources?.slice(0, 8).map(s => ({
//       name: s.source?.substring(0, 15) || "Unknown",
//       biasRatio: s.bias_ratio,
//     }));

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <SectionCard title="Bias Ratio by News Source">
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={biasData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
//                 <YAxis label={{ value: "Bias %", angle: -90, position: "insideLeft" }} />
//                 <Tooltip formatter={(value) => `${value}%`} />
//                 <Bar dataKey="biasRatio" name="Bias Ratio" fill="#ff7043">
//                   {biasData?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Most Loved Sources (Not Biased Votes)">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={lovedData} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Bar dataKey="votes" fill="#66bb6a" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Least Trusted Sources (Highest Bias)">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={leastTrustedData} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" domain={[0, 100]} />
//                 <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
//                 <Tooltip formatter={(value) => `${value}%`} />
//                 <Bar dataKey="biasRatio" fill="#ef5350" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Category Info Tab Content
//   const CategoryInfoContent = () => {
//     if (!categoryStats) return <Typography>No category data available</Typography>;

//     const overviewData = categoryStats.category_overview?.map(c => ({
//       name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
//       articles: c.articles,
//       votes: c.votes,
//       bookmarks: c.bookmarks,
//     }));

//     const biasData = categoryStats.bias_by_category?.map(c => ({
//       name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
//       biasRatio: c.bias_ratio,
//     }));

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <SectionCard title="Category Overview">
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={overviewData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="articles" name="Articles" fill="#1976d2" />
//                 <Bar dataKey="votes" name="Votes" fill="#2e7d32" />
//                 <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12}>
//           <SectionCard title="Bias Ratio per Category">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={biasData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                 <YAxis domain={[0, 100]} label={{ value: "Bias %", angle: -90, position: "insideLeft" }} />
//                 <Tooltip formatter={(value) => `${value}%`} />
//                 <Bar dataKey="biasRatio" name="Bias Ratio">
//                   {biasData?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Author Info Tab Content
//   const AuthorInfoContent = () => {
//     if (!authorStats) return <Typography>No author data available</Typography>;

//     const topAuthors = authorStats.top_authors?.slice(0, 10).map(a => ({
//       name: a.author?.substring(0, 20) || "Unknown",
//       articles: a.articles,
//       sources: a.sources,
//     }));

//     const authorBias = authorStats.author_bias?.slice(0, 10).map(a => ({
//       name: a.author?.substring(0, 20) || "Unknown",
//       biasRatio: a.bias_ratio,
//       totalVotes: a.total_votes,
//     }));

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <SectionCard title="Top Authors by Article Count">
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={topAuthors} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="articles" name="Articles" fill="#1976d2" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Author Bias Ratings">
//             <ResponsiveContainer width="100%" height={350}>
//               <BarChart data={authorBias} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" domain={[0, 100]} />
//                 <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11 }} />
//                 <Tooltip formatter={(value, name) => name === "biasRatio" ? `${value}%` : value} />
//                 <Bar dataKey="biasRatio" name="Bias Ratio %">
//                   {authorBias?.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Engagement Patterns Tab Content
//   const EngagementPatternsContent = () => {
//     if (!engagementStats) return <Typography>No engagement data available</Typography>;

//     const dailyVotes = engagementStats.daily_votes?.map(d => ({
//       date: d.date?.substring(5),
//       count: d.count,
//     }));

//     const engagementByCategory = engagementStats.engagement_by_category?.map(e => ({
//       name: e.category?.charAt(0).toUpperCase() + e.category?.slice(1),
//       votes: e.votes,
//       bookmarks: e.bookmarks,
//     }));

//     const topUsers = engagementStats.most_engaged_users?.map(u => ({
//       name: u.username,
//       votes: u.votes,
//       bookmarks: u.bookmarks,
//       total: u.votes + u.bookmarks,
//     }));

//     return (
//       <Grid container spacing={3}>
//         <Grid item xs={12}>
//           <SectionCard title="Daily Voting Activity (Last 30 Days)">
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={dailyVotes}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="date" tick={{ fontSize: 12 }} />
//                 <YAxis />
//                 <Tooltip />
//                 <Area type="monotone" dataKey="count" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Engagement by Category">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={engagementByCategory}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="votes" name="Votes" fill="#2e7d32" />
//                 <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <SectionCard title="Most Engaged Users">
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={topUsers} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="votes" name="Votes" fill="#2e7d32" stackId="a" />
//                 <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" stackId="a" />
//               </BarChart>
//             </ResponsiveContainer>
//           </SectionCard>
//         </Grid>
//       </Grid>
//     );
//   };

//   // Tab content mapping
//   const tabContent = [
//     { label: "Overview", icon: <TrendingUp />, content: <OverviewContent /> },
//     { label: "Voting Patterns", icon: <HowToVote />, content: <VotingPatternsContent /> },
//     { label: "Bookmark Patterns", icon: <Bookmark />, content: <BookmarkPatternsContent /> },
//     { label: "News Agencies", icon: <Business />, content: <AgencyPatternsContent /> },
//     { label: "Categories", icon: <Category />, content: <CategoryInfoContent /> },
//     { label: "Authors", icon: <Person />, content: <AuthorInfoContent /> },
//     { label: "Engagement", icon: <People />, content: <EngagementPatternsContent /> },
//   ];

//   return (
//     <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
//       <SearchNavbar />
//       <Navbar />

//       <Container maxWidth="lg" sx={{ py: 4 }}>
//         {loading && (
//           <Box sx={{ textAlign: "center", mt: 10 }}>
//             <CircularProgress size={60} />
//             <Typography sx={{ mt: 2 }}>Loading statistics...</Typography>
//           </Box>
//         )}

//         {error && (
//           <Box sx={{ textAlign: "center", mt: 10 }}>
//             <Alert severity="error" sx={{ mb: 2, maxWidth: 500, mx: "auto" }}>{error}</Alert>
//             <Button variant="contained" onClick={fetchAllStats}>Retry</Button>
//           </Box>
//         )}

//         {!loading && !error && (
//           <>
//             <Box sx={{ mb: 4 }}>
//               <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>Platform Statistics</Typography>
//               <Typography variant="body1" sx={{ color: "#666" }}>Real-time overview of NETRA platform activity and bias analysis</Typography>
//             </Box>

//             <Paper elevation={0} sx={{ mb: 3, border: "1px solid #e0e0e0" }}>
//               <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider" }}>
//                 {tabContent.map((tab, index) => (
//                   <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" sx={{ textTransform: "none", fontWeight: activeTab === index ? 600 : 400 }} />
//                 ))}
//               </Tabs>
//             </Paper>

//             <Box sx={{ mt: 3 }}>
//               {tabContent[activeTab].content}
//             </Box>
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// };

// export default Stats;

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Article,
  HowToVote,
  People,
  Category,
  Bookmark,
  TrendingUp,
  Business,
  Person,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { statsAPI } from "../service/api";
import Navbar from "../components/Navbar";
import SearchNavbar from "../components/SearchNavbar";

// Color palette for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C", "#8DD1E1"];
const BIAS_COLORS = { biased: "#ef5350", not_biased: "#66bb6a" };

const Stats = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // All stats data
  const [overview, setOverview] = useState(null);
  const [votingStats, setVotingStats] = useState(null);
  const [bookmarkStats, setBookmarkStats] = useState(null);
  const [sourceStats, setSourceStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [authorStats, setAuthorStats] = useState(null);
  const [engagementStats, setEngagementStats] = useState(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsAPI.getAllStats();
      setOverview(data.overview);
      setVotingStats(data.voting);
      setBookmarkStats(data.bookmarks);
      setSourceStats(data.sources);
      setCategoryStats(data.categories);
      setAuthorStats(data.authors);
      setEngagementStats(data.engagement);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Unable to load statistics. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Stat Card Component
  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <Card elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 2, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ backgroundColor: `${color}15`, borderRadius: 2, p: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#666", display: "block" }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>{value?.toLocaleString() || 0}</Typography>
            {subtitle && <Typography variant="caption" sx={{ color: "#999" }}>{subtitle}</Typography>}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // Section Card Component - Full Width
  const SectionCard = ({ title, children, minHeight = 400 }) => (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #e0e0e0", borderRadius: 2, mb: 4, minHeight }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 3, borderBottom: "2px solid #1976d2", pb: 1, display: "inline-block" }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  // Custom tooltip for better readability
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ backgroundColor: "white", p: 2, border: "1px solid #ccc", borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>{label}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </Typography>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Overview Tab Content
  const OverviewContent = () => {
    if (!overview) return null;
    
    const categoryBreakdown = overview.category_stats?.map((cat, idx) => ({
      name: cat.category?.charAt(0).toUpperCase() + cat.category?.slice(1),
      count: cat.article_count,
      percentage: overview.total_articles > 0 ? Math.round((cat.article_count / overview.total_articles) * 100) : 0,
    })) || [];

    return (
      <>
        {/* Stat Cards Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<Article sx={{ fontSize: 32, color: "#1976d2" }} />} title="Total Articles" value={overview.total_articles} color="#1976d2" subtitle={`Across ${overview.category_stats?.length || 0} categories`} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<HowToVote sx={{ fontSize: 32, color: "#2e7d32" }} />} title="Total Votes" value={overview.total_votes} color="#2e7d32" subtitle="Community ratings" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<People sx={{ fontSize: 32, color: "#ed6c02" }} />} title="Active Users" value={overview.total_users} color="#ed6c02" subtitle="Registered members" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard icon={<Bookmark sx={{ fontSize: 32, color: "#9c27b0" }} />} title="Bookmarks" value={overview.total_bookmarks} color="#9c27b0" subtitle="Saved articles" />
          </Grid>
        </Grid>

        {/* Overall Bias Rating */}
        <SectionCard title="Overall Bias Rating" minHeight={200}>
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2, fontSize: "4rem" }}>{overview.bias_percentage}%</Typography>
            <Chip 
              label={overview.bias_percentage > 50 ? "Biased" : "Not Biased"} 
              sx={{ 
                backgroundColor: overview.bias_percentage > 50 ? "#ef5350" : "#66bb6a", 
                color: "#fff", 
                fontWeight: 600,
                fontSize: "1rem",
                px: 2,
                py: 1
              }} 
            />
            <Typography variant="body1" sx={{ color: "#666", mt: 2 }}>
              Based on {overview.total_votes?.toLocaleString()} community votes
            </Typography>
          </Box>
        </SectionCard>

        {/* Articles by Category */}
        <SectionCard title="Articles by Category" minHeight={450}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            {categoryBreakdown.map((category, index) => (
              <Box key={index}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{category.name}</Typography>
                  <Typography variant="body1" sx={{ color: "#666" }}>{category.count} articles ({category.percentage}%)</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(category.percentage * 2, 100)} 
                  sx={{ 
                    height: 12, 
                    borderRadius: 2, 
                    backgroundColor: "#e0e0e0", 
                    "& .MuiLinearProgress-bar": { 
                      backgroundColor: COLORS[index % COLORS.length], 
                      borderRadius: 2 
                    } 
                  }} 
                />
              </Box>
            ))}
          </Box>
        </SectionCard>

        {/* Recent Activity */}
        <SectionCard title="Recent Activity" minHeight={300}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {overview.recent_activity?.slice(0, 8).map((activity, index) => (
              <Box key={index} sx={{ p: 2, backgroundColor: "#f9f9f9", borderRadius: 1, borderLeft: "4px solid #1976d2" }}>
                <Typography variant="body1" sx={{ mb: 0.5 }}>{activity.action}</Typography>
                <Typography variant="caption" sx={{ color: "#999" }}>{activity.time}</Typography>
              </Box>
            ))}
          </Box>
        </SectionCard>
      </>
    );
  };

  // Voting Patterns Tab Content
  const VotingPatternsContent = () => {
    if (!votingStats) return <Typography>No voting data available</Typography>;

    const sourceData = votingStats.votes_by_source?.slice(0, 10).map(s => ({
      name: s.source?.substring(0, 20) || "Unknown",
      biased: s.biased,
      notBiased: s.not_biased,
    }));

    const categoryData = votingStats.votes_by_category?.map(c => ({
      name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
      biased: c.biased,
      notBiased: c.not_biased,
      biasRatio: c.bias_ratio,
    }));

    const timeData = votingStats.votes_over_time?.map(t => ({
      date: t.date?.substring(5),
      biased: t.biased,
      notBiased: t.not_biased,
    }));

    return (
      <>
        {/* Votes by News Source */}
        <SectionCard title="Votes by News Source" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={sourceData} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                angle={-45} 
                textAnchor="end" 
                height={100}
                interval={0}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Bar dataKey="notBiased" name="Not Biased" fill={BIAS_COLORS.not_biased} radius={[4, 4, 0, 0]} />
              <Bar dataKey="biased" name="Biased" fill={BIAS_COLORS.biased} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Votes by Category */}
        <SectionCard title="Votes by Category" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 13 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="notBiased" name="Not Biased" fill={BIAS_COLORS.not_biased} stackId="a" radius={[0, 4, 4, 0]} />
              <Bar dataKey="biased" name="Biased" fill={BIAS_COLORS.biased} stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Bias Ratio by Category - Pie Chart */}
        <SectionCard title="Bias Ratio by Category" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie 
                data={categoryData} 
                cx="50%" 
                cy="50%" 
                labelLine={true}
                label={({ name, biasRatio }) => `${name}: ${biasRatio}%`}
                outerRadius={150} 
                fill="#8884d8" 
                dataKey="biasRatio"
              >
                {categoryData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Voting Trends Over Time */}
        <SectionCard title="Voting Trends Over Time (Last 30 Days)" minHeight={450}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="notBiased" name="Not Biased" stackId="1" stroke={BIAS_COLORS.not_biased} fill={BIAS_COLORS.not_biased} fillOpacity={0.8} />
              <Area type="monotone" dataKey="biased" name="Biased" stackId="1" stroke={BIAS_COLORS.biased} fill={BIAS_COLORS.biased} fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </>
    );
  };

  // Bookmark Patterns Tab Content
  const BookmarkPatternsContent = () => {
    if (!bookmarkStats) return <Typography>No bookmark data available</Typography>;

    const sourceData = bookmarkStats.bookmarks_by_source?.map(s => ({
      name: s.source?.substring(0, 25) || "Unknown",
      value: s.count,
    }));

    const categoryData = bookmarkStats.bookmarks_by_category?.map(c => ({
      name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
      count: c.count,
    }));

    const timeData = bookmarkStats.bookmarks_over_time?.map(t => ({
      date: t.date?.substring(5),
      count: t.count,
    }));

    const biasData = [
      { name: "Not Biased", value: bookmarkStats.bookmarked_bias_distribution?.not_biased || 0 },
      { name: "Biased", value: bookmarkStats.bookmarked_bias_distribution?.biased || 0 },
    ];

    return (
      <>
        {/* Bookmarks by News Source - Pie */}
        <SectionCard title="Bookmarks by News Source" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <PieChart>
              <Pie 
                data={sourceData} 
                cx="50%" 
                cy="50%" 
                labelLine={true}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={150} 
                fill="#8884d8" 
                dataKey="value"
              >
                {sourceData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Bookmarks by Category - Bar */}
        <SectionCard title="Bookmarks by Category" minHeight={450}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Bookmarks" fill="#9c27b0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Bias in Bookmarked Articles */}
        <SectionCard title="Bias Distribution in Bookmarked Articles" minHeight={450}>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie 
                data={biasData} 
                cx="50%" 
                cy="50%" 
                innerRadius={80}
                outerRadius={150} 
                fill="#8884d8" 
                dataKey="value" 
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(1)}%)`}
              >
                <Cell fill={BIAS_COLORS.not_biased} />
                <Cell fill={BIAS_COLORS.biased} />
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Bookmarks Over Time */}
        <SectionCard title="Bookmarks Over Time (Last 30 Days)" minHeight={400}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="count" name="Bookmarks" stroke="#9c27b0" strokeWidth={3} dot={{ fill: "#9c27b0", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </>
    );
  };

  // Agency/Source Patterns Tab Content
  const AgencyPatternsContent = () => {
    if (!sourceStats) return <Typography>No source data available</Typography>;

    const biasData = sourceStats.bias_by_source?.slice(0, 12).map(s => ({
      name: s.source?.substring(0, 18) || "Unknown",
      biasRatio: s.bias_ratio,
      totalVotes: s.total_votes,
    }));

    const lovedData = sourceStats.most_loved_sources?.slice(0, 10).map(s => ({
      name: s.source?.substring(0, 20) || "Unknown",
      votes: s.not_biased_votes,
    }));

    const leastTrustedData = sourceStats.least_trusted_sources?.slice(0, 10).map(s => ({
      name: s.source?.substring(0, 20) || "Unknown",
      biasRatio: s.bias_ratio,
    }));

    return (
      <>
        {/* Bias Ratio by News Source */}
        <SectionCard title="Bias Ratio by News Source" minHeight={550}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={biasData} margin={{ top: 20, right: 30, left: 20, bottom: 120 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={120} interval={0} />
              <YAxis label={{ value: "Bias %", angle: -90, position: "insideLeft" }} domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              <Bar dataKey="biasRatio" name="Bias Ratio %" radius={[4, 4, 0, 0]}>
                {biasData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Most Loved Sources */}
        <SectionCard title="Most Loved Sources (Highest Not-Biased Votes)" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={lovedData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="votes" name="Not Biased Votes" fill="#66bb6a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Least Trusted Sources */}
        <SectionCard title="Least Trusted Sources (Highest Bias Ratio)" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={leastTrustedData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="biasRatio" name="Bias Ratio %" fill="#ef5350" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </>
    );
  };

  // Category Info Tab Content
  const CategoryInfoContent = () => {
    if (!categoryStats) return <Typography>No category data available</Typography>;

    const overviewData = categoryStats.category_overview?.map(c => ({
      name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
      articles: c.articles,
      votes: c.votes,
      bookmarks: c.bookmarks,
    }));

    const biasData = categoryStats.bias_by_category?.map(c => ({
      name: c.category?.charAt(0).toUpperCase() + c.category?.slice(1),
      biasRatio: c.bias_ratio,
      totalVotes: c.total_votes,
    }));

    return (
      <>
        {/* Category Overview */}
        <SectionCard title="Category Overview (Articles, Votes, Bookmarks)" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={overviewData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="articles" name="Articles" fill="#1976d2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="votes" name="Votes" fill="#2e7d32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Bias Ratio per Category */}
        <SectionCard title="Bias Ratio per Category" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={biasData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis domain={[0, 100]} label={{ value: "Bias %", angle: -90, position: "insideLeft" }} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
              <Bar dataKey="biasRatio" name="Bias Ratio %" radius={[4, 4, 0, 0]}>
                {biasData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Category Stats Table */}
        <SectionCard title="Category Statistics Summary" minHeight={300}>
          <Box sx={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Category</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #ddd" }}>Articles</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #ddd" }}>Votes</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #ddd" }}>Bookmarks</th>
                  <th style={{ padding: "12px 16px", textAlign: "right", borderBottom: "2px solid #ddd" }}>Bias Ratio</th>
                </tr>
              </thead>
              <tbody>
                {overviewData?.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 500 }}>{cat.name}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>{cat.articles}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>{cat.votes}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>{cat.bookmarks}</td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <Chip 
                        label={`${biasData?.[idx]?.biasRatio || 0}%`}
                        size="small"
                        sx={{ 
                          backgroundColor: (biasData?.[idx]?.biasRatio || 0) > 50 ? "#ffebee" : "#e8f5e9",
                          color: (biasData?.[idx]?.biasRatio || 0) > 50 ? "#c62828" : "#2e7d32",
                          fontWeight: 600
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </SectionCard>
      </>
    );
  };

  // Author Info Tab Content
  const AuthorInfoContent = () => {
    if (!authorStats) return <Typography>No author data available</Typography>;

    const topAuthors = authorStats.top_authors?.slice(0, 15).map(a => ({
      name: a.author?.substring(0, 25) || "Unknown",
      articles: a.articles,
      sources: a.sources,
    }));

    const authorBias = authorStats.author_bias?.slice(0, 15).map(a => ({
      name: a.author?.substring(0, 25) || "Unknown",
      biasRatio: a.bias_ratio,
      totalVotes: a.total_votes,
    }));

    return (
      <>
        {/* Top Authors by Article Count */}
        <SectionCard title="Top Authors by Article Count" minHeight={550}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={topAuthors} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="articles" name="Articles" fill="#1976d2" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Author Bias Ratings */}
        <SectionCard title="Author Bias Ratings" minHeight={550}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={authorBias} layout="vertical" margin={{ top: 20, right: 30, left: 150, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value, name) => name === "biasRatio" ? `${value}%` : value} />
              <Legend />
              <Bar dataKey="biasRatio" name="Bias Ratio %" radius={[0, 4, 4, 0]}>
                {authorBias?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.biasRatio > 50 ? "#ef5350" : "#66bb6a"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </>
    );
  };

  // Engagement Patterns Tab Content
  const EngagementPatternsContent = () => {
    if (!engagementStats) return <Typography>No engagement data available</Typography>;

    const dailyVotes = engagementStats.daily_votes?.map(d => ({
      date: d.date?.substring(5),
      count: d.count,
    }));

    const engagementByCategory = engagementStats.engagement_by_category?.map(e => ({
      name: e.category?.charAt(0).toUpperCase() + e.category?.slice(1),
      votes: e.votes,
      bookmarks: e.bookmarks,
    }));

    const topUsers = engagementStats.most_engaged_users?.map(u => ({
      name: u.username?.substring(0, 20),
      votes: u.votes,
      bookmarks: u.bookmarks,
      total: u.votes + u.bookmarks,
    }));

    return (
      <>
        {/* Daily Voting Activity */}
        <SectionCard title="Daily Voting Activity (Last 30 Days)" minHeight={450}>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={dailyVotes} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="count" name="Votes" stroke="#1976d2" fill="#1976d2" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Engagement by Category */}
        <SectionCard title="Engagement by Category" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={engagementByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} interval={0} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="votes" name="Votes" fill="#2e7d32" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Most Engaged Users */}
        <SectionCard title="Most Engaged Users" minHeight={500}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={topUsers} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="votes" name="Votes" fill="#2e7d32" stackId="a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="bookmarks" name="Bookmarks" fill="#9c27b0" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </>
    );
  };

  // Tab content mapping
  const tabContent = [
    { label: "Overview", icon: <TrendingUp />, content: <OverviewContent /> },
    { label: "Voting Patterns", icon: <HowToVote />, content: <VotingPatternsContent /> },
    { label: "Bookmark Patterns", icon: <Bookmark />, content: <BookmarkPatternsContent /> },
    { label: "News Agencies", icon: <Business />, content: <AgencyPatternsContent /> },
    { label: "Categories", icon: <Category />, content: <CategoryInfoContent /> },
    { label: "Authors", icon: <Person />, content: <AuthorInfoContent /> },
    { label: "Engagement", icon: <People />, content: <EngagementPatternsContent /> },
  ];

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <SearchNavbar />
      <Navbar />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {loading && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <CircularProgress size={60} />
            <Typography sx={{ mt: 2 }}>Loading statistics...</Typography>
          </Box>
        )}

        {error && (
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Alert severity="error" sx={{ mb: 2, maxWidth: 500, mx: "auto" }}>{error}</Alert>
            <Button variant="contained" onClick={fetchAllStats}>Retry</Button>
          </Box>
        )}

        {!loading && !error && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>Platform Statistics</Typography>
              <Typography variant="body1" sx={{ color: "#666" }}>Real-time overview of NETRA platform activity and bias analysis</Typography>
            </Box>

            <Paper elevation={0} sx={{ mb: 4, border: "1px solid #e0e0e0", borderRadius: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="scrollable" 
                scrollButtons="auto" 
                sx={{ 
                  borderBottom: 1, 
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    minHeight: 60,
                    textTransform: "none",
                    fontSize: "0.95rem"
                  }
                }}
              >
                {tabContent.map((tab, index) => (
                  <Tab 
                    key={index} 
                    label={tab.label} 
                    icon={tab.icon} 
                    iconPosition="start" 
                    sx={{ fontWeight: activeTab === index ? 600 : 400 }} 
                  />
                ))}
              </Tabs>
            </Paper>

            <Box sx={{ mt: 3 }}>
              {tabContent[activeTab].content}
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Stats;