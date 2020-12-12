import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App";
import ClassList from "../Components/Classes/ClassGrid";

export default function HomePage() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <h2>Welcome {user?.displayName}!</h2>
      <h1>Classes</h1>
      <ClassList teacherId={user?.uid} />
      {/* <h1>Students</h1>
      <StudentList /> */}
    </div>
  );
}
