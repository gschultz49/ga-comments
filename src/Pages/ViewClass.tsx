import firebase from "firebase";
import React from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useParams } from "react-router-dom";
import { StudentsGrid } from "../Components/StudentList";
import { CLASSES_COLLECTION, STUDENT_COLLECTION } from "../utils";
import { Student } from "./CreateClass";

interface TeachingClass {
  name: string;
  teacherId: string;
  createdAt: Date;
  modifiedAt: Date;
  id?: string;
}

const ViewClassProvider = () => {
  let { classID }: { classID: string } = useParams();

  const [students, loading, error] = useCollectionData<Student>(
    firebase
      .firestore()
      .collection(STUDENT_COLLECTION)
      .where("classID", "==", classID),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [targetClass] = useDocumentData<TeachingClass>(
    firebase.firestore().doc(`${CLASSES_COLLECTION}/${classID}`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <ViewClassDisplay
      className={targetClass?.name}
      error={error}
      loading={loading}
      students={students}
    />
  );
};

export const ViewClassDisplay = ({
  className,
  error = undefined,
  loading = false,
  students,
}: {
  className: string | undefined;
  error: object | undefined;
  loading: boolean;
  students: Student[] | undefined;
}) => {
  return (
    <React.Fragment>
      <h1>{className}</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <StudentsGrid students={students} />
    </React.Fragment>
  );
};

export default ViewClassProvider;
