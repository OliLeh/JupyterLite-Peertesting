import React from 'react';
import Navbar from './navbar';

interface WrapperComponentProps {
  setActiveComponent: (message: string) => void;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
  token: { token: string, username: string, id: string } | null;
  pin_code?: string;
  children: React.ReactNode;
}

const RoomWrapperComponent: React.FC<WrapperComponentProps> = ({ setActiveComponent, setToken, token, pin_code, children }) => {
  return (
    <div className="login-wrapper">
      <Navbar setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code} />
      <div className="login-form">
        {children}
      </div>
    </div>
  );
}

export default RoomWrapperComponent;
