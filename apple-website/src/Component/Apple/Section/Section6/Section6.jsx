import React from 'react';
import "./Section6.css";

const Section6 = () => {
  return (
    <div>
      <section className="main-section6">
        <div className="MacBook-pro">
          <div className="fff">
            16-inch model
          </div>
          <div className="dddd">
            MacBook Pro
          </div>
          <div className="brightness">
            The best for the brightest.
          </div>
          <div className="link-part6">
            <ul>
              <li>
                <a href="https://www.apple.com/macbook-pro/" target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </li>
              <li>
                <a href="https://www.apple.com/us/shop/goto/buy_mac/macbook_pro" target="_blank" rel="noopener noreferrer">
                  Buy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ipad">
          <div className="the-new">
            {/* Optional subtitle */}
          </div>
          <div className="like-computer">
            Like a computer. Unlike any computer.
          </div>
          <div className="link-part6">
            <ul>
              <li>
                <a href="https://www.apple.com/ipad/" target="_blank" rel="noopener noreferrer">
                  Learn more
                </a>
              </li>
              <li>
                <a href="https://www.apple.com/us/shop/goto/buy_ipad/ipad" target="_blank" rel="noopener noreferrer">
                  Buy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section6;