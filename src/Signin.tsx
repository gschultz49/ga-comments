import firebase from "firebase";
import { auth } from "./App";

export default function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    console.log("pre",auth);
    auth.signInWithPopup(provider);
    console.log("post", auth);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}
