import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App";
import ClassList from "../Components/Classes/ClassGrid";

export default function HomePage() {
  const [user] = useAuthState(auth);
  return (
    <div className={"my-5"}>
      <h1 className={"text-3xl py-5 text-center sm:text-left"}>Your Classes</h1>
      <ClassList teacherId={user?.uid} />
      {/* <h1>Students</h1>
      <StudentList /> */}
    </div>
  );
}
