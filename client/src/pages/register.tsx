export const Register = () => {
  const telegramButtonStyle = {
    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--border-radius-sm)',
    padding: '0.8rem 1.5rem',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontWeight: '600',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-main)',
    textTransform: 'uppercase',
    boxShadow: 'var(--shadow-sm)',
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: 'var(--shadow-md), var(--shadow-glow)'
    },
    '&:active': {
      transform: 'translateY(0)'
    }
  };

  return (
    <main>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">Register</h1>
            <p className="subtitle">
              To register you must chat with @pinguialertbot and send the command /start to get your temporal password
            </p>
            <a
              href="https://t.me/pinguialertbot"
              target="_blank"
              rel="noopener noreferrer"
              style={{ margin: '1.5rem 0' }}
            >
              <button type="button" style={telegramButtonStyle}>
                Chat with @pinguialertbot
              </button>
            </a>
          </div>
        </header>
      </div>
    </main>
  );
};
