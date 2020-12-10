import firebase from "firebase";
import React from "react";
import {
  useCollection,
  useCollectionData,
  useCollectionDataOnce,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { Link, useParams } from "react-router-dom";
import { CardWrapper, ClassCard } from "../Components/ClassList";
import { CLASSES_COLLECTION, STUDENT_COLLECTION } from "../utils";
import { Student } from "./CreateClass";

interface TeachingClass {
  name: string;
  teacherId: string;
  createdAt: Date;
  modifiedAt: Date;
  id?: string;
}

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
      <div className="grid grid-cols-3 gap-4">
        {students?.map(({ firstName, lastName, gender, id }) => {
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
        })}
        {/* <pre>{JSON.stringify(students, undefined, 2)}</pre> */}
      </div>
    </React.Fragment>
  );
};

const ViewListProvider = () => {
  let { classID }: any = useParams();

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

export default ViewListProvider;
