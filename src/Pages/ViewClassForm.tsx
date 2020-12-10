import clsx from "clsx";
import firebase from "firebase";
import { Form, Formik } from "formik";
import React from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { firestore } from "../App";
import StudentForm from "../Components/Students/StudentForm";
import {
  CLASSES_COLLECTION,
  modifyAndCreateTimestamp,
  redirectTo,
  removeClass,
  removeStudentFromClass,
  STUDENT_COLLECTION,
} from "../utils";
import { Student, studentsValidation } from "./CreateClassForm";

interface TeachingClass {
  name: string;
  teacherId: string;
  createdAt: Date;
  modifiedAt: Date;
  id?: string;
}

const addStudentToExistingClass = async ({
  students,
  classID,
}: {
  students: Student[];
  classID: string | undefined;
}) => {
  try {
    const batch = firestore.batch();
    students.forEach((student) => {
      var docRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
      batch.set(docRef, {
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        classID: classID,
        isActive: true,
        // Using the reference data type is apparently more inconvenient than strings rn...
        //   https://stackoverflow.com/questions/46568850/what-is-firebase-firestore-reference-data-type-good-for
        //   classID: firestore.doc(`${CLASSES_COLLECTION}/${classIDRef.id}`),
        ...modifyAndCreateTimestamp(),
      });
    });
    await batch.commit();
  } catch (err) {
    console.error("Error inserting students", err);
  }
};

const ViewClassFormProvider = () => {
  let { classID }: { classID: string } = useParams();

  const [students, loading, error] = useCollectionData<Student>(
    firebase
      .firestore()
      .collection(STUDENT_COLLECTION)
      .where("classID", "==", classID)
      .where("isActive", "==", true),
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
    <ViewClassForm
      classID={classID}
      className={targetClass?.name}
      error={error}
      loading={loading}
      students={students}
    />
  );
};

const StudentsSchema = Yup.object().shape(studentsValidation);

export const ViewClassForm = ({
  className,
  error = undefined,
  loading = false,
  students,
  classID,
}: {
  className: string | undefined;
  error: object | undefined;
  loading: boolean;
  students: Student[] | undefined;
  classID: string | undefined;
}) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <h1>{className}</h1>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <table
        className="table-fixed w-full text-left"
        style={{ borderCollapse: "separate", borderSpacing: "0 1em;" }}
      >
        <thead>
          <tr>
            <th className="w-1/5">First Name</th>
            <th className="w-1/5">Last Name</th>
            <th className="w-1/5">Gender</th>
            <th className="w-1/5">Report</th>
            <th className="w-1/5"></th>
          </tr>
        </thead>
        <tbody>
          {students?.map(({ firstName, lastName, gender, id }: Student) => {
            const reportIsDone = false;
            return (
              <tr
                className={clsx(reportIsDone ? "bg-green-200" : "bg-red-200")}
                key={id}
              >
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{gender}</td>
                <td
                  className={clsx("cursor-pointer")}
                  onClick={(e) => {
                    redirectTo(history, `/student/${id}`);
                  }}
                >
                  Report Link
                </td>
                <td
                  className={clsx("cursor-pointer")}
                  onClick={(e) => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this student from this class?"
                      )
                    ) {
                      removeStudentFromClass(id);
                    }
                  }}
                >
                  remove button
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className={clsx("cursor-pointer")}
        onClick={(e) => {
          if (
            window.confirm(
              "Are you sure you want to delete this class? This cannot be undone"
            )
          ) {
            removeClass(classID);
            redirectTo(history, "/");
          }
        }}
      >
        <h1>DELETE CLASS</h1>
      </div>

      <Formik
        initialValues={{ students: [] }}
        onSubmit={async (values, { resetForm }) => {
          console.log("submitted", values);
          await addStudentToExistingClass({
            students: values.students,
            classID: classID,
          });
          resetForm();
        }}
        validationSchema={StudentsSchema}
      >
        {({ values }) => (
          <Form>
            <StudentForm students={values.students} />
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default ViewClassFormProvider;
