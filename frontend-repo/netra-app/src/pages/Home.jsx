import Navbar from "../components/Navbar"
import ArticleContent from "../components/NewsDetails"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SearchNavbar from '../components/SearchNavbar';
import BreakingNewsTicker from "../components/BreakingNewsTicker";

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
    return (
        <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
                <SearchNavbar />
                <Navbar />
                <BreakingNewsTicker/>
                <ArticleContent />
            </div>
        </ThemeProvider>
    </>
    )
}

export default Home