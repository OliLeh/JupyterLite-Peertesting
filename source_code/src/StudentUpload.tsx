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


interface StudentUploadProps {
  isVisible: boolean;
  notebooktracker: INotebookTracker;
  pin_code: string;
  token: {token: string, username:string, id:string }|null;
}

const StudentUpload: React.FC<StudentUploadProps> = ({ isVisible, notebooktracker, pin_code, token }) => {
    const upload = () => {
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
                    axios.post(`${config.BACKEND_URL}/submissions/${pin_code}`,{ func: func }, con)
                  } catch (e) {
                    console.log('Error:', e);
                  }
                  
                }
            };
          }
        }
    }



  if (!isVisible) return null;
  return(
    <button className="login-button" onClick={upload}>Submit Solution</button>
  );
};

export default StudentUpload;
