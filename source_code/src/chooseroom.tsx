import React, {useState, useEffect} from 'react';
import RoomService from './services/rooms'
import { Room } from './room';
import WrapperComponent from './WrapperComponent';

interface ChooseRoomProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  setRoomPin: (message: string) => void;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

interface Room {
  id: string;
  room_name: string;
  pin_code: string;
  task: {description: string};
}

interface RoomListProps {
  rooms: Room[];
  setRoomPin: (message: string) => void;
  setActiveComponent: (message: string) => void;
}

const RoomList: React.FC<RoomListProps> = React.memo(({ rooms, setRoomPin, setActiveComponent }) => (
  <div style={{height: '150px', overflowY: 'scroll', marginTop:"1.5rem", marginBottom:"1.5rem", border: '2px solid rgb(204, 204, 204)', borderRadius: '8px'}}>
    {rooms.map(room =>
      <div key={room.id}>
        <button className='room-button' onClick={() => {setRoomPin(room.pin_code); setActiveComponent('room')}}>
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <p style={{margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{room.room_name}</p>
            <p style={{margin: 0}}>{room.pin_code}</p>
          </div>
        </button>
      </div>
    )}
  </div>
));



export const ChooseRoom: React.FC<ChooseRoomProps> = ({setActiveComponent, token, setRoomPin, setToken}) => {
  const [temproompin, setTempRoomPin] = useState('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (/^[0-9]+$/.test(newValue) && newValue.length <= 6 || newValue === '') {
      setTempRoomPin(newValue);
    }
  };

  const initialRoom = async () => {
    try {
      await RoomService.setToken(token?.token);
      const r = await RoomService.myrooms();
      setRooms(r);
    } catch (exception: any) {
      if (exception.response.status === 401) {
        setActiveComponent('login');
      }
      else{
        alert(exception);
      }
    }
  }

  useEffect(() => {
    if (!token) {
        setActiveComponent('login');
    }
    else if (token.token) {
        initialRoom();
    }
  }, [])

  const joinRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    if (temproompin.length !== 6) {
      alert('Please enter a 6 digit room PIN');
    }
    else {
      setRoomPin(temproompin)
      setActiveComponent('room');
    }
  }

  
  
  return (
    <WrapperComponent setActiveComponent={setActiveComponent} token={token} setToken={setToken}>
          <form className="login-form2" onSubmit={joinRoom}>
              <input className="login-input" type="text" placeholder="Room PIN" value={temproompin} onChange={handleChange} required />
              <button className="login-button" type="submit">Join</button>
              <RoomList rooms={rooms} setRoomPin={setRoomPin} setActiveComponent={setActiveComponent} />
              <button className="new-room-button" onClick={()=>setActiveComponent('newroom')}>Create New Room</button>
          </form>
    </WrapperComponent>
  );
}
