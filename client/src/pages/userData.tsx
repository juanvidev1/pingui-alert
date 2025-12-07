import { useEffect, useState } from 'react';
import { useUserData } from '../hooks/userData.ts';
import { useNavigate } from 'react-router-dom';

export const UserData = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
  }, []);

  const chatId = globalThis.location.pathname.split('/')[2];
  const secret = sessionStorage.getItem('secret');

  const [user, setUser] = useState({
    chatId: '',
    username: '',
    alertsRemaining: 0,
    registeredAt: '',
    secret: ''
  });
  const [isSecretVisible, setIsSecretVisible] = useState(false);

  const getUserData = async () => {
    const userData = await useUserData(chatId || '', secret || '');
    if (userData.error) {
      console.log(userData.error);
      return (
        <main className="main-content">
          <div className="error-message">User not found</div>
        </main>
      );
    }
    setUser(userData.user);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(user.secret);
    alert('Secret copied to clipboard');
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <main className="main-content">
      <div className="info-grid">
        <div className="info-card">
          <div className="card-label">Chat ID</div>
          <div className="card-value" id="chatId">
            {user.chatId}
          </div>
        </div>

        <div className="info-card">
          <div className="card-label">Username</div>
          <div className="card-value" id="username">
            {user.username}
          </div>
        </div>

        <div className="info-card highlight">
          <div className="card-label">Remaining Alerts</div>
          <div className="card-value-large" id="alertsRemaining">
            {user.alertsRemaining}
          </div>
        </div>
        <div className="info-card">
          <div className="card-label">Registered At</div>
          <div className="card-value" id="registeredAt">
            {new Date(user.registeredAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="secret-section">
        <div className="secret-header">
          <div className="secret-label">
            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
            Secret Key
          </div>
          <span className="secret-badge">Confidencial</span>
        </div>
        <div className="secret-code-container">
          <code className={isSecretVisible ? 'secret-code' : 'secret-code blurred'} id="secret">
            {user.secret}
          </code>
          <button
            type="button"
            className="reveal-button"
            onClick={() => setIsSecretVisible(!isSecretVisible)}
            id="revealButton"
            title="Mostrar/Ocultar secret"
          >
            <svg className="eye-icon" id="eyeIcon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
              <path
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              ></path>
            </svg>
          </button>
          <button type="button" className="copy-button" onClick={copySecret} id="copyButton">
            <svg className="copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
            <span className="copy-text">Copy</span>
          </button>
        </div>
        <p className="secret-warning">⚠️ Keep this secret private. Use it to authenticate your alerts.</p>
      </div>
    </main>
  );
};
