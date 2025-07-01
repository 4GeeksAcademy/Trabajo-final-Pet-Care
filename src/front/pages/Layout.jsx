import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import  Navbar  from "../components/Navbar"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
const Layout = () => (
    <>
        <ScrollToTop>
            <Navbar />
                <Outlet />
        </ScrollToTop>
    </>
    ); 

export default Layout; 