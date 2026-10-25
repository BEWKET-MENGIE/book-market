
import BookDetails from "../component/BookDetails/BookDetails";

function BookDetailsPage({ book, onBack }) {
  return (
    <main className="page-container">
      <BookDetails book={book} onBack={onBack} />
    </main>
  );
}

export default BookDetailsPage;
