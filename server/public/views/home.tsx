import { FC } from 'hono/jsx';
import { MainLayout } from './layouts/mainLayout.tsx';

export const Home: FC = () => {
  // console.log(props);
  return (
    <MainLayout>
      <main>
        <section class="hero">
          <div class="hero-content">
            <h1>
              Notifications made <span class="gradient-text">effortless</span>.
            </h1>
            <p class="subtitle">
              Send alerts to your Telegram directly from your code with a simple API call. No complex setup required.
            </p>
            <div class="cta-group">
              <a href="/docs" class="btn btn-primary">
                Get Started
              </a>
              <a href="#features" class="btn btn-secondary">
                Learn More
              </a>
            </div>
          </div>

          <div class="hero-visual">
            <div class="code-window">
              <div class="window-header">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
                <span class="window-title">send-alert.ts</span>
              </div>
              <div class="code-content">
                <pre>
                  <code>
                    <span class="keyword">const</span> response = <span class="keyword">await</span> fetch(
                    <span class="string">'https://api.pingui.com/alert'</span>, {'{'}
                    <span class="property">method</span>: <span class="string">'POST'</span>,
                    <span class="property">headers</span>: {'{'}
                    <span class="string">'Authorization'</span>: <span class="string">'Bearer YOUR_SECRET_KEY'</span>
                    {'}'},<span class="property">body</span>: JSON.stringify({'{'}
                    <span class="property">alert</span>: <span class="string">'🚀 Deployment successful!'</span>
                    {'}'}){'}'});
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="features" class="features">
          <div class="feature-card">
            <div class="icon">⚡️</div>
            <h3>Lightning Fast</h3>
            <p>Instant delivery to your devices via Telegram. Never miss a critical update again.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🔒</div>
            <h3>Secure by Default</h3>
            <p>Token-based authentication ensures only your authorized applications can send alerts.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🛠️</div>
            <h3>Developer First</h3>
            <p>Built for developers, by developers. Simple JSON API that works with any language.</p>
          </div>
        </section>

        <section class="integration-options">
          <div class="section-header">
            <h2>Flexible Integration</h2>
            <p>Choose the way that fits your workflow best.</p>
          </div>

          <div class="options-grid">
            <div class="option-card">
              <div class="option-header">
                <div class="icon-small">📦</div>
                <h3>NPM Package</h3>
              </div>
              <p>
                Use our official, type-safe SDK for Node.js and TypeScript projects. It handles authentication and error
                handling for you.
              </p>
              <div class="code-snippet-small">
                <code>npm install pingui-alert</code>
              </div>
            </div>

            <div class="option-card">
              <div class="option-header">
                <div class="icon-small">☁️</div>
                <h3>Hosted Service</h3>
              </div>
              <p>
                Skip the infrastructure. Use our hosted bot instance to receive alerts. No need to create or maintain
                your own Telegram bot.
              </p>
              <ul class="check-list">
                <li>✅ No server maintenance</li>
                <li>✅ Instant setup</li>
                <li>✅ 99.9% Uptime</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
};
