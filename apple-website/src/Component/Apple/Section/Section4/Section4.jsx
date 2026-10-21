import React from 'react';
import "./Section4.css";
import apple_card_logo from "../../../Apple/Image/Icons/apple_card_logo.png";
import watch_series5_logo from "../../../Apple/Image/icons/watch_series5_logo.png";

const Section4 = () => {
  return (
    <section className="apple-watch-part-4">
      <div className="watch">
        <div className="logo-image">
          <img src={watch_series5_logo} alt="Watch Series 5 Logo" />
        </div>
        <div className="description-part4">
          With the new always-on Retina display.<br />You've never seen a watch like this.
        </div>
        <div className="common-txt-part">
          <ul>
            <li>
              <a href="https://www.apple.com/apple-watch-series-5/" target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/us/shop/goto/buy_watch/apple_watch_series_5" target="_blank" rel="noopener noreferrer">
                Buy
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="card-is-here">
        <div className="apple-card">
          <img src={apple_card_logo} alt="Apple Card Logo" />
        </div>
        <div className="use">
          Get 3% Daily Cash on purchases from<br />Apple using Apple Card.
        </div>
        <div className="watch-link">
          <ul>
            <li>
              <a href="https://www.apple.com/apple-card/" target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </li>
            <li>
              <a href="https://www.apple.com/us/shop/goto/apple_card" target="_blank" rel="noopener noreferrer">
                Buy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default Section4
