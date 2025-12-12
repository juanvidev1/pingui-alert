import { useUserUpdatePassword } from '../hooks/userUpdate.ts';
import { useState } from 'react';
import eyeClosed from '../assets/eye-closed.svg';
import eyeOpen from '../assets/eye-show.svg';
import Swal from 'sweetalert2';

export const UpdatePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState('password');
  const [showOldPassword, setShowOldPassword] = useState('password');
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState('password');
  const [error, setError] = useState({
    oldPassword: '',
    password: '',
    passwordConfirmation: ''
  });

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const chatId = globalThis.location.pathname.split('/')[2];
    const secret = sessionStorage.getItem('secret');
    const passwordData = await useUserUpdatePassword(
      chatId || '',
      secret || '',
      oldPassword,
      password,
      passwordConfirmation
    );
    if (!passwordData.success) {
      console.log(passwordData);
      if (passwordData.error === 'Invalid password or password confirmation') {
        setError({
          oldPassword: 'Invalid password or password confirmation',
          password: '',
          passwordConfirmation: ''
        });
      } else if (passwordData.error === 'User not found') {
        setError({
          oldPassword: '',
          password: '',
          passwordConfirmation: 'User not found'
        });
      } else if (passwordData.error === 'Old password is incorrect') {
        setError({
          oldPassword: 'Old password is incorrect',
          password: '',
          passwordConfirmation: ''
        });
      } else if (passwordData.error === 'Passwords do not match') {
        setError({
          oldPassword: '',
          password: '',
          passwordConfirmation: 'Passwords do not match'
        });
      } else {
        setError({
          oldPassword: '',
          password: '',
          passwordConfirmation: ''
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Password updated successfully'
        });
      }
    }
  };

  const togglePasswordVisibility = (type: string) => {
    if (type === 'password') {
      setShowPassword(showPassword === 'password' ? 'text' : 'password');
    } else if (type === 'oldPassword') {
      setShowOldPassword(showOldPassword === 'password' ? 'text' : 'password');
    } else if (type === 'passwordConfirmation') {
      setShowPasswordConfirmation(showPasswordConfirmation === 'password' ? 'text' : 'password');
    }
  };
  return (
    <form onSubmit={handleUpdatePassword} className="update-form">
      <div className="password-container">
        <input
          type={showOldPassword}
          placeholder="Old Password"
          className="update-input"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <button type="button" className="show-password-button" onClick={() => togglePasswordVisibility('oldPassword')}>
          {showOldPassword === 'password' ? (
            <img src={eyeOpen} alt="Show Password" />
          ) : (
            <img src={eyeClosed} alt="Hide Password" />
          )}
        </button>
      </div>
      {error && <p className="error">{error.oldPassword}</p>}
      <div className="password-container">
        <input
          type={showPassword}
          placeholder="Password"
          className="update-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="show-password-button" onClick={() => togglePasswordVisibility('password')}>
          {showPassword === 'password' ? (
            <img src={eyeOpen} alt="Show Password" />
          ) : (
            <img src={eyeClosed} alt="Hide Password" />
          )}
        </button>
      </div>
      {error && <p className="error">{error.password}</p>}
      <div className="password-container">
        <input
          type={showPasswordConfirmation}
          placeholder="Confirm Password"
          className="update-input"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button
          type="button"
          className="show-password-button"
          onClick={() => togglePasswordVisibility('passwordConfirmation')}
        >
          {showPasswordConfirmation === 'password' ? (
            <img src={eyeOpen} alt="Show Password" />
          ) : (
            <img src={eyeClosed} alt="Hide Password" />
          )}
        </button>
      </div>
      {error && <p className="error">{error.passwordConfirmation}</p>}
      <button type="submit" className="update-password-button">
        Update Password
      </button>
    </form>
  );
};
