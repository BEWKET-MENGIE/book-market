
import { useMemo, useState } from "react";

import Header from "./component/Header/Header";
import Footer from "./component/Footer/Footer";
import ProductCard from "./component/ProductCard/ProductCard";
import SearchBar from "./component/SearchBar/SearchBar";
import CategoryFilter from "./component/CategoryFilter/CategoryFilter";
import BookDetails from "./component/BookDetails/BookDetails";
import Cart from "./component/Cart/Cart";
import Wishlist from "./component/Wishlist/Wishlist";
import Checkout from "./component/Checkout/Checkout";
import OrderHistory from "./component/OrderHistory/OrderHistory";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { books } from "./data/books";
import useCart from "./hooks/useCart";
import useWishlist from "./hooks/useWishlist";
import useAuth from "./hooks/useAuth";
import { createOrder, getMyOrders } from "./services/orderService";

import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderError, setOrderError] = useState("");

  const { cartCount, cartItems, clearCart } = useCart();

  const {
    wishlistCount,
    toggleWishlist,
    isWishlisted,
  } = useWishlist();

  const { user, isAuthenticated, logout } = useAuth();

  const filteredBooks = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  function openPage(nextPage) {
    setPage(nextPage);
    setSelectedBook(null);
    setOrderError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showBookDetails(book) {
    setSelectedBook(book);
    openPage("details");
  }

  async function handleLogout() {
    try {
      await logout();
      openPage("home");
    } catch (error) {
      setOrderError(error.message || "Unable to sign out.");
    }
  }

  async function handleCheckout(order) {
    if (!isAuthenticated) {
      openPage("login");
      return;
    }

    // The backend must calculate prices and validate inventory.
    const createdOrder = await createOrder({
      customer: order.customer,
      items: order.items.map((item) => ({
        bookId: item.id,
        quantity: item.quantity,
      })),
    });

    clearCart();
    setOrders((current) => [createdOrder, ...current]);
    openPage("orders");
  }

  async function openOrderHistory() {
    if (!isAuthenticated) {
      openPage("login");
      return;
    }

    openPage("orders");
    setOrderError("");

    try {
      const result = await getMyOrders();
      setOrders(Array.isArray(result) ? result : result.orders ?? []);
    } catch (error) {
      setOrderError(
        error.message || "Unable to load your order history."
      );
    }
  }

  return (
    <div className="app">
      <Header />

      <nav className="store-navigation" aria-label="Store navigation">
        <button type="button" onClick={() => openPage("home")}>
          Browse Books
        </button>

        <button type="button" onClick={() => openPage("cart")}>
          Cart ({cartCount})
        </button>

        <button type="button" onClick={() => openPage("wishlist")}>
          Wishlist ({wishlistCount})
        </button>

        <button type="button" onClick={openOrderHistory}>
          My Orders
        </button>

        {isAuthenticated ? (
          <>
            <span className="nav-user">
              {user?.name || user?.email || "Account"}
            </span>
            <button type="button" onClick={handleLogout}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={() => openPage("login")}>
              Sign In
            </button>
            <button type="button" onClick={() => openPage("register")}>
              Register
            </button>
          </>
        )}
      </nav>

      <main className="store-main">
        {page === "home" && (
          <>
            <section className="store-hero">
              <p className="store-eyebrow">EVANGADI BOOK STORE</p>
              <h1>Discover Your Next Favorite Book</h1>
              <p>
                Explore books, discover new ideas, and grow through reading.
              </p>
            </section>

            <section className="catalog-section">
              <div className="catalog-heading">
                <h2>Our Book Collection</h2>
                <p>{filteredBooks.length} books found</p>
              </div>

              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
              />

              <CategoryFilter
                value={selectedCategory}
                onChange={setSelectedCategory}
              />

              {filteredBooks.length === 0 ? (
                <div className="no-books-found">
                  <h3>No books found</h3>
                  <p>Try another title, author, or category.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("All");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredBooks.map((book) => (
                    <ProductCard
                      key={book.id}
                      book={book}
                      onViewDetails={showBookDetails}
                      isWishlisted={isWishlisted(book.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {page === "details" && (
          <BookDetails
            book={selectedBook}
            onBack={() => openPage("home")}
          />
        )}

        {page === "cart" && (
          <Cart
            onContinueShopping={() => openPage("home")}
            onCheckout={() => openPage("checkout")}
          />
        )}

        {page === "wishlist" && (
          <Wishlist onContinueShopping={() => openPage("home")} />
        )}

        {page === "checkout" && (
          <Checkout
            onBack={() => openPage("cart")}
            onSubmitOrder={handleCheckout}
          />
        )}

        {page === "login" && (
          <LoginPage onNavigate={openPage} />
        )}

        {page === "register" && (
          <RegisterPage onNavigate={openPage} />
        )}

        {page === "orders" && (
          <>
            {orderError && (
              <p className="app-error" role="alert">
                {orderError}
              </p>
            )}

            <OrderHistory
              orders={orders}
              onContinueShopping={() => openPage("home")}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
