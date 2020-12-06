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
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import HomePage from "./Pages/Home";

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
          <li>
            <Link to="/">HomePage</Link>
          </li>
          {/* <li>
            <Link to="/class/123">Class View 123</Link>
          </li>
          <li>
            <Link to="/student">Student</Link>
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
          <Route exact path="/">
            <HomePage />
          </Route>

          {/* <Route path="/class/:id">
            <AddClassPage />
          </Route> */}

          {/* <Route path="/student">
            <Student />
          </Route> */}
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
