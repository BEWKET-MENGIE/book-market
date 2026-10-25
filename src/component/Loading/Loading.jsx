
function Loading({ message = "Loading books..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <p>{message}</p>

      <style>{`
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 40px 20px;
          color: #475569;
        }

        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid #d1d5db;
          border-top-color: #4caf50;
          border-radius: 50%;
          animation: bookstore-spin 0.8s linear infinite;
        }

        @keyframes bookstore-spin {
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .loading-spinner { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default Loading;
