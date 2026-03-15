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
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
            <Header />
            <main className="flex-1 pt-16">
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
    );
};

export default App;
