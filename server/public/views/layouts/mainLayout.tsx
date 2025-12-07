import { FC, Child } from 'hono/jsx';

export const MainLayout: FC<{ children: Child }> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pingui Alert - Instant Telegram Notifications</title>
        <meta
          name="description"
          content="The easiest way to send notifications from your code to Telegram. Simple, fast, and developer-friendly."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/styles.css" />
      </head>
      <body>
        <div class="background-glow"></div>

        <nav class="navbar">
          <div class="logo">
            Pingui Alert <span class="badge">Beta</span>
          </div>
          <div class="nav-links">
            <a href="/docs" class="nav-link">
              Documentation
            </a>
            <a href="https://github.com/juanvidev1/pingui-alert" target="_blank" class="nav-link">
              GitHub
            </a>
          </div>
        </nav>

        {children}

        <footer>
          <p>
            &copy; 2025 Pingui Alert. Built with ❤️ by <a href="https://github.com/juanvidev1">Juan Vicente</a>.
          </p>
        </footer>
      </body>
    </html>
  );
};
