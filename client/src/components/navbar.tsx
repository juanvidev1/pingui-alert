import React from 'react';

export const Navbar = () => {
  const auth = sessionStorage.getItem('auth');
  const links = auth
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/settings', label: 'Settings' },
        { href: '#', label: 'Logout' }
      ]
    : [
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' }
      ];

  React.useEffect(() => {
    const chatId = sessionStorage.getItem('chatId');
    const secret = sessionStorage.getItem('secret');
    const auth = sessionStorage.getItem('auth');
    if (chatId && secret && auth) {
      console.log('auth', auth);
    }
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        Pingui Alert <span className="badge">Beta</span>
      </div>
      <div className="nav-links">
        <a href="/docs" className="nav-link">
          Documentation
        </a>
        <a href="https://github.com/juanvidev1/pingui-alert" target="_blank" className="nav-link">
          GitHub
        </a>
        {links.map((link) => (
          <a key={link.href} href={link.href} className="nav-link">
            {auth && link.href === '#' ? (
              <button
                type="button"
                className="nav-link"
                style={{ cursor: 'pointer', background: 'none', border: 'none', outline: 'none' }}
                onClick={() => {
                  sessionStorage.removeItem('chatId');
                  sessionStorage.removeItem('secret');
                  sessionStorage.removeItem('auth');
                  globalThis.location.href = '/';
                }}
              >
                Logout
              </button>
            ) : (
              link.label
            )}
          </a>
        ))}
      </div>
    </nav>
  );
};
