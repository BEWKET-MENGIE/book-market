import React from 'react';
import "./Section2.css";

const Section2 = () => {
  return (
    <section className="iphone-11-pro">
      <div className="title">
        iPhone 11 Pro
      </div>
      <div className="discription">
        Pro cameras, pro display, pro performance.
      </div>
      <div className="price">
        From $24.95/mo. or $599 with trade‑in.
      </div>
      <div className="link-part">
        <ul>
          <li>
            <a href="https://www.apple.com/iphone-11-pro/" target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </li>
          <li>
            <a href="https://www.apple.com/us/shop/goto/buy_iphone/iphone_11_pro" target="_blank" rel="noopener noreferrer">
              Buy
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Section2;