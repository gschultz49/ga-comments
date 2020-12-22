import clsx from "clsx";
import firebase from "firebase";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { firestore } from "../App";
import StudentForm from "../Components/Students/StudentForm";
import RemoveButtonIcon from "../Components/Utils/RemoveButtonIcon";
import {
  CLASSES_COLLECTION,
  modifyAndCreateTimestamp,
  redirectTo,
  removeClass,
  removeStudentFromClass,
  REPORT_TYPES_COLLECTION,
  STUDENT_COLLECTION,
} from "../utils";
import { Student, studentsValidation } from "./CreateClassForm";

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

interface ReportType {
  name: string;
  id?: string;
}

// Then we'll fetch user data from this API
const loadData = (classID: string) => async () =>
  // await fetch("https://jsonplaceholder.typicode.com/users")
  //   .then((res) => (res.ok ? res : Promise.reject(res)))
  //   .then((res) => res.json());
  {
    const result = await firebase
      .firestore()
      .collection(STUDENT_COLLECTION)
      .where("classID", "==", classID)
      .where("isActive", "==", true)
      .get()
      .then((studentsSnapShot) => {
        return firebase
          .firestore()
          .doc(`${CLASSES_COLLECTION}/${classID}`)
          .get()
          .then((targetClassSnapshot) => {
            return firebase
              .firestore()
              .collection(REPORT_TYPES_COLLECTION)
              .where(
                firebase.firestore.FieldPath.documentId(),
                "in",
                targetClassSnapshot?.data()?.reportTypes
              );
          });
      });
    return result;

    // return {
    //   students,
    //   targetClass: targetClass,
    //   reportsPerClass,
    // };
  };

const ViewClassFormProvider = () => {
  let { classID }: { classID: string } = useParams();
  // const { data, error, isLoading } = useAsync({ promiseFn: loadData(classID) });
  const [allData, setAllData] = useState({});

  useEffect(() => {
    async function getter() {
      const studentSnapshot = await firebase
        .firestore()
        .collection(STUDENT_COLLECTION)
        .where("classID", "==", classID)
        .where("isActive", "==", true)
        .get();

      const targetClassSnapshot = await firebase
        .firestore()
        .doc(`${CLASSES_COLLECTION}/${classID}`)
        .get()
        .then(async (targetClassSnapshot) => {
          const targetClassData = targetClassSnapshot.get("reportTypes");
          const reportTypesRefs = await firebase
            .firestore()
            .collection(REPORT_TYPES_COLLECTION)
            .where(
              firebase.firestore.FieldPath.documentId(),
              "in",
              targetClassData
            )
            .get();
          return { targetClassSnapshot, reportTypesRefs };
        });
      const students: any = [];
      studentSnapshot.forEach((student) => students.push(student.data()));
      // const tc: any = [];
      // targetClassSnapshot.forEach((targetClass) => tc.push(targetClass.data()));

      setAllData({
        students,
        // targetClass: tc,
        targetClass: targetClassSnapshot.targetClassSnapshot.data(),
        reportTypes: targetClassSnapshot.reportTypesRefs.docs.map((e) =>
          e.data()
        ),
      });
    }
    getter();
  }, [classID]);

  console.log(allData);

  // const [students, loading, error] = useCollectionData<Student>(
  //   firebase
  //     .firestore()
  //     .collection(STUDENT_COLLECTION)
  //     .where("classID", "==", classID)
  //     .where("isActive", "==", true),
  //   {
  //     idField: "id",
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  // const [targetClass] = useDocumentData<TeachingClass>(
  //   firebase.firestore().doc(`${CLASSES_COLLECTION}/${classID}`),
  //   {
  //     idField: "id",
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );

  // const [reportTypes] = useDocumentData<ReportType[]>(
  //   firebase
  //     .firestore()
  //     .collection(REPORT_TYPES_COLLECTION)
  //     .where(
  //       firebase.firestore.FieldPath.documentId(),
  //       "in",
  //       targetClass ? targetClass.reportTypes : [""]
  //     ),
  //   {
  //     idField: "id",
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );
  // const reportTypes: ReportType[] | undefined = [];

  return (
    // <ViewClassForm
    //   classID={classID}
    //   className={targetClass?.name}
    //   error={error}
    //   loading={loading}
    //   students={students}
    //   reportTypes={reportTypes}
    // />
    <p>pls</p>
  );
};

const StudentsSchema = Yup.object().shape(studentsValidation);

export const ViewClassForm = ({
  className,
  error = undefined,
  loading = false,
  students,
  reportTypes,
  classID,
}: {
  className: string | undefined;
  error: object | undefined;
  loading: boolean;
  students: Student[] | undefined;
  classID: string | undefined;
  reportTypes: ReportType[] | undefined;
}) => {
  const history = useHistory();
  return (
    <React.Fragment>
      <div className="flex justify-between my-5">
        <h1 className={"text-2xl"}>{className}</h1>
        {reportTypes?.map((e) => {
          return <p>e.name</p>;
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
