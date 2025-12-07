export const Docs = () => {
  return (
    <div className="docs-container">
      <aside className="sidebar">
        <div className="sidebar-group">
          <h3>Getting Started</h3>
          <a href="#introduction" className="sidebar-link">
            Introduction
          </a>
          <a href="#setup" className="sidebar-link">
            Setup & Auth
          </a>
        </div>
        <div className="sidebar-group">
          <h3>API Reference</h3>
          <a href="#send-alert" className="sidebar-link">
            Send Alert
          </a>
          <a href="#check-quota" className="sidebar-link">
            Check Quota
          </a>
        </div>
        <div className="sidebar-group">
          <h3>SDKs</h3>
          <a href="#npm-package" className="sidebar-link">
            Node.js / TypeScript
          </a>
        </div>
        <div className="sidebar-group">
          <h3>Best Practices</h3>
          <a href="#production-usage" className="sidebar-link">
            Production Usage
          </a>
        </div>
      </aside>

      <main className="docs-content">
        <section id="introduction">
          <h1>Introduction</h1>
          <p>
            Pingui Alert is a lightweight notification service that allows you to send alerts to your Telegram account
            directly from your code. It's designed to be dead simple to use, with zero configuration required on your
            server.
          </p>
        </section>

        <section id="setup">
          <h2>Setup & Authentication</h2>
          <p>To start sending alerts, you need to obtain an API Key from our Telegram bot.</p>
          <ol className="steps-list">
            <li>
              Open Telegram and search for <strong>@PinguiAlertBot</strong> (or your hosted bot instance).
            </li>
            <li>
              Start a chat and send the command <code>/start</code>.
            </li>
            <li>
              The bot will reply with your unique <strong>API Key</strong>. Keep this secret!
            </li>
          </ol>
          <div className="info-box">
            <strong>Note:</strong> The service is completely free. The 10 alerts per day limit helps prevent service
            degradation due to Telegram API rate limits and server capacity constraints on @PinguiAlertBot. If your
            instance is self-hosted, you can increase the limit by setting the <code>MAX_ALERTS</code> environment
            variable.
          </div>
        </section>

        <section id="send-alert">
          <h2>Send an Alert</h2>
          <p>
            Send a POST request to the <code>/alert</code> endpoint to deliver a message.
          </p>

          <div className="endpoint-badge">POST /alert</div>

          <h3>Headers</h3>
          <table className="docs-table">
            <thead>
              <tr>
                <th>Header</th>
                <th>Value</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <code>Authorization</code>
                </td>
                <td>
                  <code>Bearer &lt;YOUR_API_KEY&gt;</code>
                </td>
                <td>Your JWT token received from the bot.</td>
              </tr>
              <tr>
                <td>
                  <code>Content-Type</code>
                </td>
                <td>
                  <code>application/json</code>
                </td>
                <td>Required.</td>
              </tr>
            </tbody>
          </table>

          <h3>Body</h3>
          <pre>
            <code>
              {'{'}"alert": "Your message here"{'}'}
            </code>
          </pre>

          <h3>Example (cURL)</h3>
          <pre>
            <code>
              curl -X POST https://api.pingui.com/alert \{'\n'} -H "Authorization: Bearer YOUR_TOKEN" \{'\n'} -H
              "Content-Type: application/json" \{'\n'} -d '{'{'}"alert": "Hello from my server!"{'}'}'
            </code>
          </pre>
        </section>

        <section id="npm-package">
          <h2>NPM Package</h2>
          <p>If you are using Node.js or TypeScript, we recommend using our official package.</p>

          <h3>Installation</h3>
          <pre>
            <code>npm install pingui-alert</code>
          </pre>

          <h3>Usage</h3>
          <pre>
            <code>
              import {'{'} Pingui {'}'} from 'pingui-alert'; {'\n'}const client = new Pingui('YOUR_API_KEY'); {'\n'}
              await client.send('Database backup completed successfully! ✅');
            </code>
          </pre>
        </section>

        <section id="production-usage">
          <h2>Production Usage</h2>
          <p>
            When using Pingui Alert in production environments, follow these best practices to ensure optimal service
            quality for everyone.
          </p>

          <div className="info-box" style={{ background: 'rgba(251, 146, 60, 0.1)', borderLeftColor: '#fb923c' }}>
            <strong>⚠️ Important:</strong> If you're using the hosted <strong>@PinguiAlertBot</strong> instance in
            production, please reserve it <strong>exclusively for critical alerts</strong> (e.g., system failures,
            security incidents, critical errors). This helps maintain service availability for all users.
          </div>

          <h3>Recommended Production Setup</h3>
          <p>For production workloads with frequent notifications, we recommend one of these approaches:</p>

          <ul className="steps-list">
            <li>
              <strong>Self-Host Your Instance:</strong> Deploy your own Pingui Alert server and bot. This gives you full
              control over rate limits and ensures dedicated resources.
            </li>
            <li>
              <strong>Use for Critical Alerts Only:</strong> If using @PinguiAlertBot, implement filtering logic to send
              only high-priority notifications (failures, errors, security events).
            </li>
            <li>
              <strong>Implement Batching:</strong> Group multiple non-critical alerts into periodic summary messages
              instead of sending individual notifications.
            </li>
          </ul>

          <h3>Self-Hosting</h3>
          <p>To self-host Pingui Alert:</p>
          <pre>
            <code>
              git clone https://github.com/juanvidev1/pingui-alert {'\n'}cd pingui-alert {'\n\n'}# Set your environment
              variables {'\n'} export BOT_TOKEN="your_telegram_bot_token" {'\n'} export JWT_SECRET="your_secret_key"
              {'\n'} export MAX_ALERTS=100 {'\n'} deno task dev
            </code>
          </pre>
        </section>
      </main>
    </div>
  );
};
