import React, { useState, useEffect } from 'react';
import TestCaseService from './services/testcases';
import WrapperComponent from './WrapperComponent';
import RectangularDrawing from "./rectangulardrawing";


interface CreateTestcasesProps {
  setActiveComponent: (message: string) => void;
  token: {token: string, username:string, id:string }|null;
  pin_code: string;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

export const CreateTestcases: React.FC<CreateTestcasesProps> = ({setActiveComponent, token, pin_code, setToken}) => {
    const [images, setImages] = useState<string[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [testcaseName, setTestcaseName] = useState<string>("");
    const [error, setError] = useState('');

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => {
          setError('');
        }, 3000);
    
        return () => clearTimeout(timer);
      }
    }, [error]);


    const handleUpload = (img: string, label: string) => {
        setImages([...images, img]);
        setLabels([...labels, label]);
    }

    const handleTestcaseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTestcaseName(event.target.value);
    };

    const remove = (index: number) => () => {
        setImages(images.filter((_, i) => i !== index));
        setLabels(labels.filter((_, i) => i !== index));
    }

    const handleSubmit = async () => {
        if (images.length === 0) {
            setError('Add at least one testcase.');
            return;
        }
        if (testcaseName === '') {
            setError('Please enter a testset name.');
            return;
        }
        try {
            const response = await TestCaseService.create(pin_code, images, labels, testcaseName);
            setImages([]);
            setLabels([]);
            setTestcaseName('');
            if (response.percentagePassed < 80){
                alert(`Testcases pending approval. ${response.percentagePassed.toFixed(2)}% passed reference solution.`);
            } else {
                alert(`Testcases created. ${response.percentagePassed.toFixed(2)}% passed reference solution.`);
            }
        } catch (exception) {
            alert(exception);
        }
    }

    return (
      <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <h1 className="title">Create Testcases</h1>

      <RectangularDrawing handleUpload={handleUpload} />

      <div className="images-container">
        <h2 style={{textAlign: 'center', margin: '7.5px'}}>Images</h2>
        <div style={{width: '100%'}}>
          <div className="images-scrollbox">
            {images.map((img, index) => (
              <div key={index} className="image-item">
                <img src={img} alt="" width="20" height="20" />
                <span>{labels[index]}</span>
                <button className="remove-button" onClick={remove(index)}>✕</button>
              </div>
            ))}
          </div>
      </div>
  
  <div className="input-button-container">
    <input
      className="input"
      type="text"
      value={testcaseName}
      onChange={handleTestcaseNameChange}
      placeholder="Testset Name"
    />
    <button className="button" onClick={handleSubmit}>Submit</button>
  </div>
  {error && (
          <div style={{ color: 'red', marginTop: '5px', fontSize: '0.9rem', height: '17.5px', width: '100%' }}>
            {error}
          </div>
      )}
      {!error && (
          <div style={{ color: 'red', marginTop: '5px', fontSize: '0.9rem', height: '17.5px', width: '100%' }}>
            
          </div>
      )}
</div>
  </WrapperComponent>
    );
}