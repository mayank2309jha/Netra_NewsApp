import Navbar from "../components/Navbar"
import SearchNavbar from '../components/SearchNavbar'

import ArticleContent from "../components/NewsDetails"

function NewsPage(){
    return(
        <>
            <SearchNavbar />
            <Navbar/>
            <ArticleContent />
        </>
    )
}

export default NewsPage