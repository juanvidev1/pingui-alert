export const Home = () => {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Notifications made <span className="gradient-text">effortless</span>.
          </h1>
          <p className="subtitle">
            Send alerts to your Telegram directly from your code with a simple API call. No complex setup required.
          </p>
          <div className="cta-group">
            <a href="/docs" className="btn btn-primary">
              Get Started
            </a>
            <a href="#features" className="btn btn-secondary">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="code-window">
            <div className="window-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
              <span className="window-title">send-alert.ts</span>
            </div>
            <div className="code-content">
              <pre>
                <code>
                  <span className="keyword">const</span> response = <span className="keyword">await</span> fetch(
                  <span className="string">'https://api.pingui.com/alert'</span>, {'{ \n  '}
                  <span className="property">{'  '}method</span>: <span className="string">'POST'</span>
                  {',\n'}
                  <span className="property">{'    '}headers</span>: {'{ \n  '}
                  <span className="string">{'    '}'Authorization'</span>:{' '}
                  <span className="string">'Bearer YOUR_SECRET_KEY'</span>
                  {'\n'}
                  {'    }\n'}
                  <span className="property">{'    '}body</span>: JSON.stringify({'{ \n  '}
                  <span className="property">{'   '}</span> <span className="property">alert</span>:{' '}
                  <span className="string">'🚀 Deployment successful!'</span>
                  {'}\n    })\n'}
                  );
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <div className="icon">⚡️</div>
          <h3>Lightning Fast</h3>
          <p>Instant delivery to your devices via Telegram. Never miss a critical update again.</p>
        </div>
        <div className="feature-card">
          <div className="icon">🔒</div>
          <h3>Secure by Default</h3>
          <p>Token-based authentication ensures only your authorized applications can send alerts.</p>
        </div>
        <div className="feature-card">
          <div className="icon">🛠️</div>
          <h3>Developer First</h3>
          <p>Built for developers, by developers. Simple JSON API that works with any language.</p>
        </div>
      </section>

      <section className="integration-options">
        <div className="section-header">
          <h2>Flexible Integration</h2>
          <p>Choose the way that fits your workflow best.</p>
        </div>

        <div className="options-grid">
          <div className="option-card">
            <div className="option-header">
              <div className="icon-small">📦</div>
              <h3>NPM Package</h3>
            </div>
            <p>
              Use our official, type-safe SDK for Node.js and TypeScript projects. It handles authentication and error
              handling for you.
            </p>
            <div className="code-snippet-small">
              <code>npm install pingui-alert</code>
            </div>
          </div>

          <div className="option-card">
            <div className="option-header">
              <div className="icon-small">☁️</div>
              <h3>Hosted Service</h3>
            </div>
            <p>
              Skip the infrastructure. Use our hosted bot instance to receive alerts. No need to create or maintain your
              own Telegram bot.
            </p>
            <ul className="check-list">
              <li>✅ No server maintenance</li>
              <li>✅ Instant setup</li>
              <li>✅ 99.9% Uptime</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
};
