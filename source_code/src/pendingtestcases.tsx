import React, { useState, useEffect } from 'react';
import TestcaseService from './services/testcases';
import WrapperComponent from './WrapperComponent';
import AutosizeInput from './autosizeinput';

interface RoomProps {
  setActiveComponent: (message: string) => void;
  token: { token: string, username: string, id: string } | null;
  pin_code: string;
  setToken: (token: { token: string, username: string, id: string } | null) => void;
}

interface PendingTestcase {
  id: string;
  room_id: string;
  user_id: string;
  input: string[];
  expected_output: string[];
  reference_output: string[];
  description: string;

}

export const PendingTestcases: React.FC<RoomProps> = ({ setActiveComponent, token, pin_code, setToken }) => {
  const [pendingTestcases, setPendingTestcases] = useState<PendingTestcase[]>([]);
  const [expandedPendingTestcase, setExpandedPendingTestcase] = useState<string | null>(null);

  const initialTestcases = async () => {
    try {
      const p = await TestcaseService.getAllPending(pin_code)
      setPendingTestcases(p);
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

  const ptoggleVisibility = (testcaseId: string) => {
    setExpandedPendingTestcase(expandedPendingTestcase === testcaseId ? null : testcaseId);
  }

  const handleEditExpectedOutput = (testcaseId: string, index: number, newValue: string) => {
    setPendingTestcases(prevTestcases => 
      prevTestcases.map(testcase => 
        testcase.id === testcaseId 
          ? {...testcase, expected_output: testcase.expected_output.map((output, i) => i === index ? newValue : output)}
          : testcase
      )
    );
  }
  

  const handleDeletePair = (testcaseId: string, index: number) => {
    setPendingTestcases(prevTestcases => 
      prevTestcases.map(testcase => 
        testcase.id === testcaseId 
          ? {
              ...testcase, 
              input: testcase.input.filter((_, i) => i !== index),
              expected_output: testcase.expected_output.filter((_, i) => i !== index),
              reference_output: testcase.reference_output.filter((_, i) => i !== index)
            }
          : testcase
      )
    );
  }

  const handleApprove = async (testcaseId: string) => {
    try {
      const testcaseToApprove = pendingTestcases.find(tc => tc.id === testcaseId);
      if (testcaseToApprove) {
        await TestcaseService.approvePending(pin_code, testcaseId, testcaseToApprove);
        setPendingTestcases(prevTestcases => prevTestcases.filter(tc => tc.id !== testcaseId));
      }
    } catch (error) {
      console.error("Error approving testcase:", error);
      alert("Failed to approve testcase");
    }
  }


  

  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <div className="title">
      <h1>Testcases &#40;pending&#41;</h1>
      </div>

      <div className="mytestcases-scrollbox1">
        {pendingTestcases.map((ptestcase, index) => (
          <div key={index} className="testcase-container">
            <div className="testcase-header" onClick={() => ptoggleVisibility(ptestcase.id)}>
              <button className="toggle-button">
                {expandedPendingTestcase === ptestcase.id ? '−' : '+'}
              </button>
              <h2 className="testcase-description">{ptestcase.description}</h2>
              <button className="approve-button" 
                onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(ptestcase.id);
                }}
              >
                ✓
              </button>
            </div>
            {expandedPendingTestcase === ptestcase.id && (
              <div className="testcase-details">
                <div className="tile-grid">
                  {ptestcase.input.map((input, iIndex) => (
                    <div key={iIndex} className={`tile ${ptestcase.expected_output[iIndex] === ptestcase.reference_output[iIndex] ? 'match' : 'mismatch'}`}>
                    <div className="image-container">
                      <img src={input} alt="" className="tile-img" />
                      <button className="delete-button" onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePair(ptestcase.id, iIndex);
                      }}>✕</button>
                    </div>
                    <div>
                      <p className="tile-label">Expected: 
                        <AutosizeInput 
                          value={ptestcase.expected_output[iIndex]} 
                          onChange={(e) => handleEditExpectedOutput(ptestcase.id, iIndex, e.target.value)}
                        />
                      </p>
                      <p className="tile-label">Reference: {ptestcase.reference_output[iIndex]}</p>
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

