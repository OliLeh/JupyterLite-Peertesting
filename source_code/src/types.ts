export interface Room {
    id: string;
    room_name: string;
    pin_code: string;
    task: {description: string, hasnotebook: boolean};
    instructor_id: any;
}

export interface PendingTestcase {
    id: string;
    room_id: string;
    user_id: string;
    input: string[];
    expected_output: string[];
    reference_output: string[];
    description: string;
}

export interface Testcase {
    id: string;
    room_id: string;
    user_id: string;
    room_name: string;
    input: string[];
    expected_output: string[];
    description: string;
}

export interface SubmissionResult {
    test_case_id: Testcase;
    actual_output: string[];
    passed: number;
}
  
export interface Submission {
    _id: string;
    room_id: string;
    user_id: string;
    timestamp: Date;
    results: SubmissionResult[];
}