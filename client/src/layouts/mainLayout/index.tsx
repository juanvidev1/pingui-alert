import React from 'react';
import { Navbar } from '../../components/navbar.tsx';
import '../../App.css';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const auth = sessionStorage.getItem('auth');

    console.log(auth);
  }, []);

  return (
    <>
      <div className="background-glow"></div>

      <Navbar />

      {children}

      <footer>
        <p>
          &copy; 2025 Pingui Alert. Built with ❤️ by <a href="https://github.com/juanvidev1">Juan Vicente</a>.
        </p>
      </footer>
    </>
  );
};
