import { useEffect, useState } from 'react';
import type { HealthResponse } from '@ams/shared';
import './App.css';

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<HealthResponse>;
      })
      .then(setHealth)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="app">
      <h1>AMS</h1>
      <p>React frontend — monorepo workspace <code>@ams/frontend</code></p>
      <section className="status">
        <h2>API status</h2>
        {error && <p className="error">Backend unreachable: {error}</p>}
        {health && (
          <p className="ok">
            {health.service} — {health.status} (v{health.version})
          </p>
        )}
        {!error && !health && <p>Checking backend…</p>}
      </section>
    </main>
  );
}

export default App;
