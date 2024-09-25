import React, {useState} from 'react';
import loginService from './services/login'


interface LoginProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  setToken: (token: {token: string, username:string, id:string }|null) => void;
}

export const Login: React.FC<LoginProps> = ({setActiveComponent, token, setToken}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigateToRegister = () => {
    setActiveComponent('register');
  }
  const navigateToChooseRoom = () => {
    setActiveComponent('choose_room');
  }

  const handleLogin = async (event:any) => {
    event.preventDefault();
    try {
      const token = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem(
        'loggedPuzzleappUser', JSON.stringify(token)
      )
      setToken(token);
      setUsername('');
      setPassword('');
      navigateToChooseRoom();
    } catch (exception) {
      alert('Wrong credentials');
    }
  }
  return (
    <div className="login-wrapper">
        <div className="title">
            <h1>Login</h1>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
            <input className="login-input" type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input className="login-input" type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button className="login-button" type="submit">Login</button>
            <p className="login-p">Don't have an account? <a className="login-a" onClick={navigateToRegister}>Register</a></p>
        </form>
    </div>
  );
}
