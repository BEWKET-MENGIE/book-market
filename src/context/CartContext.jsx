
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const CartContext = createContext(null);

const STORAGE_KEY = "evangadi-book-store-cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        item.id != null &&
        typeof item.title === "string" &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) >= 0 &&
        Number.isInteger(Number(item.quantity)) &&
        Number(item.quantity) > 0
    ).map((item) => ({
      ...item,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Unable to save the cart:", error);
    }
  }, [cartItems]);

  const addToCart = useCallback((book) => {
    if (!book || book.id == null || !book.title) {
      throw new Error("A valid book is required.");
    }

    const price = Number(book.price);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("The book has an invalid price.");
    }

    setCartItems((current) => {
      const existing = current.find(
        (item) => String(item.id) === String(book.id)
      );

      if (existing) {
        return current.map((item) =>
          String(item.id) === String(book.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          ...book,
          price,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((bookId) => {
    setCartItems((current) =>
      current.filter(
        (item) => String(item.id) !== String(bookId)
      )
    );
  }, []);

  const updateQuantity = useCallback((bookId, quantity) => {
    const nextQuantity = Number(quantity);

    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        String(item.id) === String(bookId)
          ? { ...item, quantity: nextQuantity }
          : item
      )
    );
  }, []);

  const increaseQuantity = useCallback((bookId) => {
    setCartItems((current) =>
      current.map((item) =>
        String(item.id) === String(bookId)
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((bookId) => {
    setCartItems((current) =>
      current
        .map((item) =>
          String(item.id) === String(bookId)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    }),
    [
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
