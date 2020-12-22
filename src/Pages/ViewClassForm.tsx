import clsx from "clsx";
import firebase from "firebase";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { firestore } from "../App";
import StudentForm from "../Components/Students/StudentForm";
import RemoveButtonIcon from "../Components/Utils/RemoveButtonIcon";
import {
  CLASSES_COLLECTION,
  redirectTo,
  removeClass,
  removeStudentFromClass,
  REPORT_TYPES_COLLECTION,
  STUDENT_COLLECTION,
} from "../utils";
import {
  createStudentObject,
  Student,
  studentsValidation,
} from "./CreateClassForm";

// eslint-disable-next-line
interface TeachingClass {
  name: string;
  teacherId: string;
  createdAt: Date;
  modifiedAt: Date;
  reportTypes: string[];
  classStartDate: number;
  classEndDate: number;
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
      var studentRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
      batch.set(studentRef, createStudentObject(student, classID));
    });
    await batch.commit();
  } catch (err) {
    console.error("Error inserting students", err);
  }
};

interface ReportType {
  name: string;
  id?: string;
}

const ViewClassFormProvider = () => {
  let { classID }: { classID: string } = useParams();

  const [targetClass, setTargetClass] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  const [reportTypes, setReportTypes] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);

  useEffect(() => {
    async function getter() {
      const classAndReports = await firebase
        .firestore()
        .doc(`${CLASSES_COLLECTION}/${classID}`)
        .get()
        .then(async (targetClassDocumentSnapshot) => {
          const targetClassData = targetClassDocumentSnapshot.get(
            "reportTypes"
          );
          const reportTypesQuerySnapshot = await firebase
            .firestore()
            .collection(REPORT_TYPES_COLLECTION)
            .where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              targetClassData
            )
            .get();
          return { targetClassDocumentSnapshot, reportTypesQuerySnapshot };
        });

      setTargetClass(classAndReports.targetClassDocumentSnapshot.data());
      setReportTypes(
        classAndReports.reportTypesQuerySnapshot.docs.map((e) => e.data())
      );
    }
    getter();
  }, [classID]);

  // eslint-disable-next-line
  const [students, loading, error] = useCollectionData<Student>(
    firebase
      .firestore()
      .collection(STUDENT_COLLECTION)
      .where("classID", "array-contains", classID)
      .where("isActive", "==", true),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <ViewClassForm
      classID={classID}
      className={targetClass?.name}
      students={students}
      reportTypes={reportTypes}
    />
  );
};

const StudentsSchema = Yup.object().shape(studentsValidation);

export const ViewClassForm = ({
  className,
  students,
  reportTypes,
  classID,
}: {
  className: string | undefined;
  students: firebase.firestore.DocumentData | undefined;
  reportTypes: firebase.firestore.DocumentData | undefined;
  classID: string | undefined;
}) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className="flex justify-between my-5">
        <h1 className={"text-2xl"}>{className}</h1>
        {reportTypes?.map((e: ReportType) => {
          return <p>{e.name}</p>;
        })}
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
      </div>

      {/* {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>} */}
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
                  className={clsx(
                    "cursor-pointer",
                    "flex",
                    "flex",
                    "justify-center items-center"
                  )}
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
                  <RemoveButtonIcon />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

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
