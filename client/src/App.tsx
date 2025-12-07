import { MainLayout } from './layouts/mainLayout/index.tsx';
import { Home } from './pages/home.tsx';
import { Docs } from './pages/docs.tsx';
import { Login } from './pages/login.tsx';
import { Register } from './pages/register.tsx';
import { UserData } from './pages/userData.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-data/:chatId" element={<UserData />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
