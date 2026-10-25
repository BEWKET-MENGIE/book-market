
import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

export default function useWishlist() {
  const context = useContext(WishlistContext);

  if (context === null) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider."
    );
  }

  return context;
}
