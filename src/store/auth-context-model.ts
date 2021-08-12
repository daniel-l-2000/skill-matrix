export interface AuthContextModel {
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}
