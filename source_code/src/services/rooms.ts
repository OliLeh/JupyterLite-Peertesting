
interface Room {
  task: {
    description: string;
    hasnotebook: boolean;
  };
  room_name: string;
  pin_code: string;
  instructor_id: string;
  reference_solution: string | null;
  participants: Array<{
    username: string;
    id: string;
  }>;
  test_cases: string[];
  pending_test_cases: string[];
  id: string;
}

const roomsData: Room[] = [
  {
  "task": {
  "description": "Implement a basic CNN for digit recognition using TensorFlow.",
  "hasnotebook": true
  },
  "room_name": "CNN Basics",
  "pin_code": "332515",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "6676db9647d5b1f147afa722",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "6676d9fda5083537967b06da"
  },
  {
  "task": {
  "description": "Explore data augmentation techniques for improving digit recognition accuracy.",
  "hasnotebook": true
  },
  "room_name": "Data Augmentation",
  "pin_code": "147855",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "6676df22d5b694a130f2a003",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "6676df1cd5b694a130f29ff9"
  },
  {
  "task": {
  "description": "Implement a digit recognition model using transfer learning.",
  "hasnotebook": true
  },
  "room_name": "Transfer Learning",
  "pin_code": "377025",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "6676e2bdf47485ac6b282408",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "6676e2b6f47485ac6b2823fe"
  },
  {
  "task": {
  "description": "Optimize hyperparameters for a digit recognition model.",
  "hasnotebook": true
  },
  "room_name": "Hyperparameter Tuning",
  "pin_code": "447734",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "6676e6d4c50257b47e485440",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "6676e69ca265987ac5794a10"
  },
  {
  "task": {
  "description": "Implement ensemble methods for improving digit recognition accuracy.",
  "hasnotebook": true
  },
  "room_name": "Ensemble Methods",
  "pin_code": "724404",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "6676f065c50257b47e48546d",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "6676f063c50257b47e485463"
  },
  {
  "task": {
  "description": "Develop a real-time digit recognition system using a webcam.",
  "hasnotebook": true
  },
  "room_name": "Real-time Recognition",
  "pin_code": "985231",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "667c0ffbfd3b3d01a3f4635a",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"}],
  "test_cases": [],
  "pending_test_cases": [],
  "id": "667c0fe5fd3b3d01a3f4632f"
  },
  {
  "task": {
  "description": "Implement a digit recognition model using unsupervised learning techniques.",
  "hasnotebook": true
  },
  "room_name": "Unsupervised Learning",
  "pin_code": "574607",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "667c1a885e2a3a10c6e4d244",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"},{"username":"livia","id":"6676a92203338c3cc3b2bb0c"}],
  "test_cases": ["667c1ac25e2a3a10c6e4d275","667c23375e2a3a10c6e4d315"],
  "pending_test_cases": [],
  "id": "667c1a805e2a3a10c6e4d23a"
  },
  {
  "task": {
  "description": "Develop a digit recognition model that can handle noisy input images.",
  "hasnotebook": true
  },
  "room_name": "Noise Resilient Recognition",
  "pin_code": "330520",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "667d8ead27f510f0143312e5",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"},{"username":"livia","id":"6676a92203338c3cc3b2bb0c"}],
  "test_cases": ["667d8eda27f510f014331309","667d8f1627f510f01433130e"],
  "pending_test_cases": [],
  "id": "667d88dc27f510f0143312db"
  },
  {
  "task": {
  "description": "Implement a digit recognition model using only linear algebra operations.",
  "hasnotebook": true
  },
  "room_name": "Linear Algebra Approach",
  "pin_code": "513389",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "667e7eaf780e61d95f0d0bfc",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"},{"username":"livia","id":"6676a92203338c3cc3b2bb0c"}],
  "test_cases": ["667e7ed6780e61d95f0d0c1e"],
  "pending_test_cases": [],
  "id": "667e7e66780e61d95f0d0bf2"
  },
  {
  "task": {
  "description": "Create a digit recognition model that can handle multiple styles of handwriting.",
  "hasnotebook": true
  },
  "room_name": "Multi-style Recognition",
  "pin_code": "383748",
  "instructor_id": "6638d0ac31e42130ed927cd8",
  "reference_solution": "667e8f4af3ef08aeef2e427f",
  "participants": [{"username":"liv","id":"6638d0ac31e42130ed927cd8"},{"username":"oliver","id":"667e70b3e085dc3ef28782e5"}],
  "test_cases": ["667e8f6cf3ef08aeef2e42a1","667e8fc2f3ef08aeef2e42c1"],
  "pending_test_cases": [],
  "id": "667e8e28f3ef08aeef2e4275"
  }
  ]

let token:any = null
console.log(token)

const setToken = (newToken:any) => {
  token = `Bearer ${newToken}`
}

const getAll = async (): Promise<Room[]> => {
  return roomsData;
};


const getRoom = async (pin_code:any): Promise<Room> => {

  let r = roomsData.find(room => room.pin_code === pin_code) as Room;
  if (r) {
    return r;
  }
  else return roomsData[0];

}

const create =  async (newObject:any) => {
  return roomsData[0];
}

const join = async (pin_code:any) => {
  return roomsData.find(room => room.pin_code === pin_code) as Room;
}

const myrooms = async (): Promise<Room[]> => {
  return roomsData;
}

const getNotebook = async (pin_code:any) => {
  // Return a mock Response object to simulate an API response
  return ({
    data: new Blob(['Dummy notebook content'], { type: 'text/plain' }),
    status: 200,
    statusText: 'OK'
  });
};

const deleteRoom = async (pin_code:any) => {
  return roomsData[0];
}

const update = async (pin_code:any, updatedObject:any) => {
  return roomsData[0];
}

export default { 
  getAll, create, join, myrooms, setToken, getRoom, getNotebook, deleteRoom, update
}