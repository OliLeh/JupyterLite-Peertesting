
import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  setActiveComponent: (message: string) => void;
}

export const Register: React.FC<RegisterProps> = ({setActiveComponent}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigateToLogin = () => {
    setActiveComponent('login');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
        alert('Registration successful');
        navigateToLogin();
    } catch (error) {
      console.error('Error:', error);
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && typeof error.response.data === 'object') {
          const errorData = error.response.data as { error: string };
          alert(errorData.error);
        } else {
          alert('An error occurred during registration');
        }
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <div className="login-wrapper">
        <div className="title">
            <h1>Register</h1>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
            <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className="login-input" type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <input className="login-input" type="text" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <button className="login-button" type="submit">Register</button>
            <p className="login-p">Already have an account? <a className="login-a" onClick={navigateToLogin}>Log in</a></p>
        </form>
        
    </div>
  );
}
