import React, { useEffect, useRef, useState } from 'react';

function Canvas({ handleUpload }) {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [label, setLabel] = useState('');
  const [lineWidth, setLineWidth] = useState(21);
  const [currentTool, setCurrentTool] = useState('brush');
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [error]);
  



  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 214 * 2;
    canvas.height = 214 * 2;
    canvas.style.width = '214px';
    canvas.style.height = '214px';

    const context = canvas.getContext('2d');
    contextRef.current = context;

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleCancel);
    canvas.addEventListener('touchmove', handleMove);

    return () => {
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchend', handleEnd);
      canvas.removeEventListener('touchcancel', handleCancel);
      canvas.removeEventListener('touchmove', handleMove);
    };
  }, []);

  const ongoingTouches = useRef([]);

  const handleStart = (evt) => {
    evt.preventDefault();
    const touches = evt.changedTouches;
    const offsetX = canvasRef.current.getBoundingClientRect().left;
    const offsetY = canvasRef.current.getBoundingClientRect().top;
    for (let i = 0; i < touches.length; i++) {
      ongoingTouches.current.push(copyTouch(touches[i]));
    }
  };

  const handleMove = (evt) => {
    evt.preventDefault();
    const touches = evt.changedTouches;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
  
    for (let i = 0; i < touches.length; i++) {
      const idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        contextRef.current.beginPath();
        if (currentTool === 'eraser') {
          contextRef.current.globalCompositeOperation = 'destination-out';
          contextRef.current.strokeStyle = 'rgba(255,255,255,1)';
        } else {
          contextRef.current.globalCompositeOperation = 'source-over';
          contextRef.current.strokeStyle = 'black';
        }
        contextRef.current.lineWidth = lineWidth * 2;
        contextRef.current.lineJoin = 'round';
        contextRef.current.lineCap = 'round';
        contextRef.current.moveTo(
          (ongoingTouches.current[idx].clientX - rect.left) * scaleX,
          (ongoingTouches.current[idx].clientY - rect.top) * scaleY
        );
        contextRef.current.lineTo(
          (touches[i].clientX - rect.left) * scaleX,
          (touches[i].clientY - rect.top) * scaleY
        );
        contextRef.current.closePath();
        contextRef.current.stroke();
        ongoingTouches.current.splice(idx, 1, copyTouch(touches[i]));
      }
    }
  };
  
  

  const handleEnd = (evt) => {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        contextRef.current.lineWidth = lineWidth;
        contextRef.current.fillStyle = 'black';
        ongoingTouches.current.splice(idx, 1);
      }
    }
  };

  const handleCancel = (evt) => {
    evt.preventDefault();
    const touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      let idx = ongoingTouchIndexById(touches[i].identifier);
      ongoingTouches.current.splice(idx, 1);
    }
  };

  const copyTouch = ({ identifier, clientX, clientY }) => {
    return { identifier, clientX, clientY };
  };

  const ongoingTouchIndexById = (idToFind) => {
    for (let i = 0; i < ongoingTouches.current.length; i++) {
      const id = ongoingTouches.current[i].identifier;
      if (id === idToFind) {
        return i;
      }
    }
    return -1;
  };

  const drawLine = (x1, y1, x2, y2) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
  
    contextRef.current.beginPath();
    if (currentTool === 'eraser') {
      contextRef.current.globalCompositeOperation = 'destination-out';
      contextRef.current.strokeStyle = 'rgba(255,255,255,1)';
    } else {
      contextRef.current.globalCompositeOperation = 'source-over';
      contextRef.current.strokeStyle = 'black';
    }
    contextRef.current.lineWidth = lineWidth * 2;
    contextRef.current.lineJoin = 'round';
    contextRef.current.lineCap = 'round';
    contextRef.current.moveTo(x1 * scaleX, y1 * scaleY);
    contextRef.current.lineTo(x2 * scaleX, y2 * scaleY);
    contextRef.current.closePath();
    contextRef.current.stroke();
  };
  
  
  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setX(e.clientX - rect.left);
    setY(e.clientY - rect.top);
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    drawLine(x, y, e.clientX - rect.left, e.clientY - rect.top);
    setX(e.clientX - rect.left);
    setY(e.clientY - rect.top);
  };
  

  

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  

  const clearArea = () => {
    contextRef.current.setTransform(1, 0, 0, 1, 0, 0);
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleExport = () => {
    if (label.trim() === '') {
      setError('Please enter a result.');
      return;
    }
  
    const uri = canvasRef.current.toDataURL();
    handleUpload(uri, label);
    clearArea();
    setLabel('');
    setError('');
  };
  
  


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width:'218px', marginBottom: '7.5px' }}>
        <button 
          onClick={clearArea}
          style={{
            fontSize: '1rem',
            border: '0px',
            cursor: 'pointer',
            background: '#ff4444',
            color: 'rgb(255, 255, 255)',
            borderRadius: '4px',
            fontWeight: 'bold',
            padding: '0.55rem',
          }}
        >
          Clear
        </button>

        <select
          style={{
            fontSize: '1rem',
            border: '2px solid #ccc',
            borderRadius: '4px',
            fontWeight: 'bold'
          }}
          value={currentTool}
          onChange={(e) => setCurrentTool(e.target.value)}
        >
          <option value="brush">Brush</option>
          <option value="eraser">Eraser</option>
        </select>

        <div style={{display: 'flex', alignItems: 'center', height: '36px'}}>
          <input
            style={{ width: '70px', margin: '0' }}
            type="range"
            id="lineWidth"
            min="21"
            max="40"
            value={lineWidth}
            onChange={e => setLineWidth(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <div style={{width: '218px'}}>
        <div style={{ width: '214px', height: '214px', border: '2px solid #ccc', borderRadius: '4px', overflow: 'hidden'}}>
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMoveCapture={draw}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '218px', marginTop: '7.5px' }}>

        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Result"
          style={{
            flexGrow: 1,
            fontSize: '1rem',
            padding: '0.5rem',
            border: '2px solid #ccc',
            borderRadius: '4px',
            marginRight: '7.5px',
            width: '10px'
          }}
        />
        <button 
          onClick={handleExport}
          style={{
            fontSize: '1rem',
            border: '0px',
            cursor: 'pointer',
            background: 'rgb(76,175,80)',
            color: 'rgb(255, 255, 255)',
            borderRadius: '4px',
            fontWeight: 'bold',
            padding: '0.55rem',
          }}
        >
          Add
        </button>
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
  );

}

export default Canvas;
