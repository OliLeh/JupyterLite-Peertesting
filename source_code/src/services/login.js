
import { config } from '../config';

const login = async credentials => {
  // Simulate a delay to mimic network request
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return a hardcoded user object
  return {
    token: 'fake-jwt-token',
    username: 'demouser',
    id: "6638d0ac31e42130ed927cd8"
  };
};


export default { login }



