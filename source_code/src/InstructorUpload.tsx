import { config } from './config';

import React from 'react';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IExecuteResult } from '@jupyterlab/nbformat';
import axios from 'axios';


function isExecuteResult(output: any): output is IExecuteResult {
    return (
      output &&
      typeof output === 'object' &&
      'data' in output &&
      'text/plain' in output.data
    );
  }


interface InstructorUploadProps {
  isVisible: boolean;
  notebooktracker: INotebookTracker;
  pin_code: string;
  token: {token: string, username:string, id:string }|null;
}

const InstructorUpload: React.FC<InstructorUploadProps> = ({ isVisible, notebooktracker, pin_code, token }) => {
    //const [predictions, setPredictions] = React.useState<string[]>([]);
    const upload = () => {
        console.log('Uploading reference solution');
        const notebookTrack = notebooktracker;
        const notebookPanel = notebookTrack.currentWidget;
        if (notebookPanel) {
          const sessionContext = notebookPanel.sessionContext;
          
          let code = `
          import io
          import cloudpickle
          import base64
          
          file = io.BytesIO()
          cloudpickle.dump(predict,file)
          data_bytes = file.getvalue()
          function_data = base64.b64encode(data_bytes).decode('utf-8')
          function_data
          `
          let future = sessionContext.session?.kernel?.requestExecute({
            code: code,
          });
          // get dump from kernel to js
          if (future) {
            future.onIOPub = (msg) => {
                let content = msg.content
  
                if (isExecuteResult(content)) {
                  const func = content.data['text/plain'];
                  try{
                    console.log('Function length:', func.length);
                    const con = { headers: { Authorization: `Bearer ${token?.token}` } };
                    axios.post(`${config.BACKEND_URL}/rooms/${pin_code}/upload_sol`,{ func: func }, con)
                  } catch (e) {
                    console.log('Error:', e);
                  }
                  
                }
            };
          }
        }
    }

    /*const execute = () => {
        const con = { headers: { Authorization: `Bearer ${token?.token}` } };
        axios.get(`${config.BACKEND_URL}/rooms/${pin_code}/execute_sol`, con)
        .then(response => {
            setPredictions(response.data.predictions);
            })
            .catch(error => {
                console.error('Error getting solution:', error);
            });
    }*/



  if (!isVisible) return null;
  return(
    <button className="login-button" onClick={upload}>Upload Solution</button>
  /*
  <div className="login-input">

    <button className="login-button" onClick={upload}>Upload Solution</button>
    <button className="login-button" onClick={execute}>Execute Solution</button>

    <div>
    <h3>Predictions:</h3>
      {predictions.length > 0 ? (
        <ul>
          {predictions.map((prediction, index) => (
            <li key={index}>Image {index + 1}: {prediction}</li>
          ))}
        </ul>
      ) : (
        <p>No predictions yet.</p>
      )}
    </div>
  </div>*/
  );
};

export default InstructorUpload;
