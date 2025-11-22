import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import NewsPage from "./pages/NewsPage"


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/article/:id' element={<NewsPage/>}/>
      </Routes>
    </>
  )
}

export default App
