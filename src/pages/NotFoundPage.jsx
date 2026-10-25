
function NotFoundPage({ onGoHome }) {
  return (
    <main className="not-found-page">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>

      <button type="button" onClick={onGoHome}>
        Return to Store
      </button>
    </main>
  );
}

export default NotFoundPage;
