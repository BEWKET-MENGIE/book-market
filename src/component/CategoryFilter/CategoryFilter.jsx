
import { categories } from "../../data/categories";
import "./CategoryFilter.css";

function CategoryFilter({ value, onChange }) {
  return (
    <div className="category-filter">
      <label htmlFor="book-category">Browse by category</label>

      <select
        id="book-category"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryFilter;
