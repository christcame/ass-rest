export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        background: "#0a0a0a",
        color: "#ededed",
      }}
    >
      <div style={{ maxWidth: 560, lineHeight: 1.6 }}>
        <h1 style={{ letterSpacing: "-0.02em" }}>ass.rest</h1>
        <p style={{ color: "#9a9a9a" }}>API only. No UI.</p>

        <h3 style={{ marginTop: 32 }}>Endpoint</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <code>GET /api/ass</code> — streams bouncing buns, a rich-text
            loading bar, and random status messages every 15s (2 min)
          </li>
        </ul>

        <p style={{ marginTop: 32, color: "#666", fontSize: 13 }}>
          Try: <code>curl -N https://ass.rest/api/ass</code>
        </p>
      </div>
    </main>
  );
}