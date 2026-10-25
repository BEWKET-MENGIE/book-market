
import { STORE_INFO } from "../Constant/constant";
import "./Footer.css";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="store-footer">
      <div className="footer-content">
        <div>
          <h2>{STORE_INFO.name}</h2>
          <p>{STORE_INFO.description}</p>
        </div>

        <div className="footer-links">
          <a href="#top">Back to Top</a>
          <a href="mailto:support@example.com">Contact</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {year} {STORE_INFO.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
