
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getStorageItem,
  setStorageItem,
} from "../utils/storage";

export const WishlistContext = createContext(null);

const STORAGE_KEY = "evangadi-book-store-wishlist";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = getStorageItem(STORAGE_KEY, []);

    return Array.isArray(saved)
      ? saved.filter(
          (item) =>
            item &&
            typeof item.id === "string" &&
            typeof item.title === "string"
        )
      : [];
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEY, wishlistItems);
  }, [wishlistItems]);

  const toggleWishlist = useCallback((book) => {
    if (!book || typeof book.id !== "string") {
      return;
    }

    setWishlistItems((current) => {
      const exists = current.some((item) => item.id === book.id);

      return exists
        ? current.filter((item) => item.id !== book.id)
        : [...current, book];
    });
  }, []);

  const removeFromWishlist = useCallback((bookId) => {
    setWishlistItems((current) =>
      current.filter((item) => item.id !== bookId)
    );
  }, []);

  const isWishlisted = useCallback(
    (bookId) => wishlistItems.some((item) => item.id === bookId),
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      clearWishlist,
    }),
    [
      wishlistItems,
      toggleWishlist,
      removeFromWishlist,
      isWishlisted,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
