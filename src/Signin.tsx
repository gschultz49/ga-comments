import firebase from "firebase";
import React from "react";
import GoogleButton from "react-google-button";
import { auth } from "./App";

export default function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      {/* <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button> */}
      <GoogleButton
        type="dark" // can be light or dark
        onClick={signInWithGoogle}
      />
    </>
  );
}
