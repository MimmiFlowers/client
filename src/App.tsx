import { Route, Routes } from "react-router";
import Header from "./layout/Header/Header";
import Footer from "./layout/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductPage from "./pages/ProductPage/ProductPage";

const App = () => {
  return (
    <div className="h-screen w-screen">
      <div className="App__wrapper">
        <Header />
        <div className="Page-content translate-y-[7vh]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/Catalog" element={<ProductListPage />} />
            <Route path="/Catalog/:id" element={<ProductPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default App;
