import clsx from "clsx";
import firebase from "firebase";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import { firestore } from "../App";
import Grid from "../Components/Grid";
import {
  CLASSES_COLLECTION,
  modifyAndCreateTimestamp,
  redirectTo,
  removeClass,
  removeStudentFromClass,
  STUDENT_COLLECTION,
} from "../utils";
import {
  AddStudentButton,
  InlineError,
  Student,
  studentsValidation,
} from "./CreateClass";

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

const ViewClassProvider = () => {
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
    <ViewClassDisplay
      classID={classID}
      className={targetClass?.name}
      error={error}
      loading={loading}
      students={students}
    />
  );
};

const StudentsSchema = Yup.object().shape(studentsValidation);

export const ViewClassDisplay = ({
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
      {/* <StudentsGrid students={students} /> */}
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
        {({ values, resetForm }) => (
          <Form>
            <Grid styles={["grid-cols-4"]}>
              <FieldArray name="students">
                {({ insert, remove, push }) => (
                  <React.Fragment>
                    {values.students.map((student: Student, index) => {
                      if (student.isEditable && student.isEditable === true) {
                        return (
                          <React.Fragment>
                            <div>
                              <Field
                                name={`students[${index}].firstName`}
                              ></Field>
                              <ErrorMessage
                                name={`students[${index}].firstName`}
                                render={(msg) => <InlineError text={msg} />}
                              />
                            </div>
                            <div>
                              <Field
                                name={`students[${index}].lastName`}
                              ></Field>
                              <ErrorMessage
                                name={`students[${index}].lastName`}
                                render={(msg) => <InlineError text={msg} />}
                              />
                            </div>

                            <div>
                              <Field
                                as="select"
                                name={`students[${index}].gender`}
                              >
                                <option value="">Select...</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </Field>
                              <ErrorMessage
                                name={`students[${index}].gender`}
                                render={(msg) => <InlineError text={msg} />}
                              />
                            </div>
                            <div
                              onClick={(e) => {
                                remove(index);
                              }}
                            >
                              <div>remove button</div>
                            </div>
                          </React.Fragment>
                        );
                      } else {
                        return (
                          <React.Fragment>
                            <div>{student.firstName}</div>
                            <div>{student.lastName}</div>
                            <div>{student.gender}</div>
                            <div
                              onClick={(e) => {
                                remove(index);
                              }}
                            >
                              <div>remove button</div>
                            </div>
                          </React.Fragment>
                        );
                      }
                    })}
                    <AddStudentButton push={push} />
                    <div>
                      <button type="submit">Submit</button>
                    </div>
                  </React.Fragment>
                )}
              </FieldArray>
            </Grid>
          </Form>
        )}
      </Formik>
    </React.Fragment>
  );
};

export default ViewClassProvider;
