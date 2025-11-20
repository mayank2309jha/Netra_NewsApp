import Navbar from "./components/Navbar"
import ArticleContent from "./components/NewsDetails"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
        <Navbar />
        <ArticleContent />
      </div>
    </ThemeProvider>
    </>
  )
}

export default App
