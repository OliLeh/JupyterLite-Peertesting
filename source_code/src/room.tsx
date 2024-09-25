import React, {useState, useEffect} from 'react';
import RoomService from './services/rooms'
import WrapperComponent from './WrapperComponent';
import InstructorUpload from './InstructorUpload';
import { INotebookTracker } from '@jupyterlab/notebook';
import StudentUpload from './StudentUpload';


interface RoomProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  pin_code: string;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
  notebooktracker: INotebookTracker;
}

interface Room {
    id: string;
    room_name: string;
    pin_code: string;
    task: {description: string, hasnotebook: boolean};
    instructor_id: any;
  }

export const Room: React.FC<RoomProps> = ({setActiveComponent, token, pin_code, setToken, notebooktracker}) => {
    const [room, setRoom] = useState<Room | null>(null);

  
  const initialRoom = async () => {
    try {
      await RoomService.join(pin_code)
      const r = await RoomService.getRoom(pin_code);
      setRoom(r);
    } catch (exception) {
      alert(exception);
    }
  }

  useEffect(() => {
    if (!token) {
        setActiveComponent('login');
    }
    else if (token.token) {
        RoomService.setToken(token.token);
        initialRoom();
    }
  }, [pin_code])

  const handleDownload = async () => {
    if (!room) return;
    // try put in room service
    try {
      const response = await RoomService.getNotebook(room.pin_code);
      /*https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server/18197341#18197341*/ 

      if (response.status !== 200) {
        throw new Error('Failed to download notebook');
      }

      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'notebook.ipynb';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert(error);
    }
  };


  console.log(room);
  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <div className="room-box">
        <h2>{ room?.room_name }</h2>
        <p>{ room?.task.description }</p>
      </div>
        {room?.task?.hasnotebook && (
          <button className='new-room-button' onClick={handleDownload}>Download Notebook</button>
        )}
        {!room?.task?.hasnotebook && (
          <p>No notebook available</p>
        )}
      <InstructorUpload isVisible={token?.id === room?.instructor_id} notebooktracker={notebooktracker} pin_code={pin_code} token={token}/>
      <StudentUpload isVisible={token?.id !== room?.instructor_id} notebooktracker={notebooktracker} pin_code={pin_code} token={token}/>
      
    </WrapperComponent>
  );
}
