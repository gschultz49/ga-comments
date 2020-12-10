import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Student } from "../../Pages/CreateClassForm";
import { STUDENT_COLLECTION } from "../../utils";
import Grid from "../Utils/Grid";
import StudentCard from "./StudentCard";

// todo: could find a way to add this to the homepage and inner join on class + students
const StudentListProvider = () => {
  const [students, loading, error] = useCollectionData<Student>(
    firebase.firestore().collection(STUDENT_COLLECTION),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <React.Fragment>
      <h1>Students</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <StudentCardGrid students={students} />
    </React.Fragment>
  );
};

export const StudentCardGrid = ({
  students,
}: {
  students: Student[] | undefined;
}) => {
  return (
    <Grid>
      {students?.map(({ firstName, lastName, gender, id }: Student) => (
        <StudentCard
          firstName={firstName}
          lastName={lastName}
          gender={gender}
          id={id}
        />
      ))}
    </Grid>
  );
};

export default StudentListProvider;
