import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../hooks/userData.ts';
import { useUserUpdate } from '../hooks/userUpdate.ts';
import { UpdatePasswordForm } from '../components/updatePasswordForm.tsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../styles/settings.css';

export const Settings = () => {
  const [user, setUser] = useState({
    username: '',
    secret: '',
    password: '',
    email: '',
    alertsRemaining: 0,
    registeredAt: '',
    chatId: 0
  });
  const navigate = useNavigate();

  const foundUser = async () => {
    const chatId = globalThis.location.pathname.split('/')[2];
    const secret = sessionStorage.getItem('secret');
    const userData = await useUserData(chatId || '', secret || '');
    // console.log(userData);
    if (!userData.success) {
      console.log(userData.error);
      return;
    }
    setUser(userData.user);
    setUsername(userData.user.username);
    setEmail(userData.user.email);
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chatId = globalThis.location.pathname.split('/')[2];
    const secret = sessionStorage.getItem('secret');
    const userData = await useUserUpdate(chatId || '', secret || '', username, email);
    console.log(userData);
    if (!userData?.updatedUser.success) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: userData.message
      });
      return;
    }
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'User updated successfully'
    });
    setUser(userData.updatedUser.user);
  };

  const showUpdatePasswordModal = () => {
    const psswUpdate = withReactContent(Swal);
    psswUpdate.fire({
      title: 'Update Password',
      html: <UpdatePasswordForm />
    });
  };

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
    foundUser();
    console.log(user);
  }, []);

  return (
    <div>
      <h1 className="title">Update your basic data</h1>
      <p className="description">Here you can update your username and/or email</p>
      <form onSubmit={handleUpdate} className="update-form">
        <input
          type="text"
          placeholder="Username"
          className="update-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="update-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="button-container">
          <button type="submit">Save</button>
          <button type="button" className="update-password-button" onClick={() => showUpdatePasswordModal()}>
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};
