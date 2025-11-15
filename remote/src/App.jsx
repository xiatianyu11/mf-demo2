// App.jsx (remote1)
import React from "react";
import { Routes, Route, Link, MemoryRouter, useNavigate } from "react-router-dom";

function Home() {
  return <div>Remote1 Home</div>;
}
function Detail() {
  return <div>Remote1 Detail</div>;
}

/**
 * Remote App wraps its internal router in MemoryRouter or BrowserRouter.
 * Here we use MemoryRouter to avoid interfering with host routing,
 * and use initialEntries passed from Host as initial location.
 */
export default function RemoteApp({ initialPath = "/app1" }) {
  // derive initial entries so remote's internal router sees a path relative to remote
  // Example: Host route "/app1/something" -> pass initialPath "/app1/something",
  // remote can strip /app1 prefix or define routes accordingly.
  // For simplicity, assume remote defines routes starting at "/"
  // so we map initialPath -> remoteInitial = initialPath.replace("/app1", "") || "/"
  const remoteInitial = (initialPath && initialPath.replace(/^\/app1/, "")) || "/";

  return (
    <MemoryRouter initialEntries={[remoteInitial]}>
      <div style={{ border: "1px solid #ccc", padding: 8 }}>
        <h3>Remote1 (micro-app)</h3>
        <nav>
          <Link to="/">Home</Link> | <Link to="/detail">Detail</Link>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}
