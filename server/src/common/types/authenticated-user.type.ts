export type AuthenticatedUser = {
  id: string;
  email: string;
  role?: string;
  uid?: string;
};

export type FirebaseUser = Request & {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};
