import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import logo from "./logo.svg";
import "./App.css";
import CreateClassForm from "./Pages/CreateClassForm";
import HomePage from "./Pages/Home";
import ViewClassForm from "./Pages/ViewClassForm";
import ViewStudent from "./Pages/ViewStudent";
import SignIn from "./Signin";
import SignOut from "./Signout";

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

const useEmulatorMode = process.env.NODE_ENV !== "production";
if (useEmulatorMode) {
  console.log("CONNECTING TO EMULATOR IN EMULATOR MODE");
  firestore.useEmulator("localhost", 8080);
}

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App mx-8">
      {user ? (
        <div className={"flex justify-between items-center"}>
          <div className={"flex  items-center"}>
            <img
              src={user?.photoURL ?? ""}
              alt={"Profile Pic"}
              className={"rounded-full h-8 w-8"}
            />
            <h2 className={"ml-2"}>
              Welcome {user?.displayName}!{" "}
              {useEmulatorMode === true ? "DEV" : "PROD"}
            </h2>
          </div>

          <SignOut />
        </div>
      ) : null}

      {user ? (
        <section>
          <Main />
        </section>
      ) : (
        <section className={"flex h-screen justify-center items-center"}>
          <SignIn />
        </section>
      )}
    </div>
  );
}

const Main = () => {
  return (
    <>
      <Home />
    </>
  );
};

function Home() {
  return (
    <Router>
      <div>
        <ul>
          {/* <li>
            <Link to="/class/123">Class View 123</Link>
          </li> */}
        </ul>

        <hr />

        {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
        <Switch>
          <Route path={`/class/createClass`}>
            <CreateClassForm />
          </Route>
          <Route path={`/class/:classID`}>
            <ViewClassForm />
          </Route>
          <Route path={`/student/:studentID`}>
            <ViewStudent />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// You can think of these components as "pages"
// in your app.

// function AddClassPage() {
//   // We can use the `useParams` hook here to access
//   // the dynamic pieces of the URL.
//   let { id } = useParams<{ id: string }>();

//   return (
//     <div>
//       <h2>Class Number, {id}</h2>
//     </div>
//   );
// }

// function Student() {
//   return (
//     <div>
//       <h2>student</h2>
//     </div>
//   );
// }

export default App;
