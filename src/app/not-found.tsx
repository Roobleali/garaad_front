// Optional: you can throw notFound() in a layout or page to render this UI.
export default function NotFoundPage() {
  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>404 – Page Not Found</h1>
      <p>Sorry, we couldn’t find that page.</p>
    </div>
  );
}
