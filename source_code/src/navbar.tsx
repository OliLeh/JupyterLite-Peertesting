import React from 'react';
import RoomService from './services/rooms';

interface NavbarProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
  pin_code?: string;
}

const Navbar: React.FC<NavbarProps> = ({ setActiveComponent, setToken, token, pin_code }) => {
  const [room, setRoom] = React.useState<any>(null);

  React.useEffect(() => {
    if (!token) {
      setActiveComponent('login');
    }
    else if (token.token && pin_code) {
      initialRoom();
    }
  }, [pin_code, token])

  const initialRoom = async () => {
    try {
      const r = await RoomService.getRoom(pin_code);
      setRoom(r);
    } catch (exception) {
      alert(exception);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedPuzzleappUser');
    setToken(null);
    setActiveComponent('login');
  };

  return (
    <div className="room-navbar">
        <div className="left-items">
          {pin_code && (<>
          <a onClick={() => setActiveComponent('room')}>Task</a>
          
          <div className="room-dropdown">
            <button className="room-dropbtn">Testcases ▼</button>
            <div className="room-dropdown-content">
              {token?.id === room?.instructor_id && (
                <a onClick={() => setActiveComponent('pending_testcases')}>Pending Testcases</a>
              )}
              <a onClick={() => setActiveComponent('all_testcases')}>All Testcases</a>
              <a onClick={() => setActiveComponent('create_testcases')}>Create Testcases</a>
              <a onClick={() => setActiveComponent('my_testcases')}>My Testcases</a>
            </div>
          </div></>)}
        </div>
      <div className="right-items">
        <div className="room-dropdown">
          <button className="room-dropbtn">Profile ▼</button>
          <div className="room-dropdown-content">
            {pin_code && (
              <>
                <a onClick={() => setActiveComponent('choose_room')}>Change Room</a>
                {token?.id === room?.instructor_id && (
                  <>
                  <a onClick={() => {
                    if (window.confirm('Are you sure you want to delete the room?')) {
                      RoomService.deleteRoom(pin_code);
                      setActiveComponent('choose_room');
                    }
                  }}>Delete Room</a>
                  <a onClick={() => {
                      setActiveComponent('update_room');
                  }}>Update Room</a>
                  </>
                )}
              </>
            )}
            <a onClick={handleLogout}>Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
