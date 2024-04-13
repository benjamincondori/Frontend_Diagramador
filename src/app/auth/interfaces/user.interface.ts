import { Profile } from "./register-response.interface";


export interface User {
  id:       string;
  email:    string;
  name:     string;
  lastName: string;
  isActive: boolean;
  roles:    string[];
}

export interface UserCurrent {
  id:       string;
  email:    string;
  name:     string;
  lastName: string;
  isActive: boolean;
  roles:    string[];
  profile: Profile;
}

export interface UserRegister {
  email: string;
  name: string;
  lastName: string;
  password: string;
}

