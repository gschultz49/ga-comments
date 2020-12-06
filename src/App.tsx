import React from "react";
// import logo from "./logo.svg";
import "./App.css";
// import Test from "./comp";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/analytics";

import { useAuthState } from "react-firebase-hooks/auth";
// import { useCollectionData } from "react-firebase-hooks/firestore";
import SignIn from "./Signin";
import SignOut from "./Signout";
import ClassPage from "./Components/ClassPage";

firebase.initializeApp({
  apiKey: "AIzaSyCwxiDrVBzpiEtz5rL9eJt6bZIdymyTQ30",
  authDomain: "ga-comments.firebaseapp.com",
  projectId: "ga-comments",
  storageBucket: "ga-comments.appspot.com",
  messagingSenderId: "671616870740",
  appId: "1:671616870740:web:74456365bd146415e180c1",
  measurementId: "G-MMQSJ4ES92",
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <SignOut />
      <section>
        {user ? (
          <Main />
        ) : (
          // <header className="App-header">
          //   <img src={logo} className="App-logo" alt="logo" />
          //   <p>
          //     Edit <code>src/App.tsx</code> and save to reload.
          //   </p>
          //   <Test />
          //   <a
          //     className="App-link"
          //     href="https://reactjs.org"
          //     target="_blank"
          //     rel="noopener noreferrer"
          //   >
          //     Learn React
          //   </a>
          // </header>
          <SignIn />
        )}
      </section>
    </div>
  );
}

const Main = () => {
  return <ClassPage />;
};
export default App;
