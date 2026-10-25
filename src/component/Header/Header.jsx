
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import { STORE_INFO } from "../Constant/constant";
import "./Header.css";

function Header() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <header className="store-header">
      <a
        className="store-brand"
        href="/"
        aria-label={`${STORE_INFO.name} home`}
      >
        <span className="store-brand-icon" aria-hidden="true">
          E
        </span>

        <span>
          <strong>{STORE_INFO.name}</strong>
          <small>Read. Discover. Grow.</small>
        </span>
      </a>

      <div className="header-summary">
        <span>
          <span aria-hidden="true">♡</span> Wishlist: {wishlistCount}
        </span>

        <span>
          <span aria-hidden="true">🛒</span> Cart: {cartCount}
        </span>
      </div>
    </header>
  );
}

export default Header;
