

export interface RegisterResponse {
  id:       string;
  email:    string;
  name:     string;
  lastName: string;
  profile:  Profile;
  isActive: boolean;
  roles:    string[];
  token:    string;
}

export interface Profile {
  id:            number;
  gender:        string;
  photo:         string;
  photoPublicId: string;
}


