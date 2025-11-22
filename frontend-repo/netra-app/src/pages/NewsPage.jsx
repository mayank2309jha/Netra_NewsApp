import Navbar from "../components/Navbar"
import SearchNavbar from '../components/SearchNavbar'
import Footer from '../components/Footer'
import ArticleContent from "../components/NewsDetails"

function NewsPage(){
    return(
        <>
            <SearchNavbar />
            <Navbar/>
            <ArticleContent />
            <Footer />
        </>
    )
}

export default NewsPage