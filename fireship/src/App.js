import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatRoom } from "./Chatroom";

firebase.initializeApp({
  apiKey: "AIzaSyCwxiDrVBzpiEtz5rL9eJt6bZIdymyTQ30",
  authDomain: "ga-comments.firebaseapp.com",
  projectId: "ga-comments",
  storageBucket: "ga-comments.appspot.com",
  messagingSenderId: "671616870740",
  appId: "1:671616870740:web:74456365bd146415e180c1",
  measurementId: "G-MMQSJ4ES92",
});

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      {/* <p>
        Do not violate the community guidelines or you will be banned for life!
      </p> */}
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

export default App;
