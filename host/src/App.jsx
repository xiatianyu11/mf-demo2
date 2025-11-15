// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { fetchRemoteConfig } from "./fetchRemoteConfig";
import { lazyRemoteRoute } from "./lazyRemote";

function RemoteRouteWrapper({ url, scope, module }) {
  // This wrapper ensures we pass the current sub-path to the remote as initial entry
  const location = useLocation();
  const initialPath = location.pathname; // full path; remote can interpret its own base
  const RemoteComponent = React.useMemo(
    () => lazyRemoteRoute(url, scope, module, () => <div>Remote failed</div>),
    [url, scope, module]
  );

  // We pass initialPath and basename props — remote App should accept and use them
  return (
    <React.Suspense fallback={<div>Loading remote app...</div>}>
      <RemoteComponent initialPath={initialPath} />
    </React.Suspense>
  );
}

export default function App() {
  const [remotes, setRemotes] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await fetchRemoteConfig();
        setRemotes(cfg);
      } catch (e) {
        console.error("Failed to load remote config", e);
      }
    })();
  }, []);

  if (!remotes) return <div>Loading config...</div>;

  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <h2>Host App (Shell)</h2>
        <nav>
          <Link to="/">Home</Link> | <Link to="/app1">Remote1 (App1)</Link> |{" "}
          <Link to="/app2">Remote2 (App2)</Link>
        </nav>

        <hr />
        <Routes>
          <Route path="/" element={<div>Host Home</div>} />
          {/* Route-boundary: when user navigates to /app1 we will lazy load remote1 */}
          <Route
            path="/app1/*"
            element={
              <RemoteRouteWrapper
                url={remotes.remote1}     // from API, e.g. https://cdn/.../remoteEntry.js
                scope="remote1"           // must match remote's ModuleFederation name
                module="./App"            // remote exposes "./App"
              />
            }
          />
          <Route
            path="/app2/*"
            element={
              <RemoteRouteWrapper
                url={remotes.remote2}
                scope="remote2"
                module="./App"
              />
            }
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
