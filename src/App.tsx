import { Route, Routes } from "react-router";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CheckOutPage from "./pages/CheckOutPage/CheckOutPage";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import CancelPage from "./pages/CancelPage/CancelPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";

const App = () => {
    return (
        <div className="h-screen w-screen">
            <div className="App__wrapper">
                <Header />
                <main className="Page-content translate-y-[7vh]">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/Catalog" element={<ProductListPage />} />
                        <Route path="/Catalog/:id" element={<ProductPage />} />
                        <Route path="/Checkout" element={<CheckOutPage />} />
                        <Route
                            path="/Success/:orderID"
                            element={<SuccessPage />}
                        />
                        <Route path="/About" element={<AboutPage />} />
                        <Route path="/Contact" element={<ContactPage />} />
                        <Route
                            path="/Cancel/:orderID"
                            element={<CancelPage />}
                        />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default App;
