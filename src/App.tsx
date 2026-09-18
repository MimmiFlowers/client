import { Route, Routes } from "react-router";
import { useTranslation } from "react-i18next";
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
import PrivacyPage from "./pages/PrivacyPage/PrivacyPage";
import WreathBuilderPage from "./pages/WreathBuilderPage/WreathBuilderPage";

const App = () => {
    const { t } = useTranslation();

    return (
        <div className="relative flex min-h-dvh w-full flex-col overflow-x-clip">
            <a
                href="#main"
                className="fixed top-2 left-2 z-[60] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm text-blush focus:translate-y-0"
            >
                {t("menu.skip_to_content")}
            </a>
            <Header />
            <main id="main" className="flex-1 pt-24 md:pt-28">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/Catalog" element={<ProductListPage />} />
                    <Route path="/Catalog/:id" element={<ProductPage />} />
                    <Route path="/Wreath" element={<WreathBuilderPage />} />
                    <Route path="/Checkout" element={<CheckOutPage />} />
                    <Route
                        path="/Success/:orderID"
                        element={<SuccessPage />}
                    />
                    <Route path="/About" element={<AboutPage />} />
                    <Route path="/Contact" element={<ContactPage />} />
                    <Route path="/Privacy" element={<PrivacyPage />} />
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
