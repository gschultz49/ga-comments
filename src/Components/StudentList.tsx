import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { Student } from "../Pages/CreateClass";
import { STUDENT_COLLECTION } from "../utils";
import CardWrapper from "./CardWrapper";
import Grid from "./Grid";

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
      <StudentsGrid students={students} />
    </React.Fragment>
  );
};

export const StudentsGrid = ({
  students,
}: {
  students: Student[] | undefined;
}) => {
  return (
    <Grid>
      {students?.map(({ firstName, lastName, gender, id }: Student) => (
        <StudentDisplay
          firstName={firstName}
          lastName={lastName}
          gender={gender}
          id={id}
        />
      ))}
    </Grid>
  );
};

export const StudentDisplay = ({
  firstName,
  lastName,
  gender,
  id,
}: Student) => {
  return (
    <Link to={`/student/${id}`}>
      <CardWrapper>
        <h1>
          {firstName} {lastName}
        </h1>
        <p>{gender}</p>
      </CardWrapper>
    </Link>
  );
};

export default StudentListProvider;
