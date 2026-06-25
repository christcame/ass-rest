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

        <h3 style={{ marginTop: 32 }}>Endpoints</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>
            <code>POST /api/shorten</code> — bearer auth, body{" "}
            <code>{`{ "url": "https://..." }`}</code>
          </li>
          <li>
            <code>GET /s/&lt;code&gt;</code> — public, 302 redirect
          </li>
          <li>
            <code>POST /api/ai</code> — bearer auth, body{" "}
            <code>{`{ "messages": [...] }`}</code> → minimax-m2.7
          </li>
          <li>
            <code>GET /api/ass</code> — public, returns a fart (audio/wav)
          </li>
        </ul>

        <p style={{ marginTop: 32, color: "#666", fontSize: 13 }}>
          Auth via <code>Authorization: Bearer &lt;ASS_REST_API_KEY&gt;</code>
        </p>
      </div>
    </main>
  );
}
