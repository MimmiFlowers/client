// import React from 'react';
import { Route, Routes } from 'react-router';
// import Header from './components/ReusableComponents/Header/Header.jsx';
// import Footer from './components/ReusableComponents/Footer/Footer';
// import LandingPage from './components/LandingPage/Landingpage';
// import ProductListPage from './components/ProductListPage/ProductListPage';
// import ProductPage from './components/ProductPage/ProductPage';
// import CookiePrompt from './components/ReusableComponents/CookiePrompt/CookiePrompt';
import './App.css';
import './fonts/fonts.css';

const App = () => {
  return (
    <div className="App">
      <div className='App__wrapper'>
        {/* <Header /> */}
        <div className='Page-content'>
            <h4>Hello Hello</h4>
          {/* <Routes> */}
            {/* <Route path='/' element={<LandingPage />} /> */}
            {/* <Route path='/Products' element={<ProductListPage />} /> */}
            {/* <Route path='/Product/:id' element={<ProductPage />} /> */}
          {/* </Routes> */}
        </div>
        {/* <CookiePrompt /> */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}

export default App;
