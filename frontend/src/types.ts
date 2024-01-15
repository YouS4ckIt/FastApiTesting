export type userData = {
  created_at: string;
  email: string;
  id: number;
  permissions: string[];
  username: string;
  password: string;
  role: string;
  updated_at: string;
  token: string;
};
export type userLocalStorage = {
  access_token: string;
  token_type: string;
  userData: userData;
};
export type postData = {
  id: number;
  content: string;
  created_at: string;
  title: string;
  updated_at: string;
  user: UserType;
  category?: CategoryType;
};
export type CategoryType = {
  id: number;
  name: string;
};
export type UserType = {
  created_at: string;
  email: string;
  id: number;
  permissions: string[];
  updated_at: string;
  username: string;
};

export type ProfileDataType = {
  id: number;
  username: string;
  email: string;
  role: string;
};
