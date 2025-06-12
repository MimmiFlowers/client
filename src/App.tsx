import { Route, Routes } from 'react-router';
import Header from './layout/Header/Header';
import Footer from './layout/Footer/Footer';
import LandingPage from './pages/LandingPage/LandingPage';
import ProductListPage from './pages/ProductListPage/ProductListPage';
import ProductPage from './pages/ProductPage/ProductPage';
import './App.css';

function App() {

    return (
        <div className="App">
            <div className='App__wrapper'>
                <Header />
                <div className='Page-content'>
                    <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/Products' element={<ProductListPage />} />
                    <Route path='/Product/:id' element={<ProductPage />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default App
