import React, { useState } from 'react';
import './CookiePrompt.css';

function CookiePrompt() {
  const [acceptedCookies, setAcceptedCookies] = useState(false);

  const handleAcceptCookies = () => {
    // Set the necessary cookies
    // ...

    setAcceptedCookies(true);
  };

  const handleRejectCookies = () => {
    // Remove non-necessary cookies
    // ...

    setAcceptedCookies(true);
  };

  if (acceptedCookies) {
    // Render your app or component
    return <div>Your app or component goes here.</div>;
  }

  return (
    <div className={`cookie-prompt ${acceptedCookies ? '' : 'show'}`}>
      <p>This website uses cookies to enhance your experience.</p>
      <div className="cookie-buttons">
        <button onClick={handleAcceptCookies}>Accept All Cookies</button>
        <button onClick={handleRejectCookies}>Reject All (except necessary)</button>
      </div>
    </div>
  );
};

export default CookiePrompt;
