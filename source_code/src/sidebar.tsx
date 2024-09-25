import React, {useState, useEffect} from 'react';
import { Login } from './login';
import { Register } from './register';
import { ChooseRoom } from './chooseroom';
import { Room } from './room';
import { NewRoom } from './newroom';
import { UpdateRoom } from './updateroom';
import { MyTestcases } from './mytestcases';
import { PendingTestcases } from './pendingtestcases';
import { AllTestcases } from './alltestcases';
import { CreateTestcases } from './createtestcases';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Signal } from '@lumino/signaling';
import { ReactWidget } from '@jupyterlab/apputils';
import RoomService from './services/rooms'
import TestCaseService from './services/testcases'
import SubmissionService from './services/submissions'


interface SidebarProps {
    _lastShoutMessage: string
    _messageShouted: Signal<ReactWidget, { message: string }>;
    _notebookTracker: INotebookTracker
  }

export const Sidebar: React.FC<SidebarProps> = ({_lastShoutMessage, _messageShouted, _notebookTracker}) => {
    const [activeComponent, setActiveComponent] = useState('register');
    const [token, setToken] = useState<{token: string, username:string, id:string }|null>(null);
    const [roomPin, setRoomPin] = useState('');

    const setAllTokens = (token: {token: string, username:string, id:string }|null) => {
      setToken(token);
      RoomService.setToken(token?.token);
      TestCaseService.setToken(token?.token);
      SubmissionService.setToken(token?.token);
    }

    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedPuzzleappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        setAllTokens(user)
      }  
    }, [])

    const renderComponent = () => {
      switch (activeComponent) {
        case 'login':
          return <Login setActiveComponent={setActiveComponent} token={token} setToken={setAllTokens} />;
        case 'register':
          return <Register setActiveComponent={setActiveComponent} />;
        case 'choose_room':
          return <ChooseRoom token={token} setActiveComponent={setActiveComponent} setRoomPin={setRoomPin} setToken={setAllTokens} />;
        case 'room':
          return <Room token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} notebooktracker={_notebookTracker}/>;
        case 'my_testcases':
          return <MyTestcases token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} />;
        case 'all_testcases':
          return <AllTestcases token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} />;
        case 'create_testcases':
          return <CreateTestcases token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} />;
        case 'pending_testcases':
          return <PendingTestcases token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} />;
        case 'newroom':
          return <NewRoom token={token} setActiveComponent={setActiveComponent} setRoomPin={setRoomPin} setToken={setAllTokens}/>;
        case 'update_room':
          return <UpdateRoom token={token} setActiveComponent={setActiveComponent} pin_code={roomPin} setToken={setAllTokens} />;

        default:
          return null;
      }
    };

    return (
      <div>
        {renderComponent()}
      </div>
    );
    }