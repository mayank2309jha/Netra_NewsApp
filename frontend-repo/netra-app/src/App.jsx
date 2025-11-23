import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NewsPage from "./pages/NewsPage";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Stats from "./pages/Stats";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/article/:id" element={<NewsPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </>
  );
}

export default App;
