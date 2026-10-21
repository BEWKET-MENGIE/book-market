import React from 'react';
import "./Section5.css";
import apple_tv_logo from "../../../Apple/Image/Icons/apple_tv_logo.png";
import servant_logo from "../../../Apple/Image/Icons/servant_logo.png";

const Section5 = () => {
  return (
    <section className="main-section5">
      <div className="servant">
        <div className="icon1">
          <img src={apple_tv_logo} alt="Apple TV+ Logo" />
        </div>
        <div className="icon2">
          <img src={servant_logo} alt="Servant Logo" />
        </div>
        <div className="icon3">
          <h3>
            <a href="https://tv.apple.com/us/show/servant/umc.cmc.3y42f31v1imq935scgwzz4m6k" target="_blank" rel="noopener noreferrer">
              Watch the trailer
            </a>
          </h3>
        </div>
      </div>

      <div className="Airpods-pro">
        <div className="txt1">
          AirPods Pro
        </div>
        <div className="txt2">
          Music like you've never heard.
        </div>
        <div className="txt3">
          <ul>
            <li>
              <a href="https://www.apple.com/airpods-pro/" target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/us/shop/goto/product/MWP22" target="_blank" rel="noopener noreferrer">
                Buy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Section5;