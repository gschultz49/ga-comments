import clsx from "clsx";
import firebase from "firebase";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { firestore } from "../App";
import StudentForm from "../Components/Students/StudentForm";
import CardWrapper, { RectangularCard } from "../Components/Utils/CardWrapper";
import Grid from "../Components/Utils/Grid";
import linkIcon from "../img/linkIcon-dark.svg";
import removeIcon from "../img/removeIcon.svg";
import pencilIcon from "../img/pencilIcon.svg";
import checkmarkIcon from "../img/checkmarkIcon-black.svg";

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

// interface TeachingClass {
//   name: string;
//   teacherId: string;
//   createdAt: Date;
//   modifiedAt: Date;
//   reportTypes: string[];
//   classStartDate: number;
//   classEndDate: number;
//   id?: string;
// }

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
    const classAndReports = firebase
      .firestore()
      .doc(`${CLASSES_COLLECTION}/${classID}`)
      // here we listen for any realtime changes to this Class
      .onSnapshot(async (targetClassDocumentSnapshot) => {
        // we need to get the report type ID array for this class, then look those up
        // inside the report types collection
        const targetClassReportTypeRows = targetClassDocumentSnapshot.get(
          "reportTypes"
        );
        const reportTypesQuerySnapshot = await firebase
          .firestore()
          .collection(REPORT_TYPES_COLLECTION)
          .where(
            firebase.firestore.FieldPath.documentId(),
            "in",
            targetClassReportTypeRows
          )
          .get();
        // once we have all the data we need, add it to the state
        setTargetClass(targetClassDocumentSnapshot.data());
        setReportTypes(
          reportTypesQuerySnapshot.docs.map((e) => {
            return {
              id: e.id,
              ...e.data(),
            };
          })
        );
      });

    return () => classAndReports();
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
  const [editingClassName, setEditingClassName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  return (
    <React.Fragment>
      <div className="flex justify-between my-5">
        <div className={"flex flex-row"}>
          {isEditable ? (
            <React.Fragment>
              <input
                type={"text"}
                placeholder={className}
                value={editingClassName}
                onChange={(e) => {
                  setEditingClassName(e.target.value);
                }}
              ></input>
              <img
                className={"cursor-pointer"}
                src={checkmarkIcon}
                alt={"Check Icon"}
                onClick={(e) => {
                  setIsEditable((prev) => !prev);
                  firebase
                    .firestore()
                    .doc(`${CLASSES_COLLECTION}/${classID}`)
                    .set(
                      {
                        name: editingClassName,
                      },
                      { merge: true }
                    );

                  console.log("switch to read only mode");
                }}
              ></img>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h1 className={"text-2xl mr-4"}>{className}</h1>
              <img
                className={"cursor-pointer"}
                src={pencilIcon}
                alt={"Pencil Icon"}
                onClick={(e) => {
                  setIsEditable((prev) => !prev);
                  console.log("switch to edit mode");
                }}
              ></img>
            </React.Fragment>
          )}
        </div>

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

      <Grid styles={["sm:grid-cols-4", "gap-32"]}>
        {reportTypes?.map((e: ReportType) => {
          console.log(e);
          return (
            <CardWrapper
              to={`/class/${classID}/report/${e.id}`}
              Wrapper={RectangularCard}
              styles={["h-32"]}
            >
              <p>{e.name}</p>
            </CardWrapper>
          );
        })}
      </Grid>

      <section className={"mt-16"}>
        <h1 className={"text-2xl"}>Students</h1>
        <Grid styles={["mt-8", "sm:grid-cols-5", "gap-2"]}>
          {students?.map(({ firstName, lastName, id }: Student) => (
            <CardWrapper to={`/student/${id}`}>
              <React.Fragment>
                <div className={"flex flex-col justify-center items-center "}>
                  <img
                    className="absolute top-4 right-4 h-6 w-6 text-center"
                    src={removeIcon}
                    alt={"remove"}
                    onClick={(e) => {
                      // we dont want to navigate on click of this button
                      e.preventDefault();
                      if (
                        window.confirm(
                          "Are you sure you want to delete this student from this class?"
                        )
                      ) {
                        removeStudentFromClass(id);
                      }
                    }}
                  ></img>
                  <div className={"flex py-3"}>
                    <p>
                      {firstName} {lastName}
                    </p>
                  </div>
                  <div className={"flex py-3"}>
                    <h1 className={"pr-2"}>View</h1>
                    <img src={linkIcon} alt={"Link Icon"}></img>
                  </div>
                </div>
              </React.Fragment>
            </CardWrapper>
          ))}
        </Grid>
      </section>
      <section className={"my-12"}>
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
      </section>
    </React.Fragment>
  );
};

export default ViewClassFormProvider;
