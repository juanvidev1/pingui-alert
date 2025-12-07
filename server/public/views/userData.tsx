import { FC } from 'hono/jsx';
import { MainLayout } from './layouts/mainLayout.tsx';

// Fix for 'clipboard' property on Navigator
declare global {
  interface Navigator {
    clipboard: {
      writeText(text: string): Promise<void>;
    };
  }
}

export const UserData: FC<{
  chatId: string | number;
  username?: string;
  alertsRemaining?: number;
  registeredAt?: string | Date;
  secret?: string;
}> = ({ chatId, username, alertsRemaining, registeredAt, secret }) => {
  console.log('Datos', chatId, username, alertsRemaining, registeredAt, secret);

  const initDate = registeredAt ? new Date(registeredAt) : new Date();
  const formattedDate = initDate.toLocaleDateString();
  return (
    <MainLayout>
      <div class="container">
        {/* Header */}
        <header class="header">
          <div class="header-content">
            <h1 class="title">User Information</h1>
            <p class="subtitle">Details of your account in Pingui Alert</p>
          </div>
        </header>

        {/* <!-- Main Content --> */}
        <main class="main-content">
          {/* <!-- User Info Cards --> */}
          <div class="info-grid">
            {/* <!-- Chat ID Card --> */}
            <div class="info-card">
              <div class="card-label">Chat ID</div>
              <div class="card-value" id="chatId">
                {chatId}
              </div>
            </div>

            {/* <!-- Username Card --> */}
            <div class="info-card">
              <div class="card-label">Username</div>
              <div class="card-value" id="username">
                {username}
              </div>
            </div>

            {/* <!-- Alerts Remaining Card --> */}
            <div class="info-card highlight">
              <div class="card-label">Remaining Alerts</div>
              <div class="card-value-large" id="alertsRemaining">
                {alertsRemaining}
              </div>
            </div>

            {/* <!-- Registered At Card --> */}
            <div class="info-card">
              <div class="card-label">Registered At</div>
              <div class="card-value" id="registeredAt">
                {formattedDate}
              </div>
            </div>
          </div>

          {/* <!-- Secret Key Section --> */}
          <div class="secret-section">
            <div class="secret-header">
              <div class="secret-label">
                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Secret Key
              </div>
              <span class="secret-badge">Confidencial</span>
            </div>
            <div class="secret-code-container">
              <code class="secret-code blurred" id="secret">
                {secret}
              </code>
              <button
                class="reveal-button"
                onclick="toggleSecretVisibility()"
                id="revealButton"
                title="Mostrar/Ocultar secret"
                type="button"
              >
                <svg class="eye-icon" id="eyeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
              <button class="copy-button" onclick="copySecret()" id="copyButton" type="button">
                <svg class="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                <span class="copy-text">Copy</span>
              </button>
            </div>
            <p class="secret-warning">⚠️ Keep this secret private. Use it to authenticate your alerts.</p>
          </div>
        </main>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            let isSecretVisible = false;

            function toggleSecretVisibility() {
              const secretElement = document.getElementById("secret");
              const revealButton = document.getElementById("revealButton");
              const eyeIcon = document.getElementById("eyeIcon");

              isSecretVisible = !isSecretVisible;

              if (isSecretVisible) {
                secretElement.classList.remove("blurred");
                revealButton.classList.add("active");
                eyeIcon.innerHTML = \`
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                \`;
              } else {
                secretElement.classList.add("blurred");
                revealButton.classList.remove("active");
                eyeIcon.innerHTML = \`
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                \`;
              }
            }

            function copySecret() {
              const secretElement = document.getElementById("secret");
              const copyButton = document.getElementById("copyButton");
              const secretText = secretElement.textContent.trim();

              if (!navigator.clipboard) {
                alert("Clipboard API not supported");
                return;
              }

              navigator.clipboard
                .writeText(secretText)
                .then(() => {
                  copyButton.classList.add("copied");
                  const copyText = copyButton.querySelector(".copy-text");
                  const originalText = copyText.textContent;
                  copyText.textContent = "¡Copiado!";

                  setTimeout(() => {
                    copyButton.classList.remove("copied");
                    copyText.textContent = originalText;
                  }, 2000);
                })
                .catch((err) => {
                  console.error("Error al copiar:", err);
                  alert("No se pudo copiar el secret");
                });
            }

            window.addEventListener("DOMContentLoaded", () => {
              const registeredAtElement = document.getElementById("registeredAt");
              if (registeredAtElement) {
                const dateText = registeredAtElement.textContent.trim();
                try {
                  const date = new Date(dateText);
                  if (!isNaN(date.getTime())) {
                    const options = {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    };
                    registeredAtElement.textContent = date.toLocaleDateString("es-ES", options);
                  }
                } catch (e) {
                }
              }
            });
          `
        }}
      />
    </MainLayout>
  );
};
