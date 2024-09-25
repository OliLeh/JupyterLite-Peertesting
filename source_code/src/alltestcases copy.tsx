import React, { useState, useEffect } from 'react';
import TestcaseService from './services/testcases';
import WrapperComponent from './WrapperComponent';

interface RoomProps {
  setActiveComponent: (message: string) => void;
  token: { token: string, username: string, id: string } | null;
  pin_code: string;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

interface Testcase {
  id: string;
  room_id: string;
  user_id: string;
  room_name: string;
  input: string[];
  expected_output: string[];
  description: string;
}

export const AllTestcases: React.FC<RoomProps> = ({ setActiveComponent, token, pin_code, setToken }) => {
  const [testcases, setTestcases] = useState<Testcase[]>([]);
  const [expandedTestcase, setExpandedTestcase] = useState<string | null>(null);

  const initialTestcases = async () => {
    try {
      const t = await TestcaseService.getAll(pin_code)
      setTestcases(t);
    } catch (exception) {
      alert(exception);
    }
  }

  useEffect(() => {
    if (!token) {
      setActiveComponent('login');
    }
    else if (token.token) {
      initialTestcases();
    }
  }, [pin_code])

  const toggleVisibility = (testcaseId: string) => {
    setExpandedTestcase(expandedTestcase === testcaseId ? null : testcaseId);
  }

  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <div className="title">
        <h1>All Testcases</h1>
      </div>

      <div className="room-scrollbox">
        {testcases.map((testcase, index) => (
          <div key={index} className="testcase-container">
            <div className="testcase-header" onClick={() => toggleVisibility(testcase.id)}>
              <button className="toggle-button">
                {expandedTestcase === testcase.id ? '−' : '+'}
              </button>
              <h2 className="testcase-description">{testcase.description}</h2>
            </div>
            {expandedTestcase === testcase.id && (
              <div className="testcase-details">
                <div className="tile-grid">
                  {testcase.input.map((input, iIndex) => (
                    <div key={iIndex} className="tile">
                      <img src={input} alt="" className="tile-img" />
                      <div>
                        <p className="tile-label">Expected: {testcase.expected_output[iIndex] || 'N/A'}</p>
                        <p className="tile-label">Actual: -</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </WrapperComponent>
  );
}
