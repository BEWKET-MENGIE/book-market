
import { useMemo, useState } from "react";
import { books } from "../data/books";
import SearchBar from "../component/SearchBar/SearchBar";
import CategoryFilter from "../component/CategoryFilter/CategoryFilter";
import Product from "../component/Product/Product";

function Home({
  onViewDetails,
  isWishlisted,
  onToggleWishlist,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <main className="home-page">
      <section className="home-hero">
        <h1>Welcome to Evangadi Book Store</h1>
        <p>Discover books that inspire you to learn and grow.</p>
      </section>

      <section className="home-catalog">
        <h2>Explore Our Books</h2>

        <SearchBar value={search} onChange={setSearch} />

        <CategoryFilter
          value={category}
          onChange={setCategory}
        />

        <p>{filteredBooks.length} book(s) found</p>

        <Product
          books={filteredBooks}
          onViewDetails={onViewDetails}
          isWishlisted={isWishlisted}
          onToggleWishlist={onToggleWishlist}
        />
      </section>
    </main>
  );
}

export default Home;
