import React from 'react';
import './Header.css';

function Header() {
  return (
    <div className='App-header'>
      {/* <div className='Header-wrapper'> */}
      <a className='Header-title' href='/'>Mimmi Flowers</a>
        {/* <img className='Header-logo' src='https://i.imgur.com/5apc4m2.png'/> */}
      {/* </div> */}
      <ul className='Header-sections'>
        <a className='Section-list' href='/Products'>Flowers</a>
        <a className='Section-list' href='/Cart'>Cart</a>
        <a className='Section-list' href='/Contact'>Contact</a>
        <a className='Section-list' href='/AboutUs'>About us</a>
      </ul>
    </div>
  );
};

export default Header;