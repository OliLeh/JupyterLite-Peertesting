import React, { useState, useEffect } from 'react';
import RoomService from './services/rooms'
import WrapperComponent from './WrapperComponent';

interface UpdateRoomProps {
  setActiveComponent: (message: string) => void;
  token: { token: string, username: string, id: string } | null;
  pin_code: string;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

export const UpdateRoom: React.FC<UpdateRoomProps> = ({ setActiveComponent, token, pin_code, setToken}) => {
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

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await RoomService.getRoom(pin_code);
        setRoomName(room.room_name);
        setDescription(room.task.description);
        if (room.task.hasnotebook){
            const notebookResponse = await RoomService.getNotebook(pin_code);
            if (notebookResponse.data) {
            const blob = new Blob([notebookResponse.data], { type: 'application/x-ipynb+json' });
            const file = new File([blob], "notebook.ipynb", { type: "application/x-ipynb+json" });
            setNotebookFile(file);
            }
        }   
      } catch (exception) {
        alert(exception);
      }
    }
  
    fetchRoom();
  }, [pin_code])

  const updateRoom = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('room_name', roomName);
      formData.append('task_description', description);
      if (notebookFile) {
        formData.append('notebook', notebookFile);
      }

      await RoomService.update(pin_code, formData);
      setNotebookFile(null);
      setActiveComponent('room');
    } catch (exception) {
      alert(exception);
    }
  }

  const handleCancel = () => {
    setActiveComponent('room');
  }

  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <div className="title">
        <h1>Update Room</h1>
      </div>
      <form className="login-form2" onSubmit={updateRoom}>
        <input 
          className="login-input" 
          type="text" 
          placeholder="Room name" 
          value={roomName} 
          onChange={(e) => setRoomName(e.target.value)} 
          required 
        />
        <textarea 
          className="new-room-textarea" 
          placeholder="description" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
        <input 
          id="fileUpload" 
          className="new-room-hidden" 
          type="file" 
          accept=".ipynb" 
          onChange={(e) => setNotebookFile(e.target.files ? e.target.files[0] : null)}
        />
        <label className="new-room-button" htmlFor="fileUpload">
          {notebookFile ? `Selected: ${notebookFile.name}` : 'Upload New Notebook'}
        </label>
        <button className="login-button" type="submit">Update</button>
        <button className="room-cancel-button" type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </WrapperComponent>
  );
}
