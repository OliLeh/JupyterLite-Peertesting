import React, { useState, useEffect } from 'react';
import SubissionService from './services/submissions';
import WrapperComponent from './WrapperComponent';
import TestcaseService from './services/testcases';

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

interface SubmissionResult {
  test_case_id: Testcase;
  actual_output: string[];
  passed: number;
}

interface Submission {
  _id: string;
  room_id: string;
  user_id: string;
  timestamp: Date;
  results: SubmissionResult[];
}

export const AllTestcases: React.FC<RoomProps> = ({ setActiveComponent, token, pin_code, setToken }) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [expandedTestcase, setExpandedTestcase] = useState<string | null>(null);
  const [allTestcases, setAllTestcases] = useState<Testcase[]>([]);
  const [groupedTestcases, setGroupedTestcases] = useState<Testcase[]>([]);
  const [groupedSubmission, setGroupedSubmission] = useState<Submission | null>(null);
  const [displayMode, setDisplayMode] = useState<'normal' | 'grouped'>('normal');

  const hasUnrunTestcases = () => {
    return allTestcases.some(testcase => 
      !submission?.results.some(result => result.test_case_id.id === testcase.id)
    );
  };

  const groupTestcasesByOutput = (t:Testcase[], s:Submission) => {
    const groupedTestcases: { [key: string]: Testcase } = {};
    const groupedSubmission: { [key: string]: SubmissionResult } = {};
    t.forEach(testcase => {
      let sub = s?.results.find(r => r.test_case_id.id === testcase.id);
      testcase.expected_output.forEach((output, i) => {
      if (!groupedTestcases[output]) {
        groupedTestcases[output] = {id: output, room_id: testcase.room_id, user_id: testcase.user_id, room_name: testcase.room_name, input: [], expected_output: [], description: output};
        groupedSubmission[output] = {test_case_id: groupedTestcases[output], actual_output: [], passed: 0};
      }
      groupedTestcases[output].input.push(testcase.input[i]);
      groupedTestcases[output].expected_output.push(output);
      groupedSubmission[output].actual_output.push(sub?.actual_output[i] || '');
      if (sub?.actual_output[i] === output) {
        groupedSubmission[output].passed++;
      }
    });});
    setGroupedTestcases(Object.values(groupedTestcases));
    setGroupedSubmission({ _id: 'grouped', room_id: pin_code, user_id: token?.id || '', timestamp: new Date(), results: Object.values(groupedSubmission)});
  };

  const initialTestcases = async () => {
    try {
      const s = await SubissionService.getMySubmission(pin_code)
      setSubmission(s);
      const t = await TestcaseService.getAll(pin_code)
      setAllTestcases(t);
      groupTestcasesByOutput(t,s);
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

  const TestCaseItem: React.FC<{testcase: Testcase, result?: SubmissionResult}> = ({ testcase, result }) => {
    return (
      <div className="testcase-container">
        <div className="testcase-header" onClick={() => toggleVisibility(testcase.id)}>
          <button className="toggle-button">
            {expandedTestcase === testcase.id ? '−' : '+'}
          </button>
          <h2 className="testcase-description" style={{margin: "0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"}}>{testcase.description}</h2>
          {result ? <p className="testcase-passed">{`(${result.passed}/${result.actual_output.length})`}</p> : <p className="testcase-passed">{`(?/${testcase.expected_output.length })`}</p>}
        </div>
        {expandedTestcase === testcase.id && (
          <div className="testcase-details">
            <div className="tile-grid">
              {testcase.input.map((input, iIndex) => (
                <div key={iIndex} className={(result && result.actual_output[iIndex]) ? (testcase.expected_output[iIndex] === result.actual_output[iIndex] ? 'tile match' : 'tile mismatch') : 'tile'}>
                  <img src={input} alt="" className="tile-img" />
                  <div>
                    <p className="tile-label">Expected: {testcase.expected_output[iIndex] || 'N/A'}</p>
                    <p className="tile-label">Predicted: {result ? (result.actual_output[iIndex] || '-') : '-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const update = async () => {
    await SubissionService.updateSubmission(pin_code);
    const s = await SubissionService.getMySubmission(pin_code)
    setSubmission(s);
    groupTestcasesByOutput(allTestcases, s);
  }

  return (
    <WrapperComponent setActiveComponent={setActiveComponent} setToken={setToken} token={token} pin_code={pin_code}>
      <div className="title">
        <h1>All Testcases</h1>
      </div>
        <button className="new-room-button" onClick={() => setDisplayMode(displayMode === 'normal' ? 'grouped' : 'normal')}>
          {displayMode === 'normal' ? 'Group by Output' : 'Normal View'}
        </button>
      
      <div className="room-scrollbox">
        {displayMode === 'normal'
    ? allTestcases.map((testcase) => {
        const result = submission?.results.find(r => r.test_case_id.id === testcase.id);
        return <TestCaseItem key={testcase.id} testcase={testcase} result={result} />;
      })
    : groupedTestcases.map((testcase) => {
        const result = groupedSubmission?.results.find(r => r.test_case_id.id === testcase.id);
        return <TestCaseItem key={testcase.id} testcase={testcase} result={result} />;
      })
  }
      </div>
      <div style={{display: 'flex', flexDirection: 'column'}} title={hasUnrunTestcases() ? "" : "All testcases have been run"}>
        <button className="login-button" disabled={!hasUnrunTestcases()} onClick={update}>Rerun submission</button>
      </div>
    </WrapperComponent>
  );
}
