import React from 'react';
import "./Section1.css";
import mac_laptop from "../../Image/home/mac-laptop.jpg";

const Section1 = () => {
  return (
    <section className="section-11">
      <div className="macbook-pro">
        <div className="aa1"> 
          16-inch model
        </div>
        <div className="bb2">
          MacBook Pro
        </div>
        <div className="cc3">
          The best for the brightest 
        </div>
        <div className="dd4">
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
        <div className="ee5">
          <img src={mac_laptop} alt="MacBook Pro 16-inch" />
        </div>
      </div>
    </section>
  );
};

export default Section1;