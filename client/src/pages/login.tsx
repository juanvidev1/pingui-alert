import { useState } from 'react';

export const Login = () => {
  const [chatId, setChatId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(chatId, password);
    fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ chatId, password })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.success) {
          sessionStorage.setItem('chatId', chatId);
          sessionStorage.setItem('secret', data.secret);
          sessionStorage.setItem('auth', 'true');
          globalThis.location.href = `/user-data/${chatId}`;
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred. Please try again later.');
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'chatId') {
      setChatId(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  return (
    <main>
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1 className="title">Welcome Back</h1>
            <p className="subtitle">Sign in to access your Pingui Alert dashboard</p>
          </div>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="chatId">Chat ID</label>
            <input
              type="number"
              id="chatId"
              name="chatId"
              placeholder="Enter your Telegram Chat ID"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-gradient">
            Sign In
          </button>
        </form>
      </div>
    </main>
  );
};
