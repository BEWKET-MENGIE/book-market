
import "./SearchBar.css";

function SearchBar({ value, onChange }) {
  return (
    <form
      className="book-search"
      role="search"
      onSubmit={(event) => event.preventDefault()}
    >
      <label className="visually-hidden" htmlFor="book-search-input">
        Search books
      </label>

      <input
        id="book-search-input"
        type="search"
        placeholder="Search by title or author..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </form>
  );
}

export default SearchBar;
