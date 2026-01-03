export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

export interface Contact extends User {
  _id: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface ContactsResponse {
  message: string;
  contacts: Contact[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  phoneNumber?: string;
}
