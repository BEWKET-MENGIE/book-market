import React, { useState } from 'react';
import "./Header.css";
import logo from "../../Apple/Image/Icons/logo.png";
import search_icon from "../../Apple/Image/Icons/search_icon.png";
import cart from "../../Apple/Image/Icons/cart.png";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle Search Bar
  const handleSearchClick = (e) => {
    e.preventDefault();
    setIsSearchOpen(!isSearchOpen);
    setIsCartOpen(false); // Close cart if open
  };

  // Toggle Cart Dropdown Response
  const handleCartClick = (e) => {
    e.preventDefault();
    setIsCartOpen(!isCartOpen);
    setIsSearchOpen(false); // Close search if open
  };

  return (
    <div>
      <header className="header-wrapper">
        <div className="internal-wrapper">
          <div className="header-links-wrapper">
            <ul>
              <li className="logo-link">
                <a href="https://www.apple.com">
                  <img src={logo} alt="Apple Logo" />
                </a>
              </li>
              <li><a href="https://www.apple.com/mac/">Mac</a></li>
              <li><a href="https://www.apple.com/iphone/">iPhone</a></li>
              <li><a href="https://www.apple.com/ipad/">iPad</a></li>
              <li><a href="https://www.apple.com/watch/">Watch</a></li>
              <li><a href="https://www.apple.com/tv-home/">TV</a></li>
              <li><a href="https://www.apple.com/music/">Music</a></li>
              <li><a href="https://www.apple.com/support/">Support</a></li>
              
              {/* Interactive Search Icon */}
              <li className="search-link" onClick={handleSearchClick}>
                <a href="/search/" onClick={(e) => e.preventDefault()}>
                  <img src={search_icon} alt="Search" />
                </a>
              </li>

              {/* Interactive Cart Icon */}
              <li className="cart-link" onClick={handleCartClick}>
                <a href="/cart/" onClick={(e) => e.preventDefault()}>
                  <img src={cart} alt="Cart" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Dynamic Search Bar Response */}
        {isSearchOpen && (
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search apple.com or help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Dynamic Cart Dropdown Response */}
        {isCartOpen && (
          <div className="cart-dropdown">
            <h4>Your Bag is Empty</h4>
            <p>Sign in to see items you may have added previously.</p>
            <button onClick={() => alert("Redirecting to Sign In...")}>Sign In</button>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;