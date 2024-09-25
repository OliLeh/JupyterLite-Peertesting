import React, {useState, useEffect} from 'react';
import RoomService from './services/rooms'
import WrapperComponent from './WrapperComponent';


interface NewRoomProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  setRoomPin: (message: string) => void;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

export const NewRoom: React.FC<NewRoomProps> = ({setActiveComponent, token, setRoomPin, setToken}) => {
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const [notebookFile, setNotebookFile] = useState<File | null>(null);

  useEffect(() => {
    if (!token) {
      setActiveComponent('login');
    } else if (token.token) {
      RoomService.setToken(token.token);
    }
  }, [token, setActiveComponent])

  const createRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('room_name', roomName);
      formData.append('task_description', description);
      if (notebookFile) {
        formData.append('notebook', notebookFile);
      }
  
      let newRoom = await RoomService.create(formData);
      setRoomName('');
      setDescription('');
      setNotebookFile(null);
      setRoomPin(newRoom.pin_code);
      setActiveComponent('room');
    } catch (exception) {
      alert(exception);
    }
  }

  const handleCancel = () => {
    setActiveComponent('choose_room');
  }
  

  
  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token}>
        <div className="title">
          <h1>New Room</h1>
        </div>
        <form className="login-form2" onSubmit={createRoom}>
            <input className="login-input" type="text" placeholder="Room name" value={roomName} onChange={(e) => setRoomName(e.target.value)} required />
            <textarea className="new-room-textarea" placeholder="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
       
            <input id="fileUpload" className="new-room-hidden" type="file" accept=".ipynb" onChange={(e) => setNotebookFile(e.target.files ? e.target.files[0] : null)}/>
            <label className="new-room-button" htmlFor="fileUpload">{notebookFile ? `Selected: ${notebookFile.name}` : 'Upload File'}</label>
            <button className="login-button" type="submit">Create</button>
            <button className="room-cancel-button" type="button" onClick={handleCancel}>Cancel</button>

        </form>
    </WrapperComponent>
  );
}
