import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

function Footer() {
  return (
    <div className="Footer-Section">
      <div className="Footer-Section__Icons">
        <a className="Icons__Item" href="https://instagram.com/mimmi_flowers?igshid=MzMyNGUyNmU2YQ==" target="_blank"><FontAwesomeIcon icon={faInstagram}/></a>
        <a className="Icons__Item" href="https://www.tiktok.com/@mimmi_flowers" target="_blank"><FontAwesomeIcon icon={faTiktok}/></a>
        {/* <a className="icons__item" href="https://t.me/Let_your_mind_go" target="_blank"><FontAwesomeIcon icon={faTelegramPlane}/></a> */}
      </div>
      <p className="Footer-Section__Copyright">&copy; Igor Puris</p>
    </div>
  );
};

export default Footer;