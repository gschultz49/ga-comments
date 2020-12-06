import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App";
import ClassList from "../Components/ClassList";

export default function HomePage() {
  const [user] = useAuthState(auth);
  return (
    <div>
      <h2>Welcome {user?.displayName}!</h2>
      <ClassList teacherId={user?.uid} />
    </div>
  );
}
