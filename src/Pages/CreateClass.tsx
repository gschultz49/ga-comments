import clsx from "clsx";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { auth, firestore } from "../App";
import {
  CLASSES_COLLECTION,
  modifyAndCreateTimestamp,
  redirectTo,
  STUDENT_COLLECTION,
} from "../utils";

export interface Student {
  firstName: string;
  lastName: string;
  gender: string;
  isEditable?: boolean;
  id?: string;
}
const produceDefaults = (n = 1, defaultObj = DEFAULT_OBJ): Student[] => {
  const defaults: Student[] = [];
  for (let i = 0; i < n; i++) {
    defaults.push(defaultObj());
  }
  return defaults;
};

const CreateClass = () => {
  const [user] = useAuthState(auth);
  const history = useHistory();

  const studentsData = produceDefaults(1);

  const [students] = useState<Student[]>(studentsData); // come from some network request
  return (
    <section>
      <section>
        <p>Teacher: {user?.displayName}</p>
      </section>
      <section>
        <div className="grid grid-flow-row gap-4">
          <Formik
            initialValues={{ students: students, className: "" }}
            onSubmit={async (values) => {
              console.log(values);
              submit({
                students: values.students,
                className: values.className,
                teacherId: user?.uid,
                history: history,
              });
            }}
            validationSchema={FormSchema}
          >
            {({ values }) => (
              <Form>
                <label htmlFor="className">Class Name </label>
                <Field name={"className"}></Field>
                <ErrorMessage
                  name={`className`}
                  render={(msg) => <InlineError text={msg} />}
                />
                <FieldArray name="students">
                  {({ insert, remove, push }) => (
                    <div>
                      {values.students.map((student: Student, index) => {
                        if (student.isEditable && student.isEditable === true) {
                          return (
                            <div className={clsx(styles)} key={index}>
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
                            </div>
                          );
                        } else {
                          return (
                            <div className="grid grid-cols-4 gap-4">
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
                            </div>
                          );
                        }
                      })}
                      <AddStudentButton push={push} />
                      <div>
                        <button type="submit">Submit</button>
                      </div>
                    </div>
                  )}
                </FieldArray>
              </Form>
            )}
          </Formik>
        </div>
      </section>
      {/* <h1>results:</h1>
      <pre>{JSON.stringify(submission, undefined, 2)}</pre> */}
    </section>
  );
};

/**
 * Handles the Submission of a class and its students
 *
 * @param {({
 *   students: Student[];
 *   className: string;
 *   teacherId: string | undefined;
 *   history: any; // react router type
 * })} {
 *   students,
 *   className,
 *   teacherId,
 *   history,
 * }
 */
const submit = async ({
  students,
  className,
  teacherId,
  history,
}: {
  students: Student[];
  className: string;
  teacherId: string | undefined;
  history: any; // react router type
}) => {
  try {
    const classIDRef = await firestore.collection(CLASSES_COLLECTION).add({
      name: className,
      teacherId: teacherId,
      ...modifyAndCreateTimestamp(),
    });
    try {
      const batch = firestore.batch();
      students.forEach((student) => {
        var docRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
        batch.set(docRef, {
          firstName: student.firstName,
          lastName: student.lastName,
          gender: student.gender,
          classID: classIDRef.id,
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
  } catch (err) {
    console.error("Error inserting class", err);
  }
  console.log("Insertion Successful!");
  redirectTo(history, "/");
};

export const InlineError = ({ text }: { text: string }) => (
  <i className="text-red-700">{text}</i>
);

const FormSchema = Yup.object().shape({
  students: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .min(2, "Too Short!")
        .max(70, "Too Long!")
        .required("Required"),
      lastName: Yup.string()
        .min(2, "Too Short!")
        .max(70, "Too Long!")
        .required("Required"),
      gender: Yup.string().ensure().required("Required"),
    })
  ),
  className: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
});

const FIRST_NAME_DEFAULT = "";
const LAST_NAME_DEFAULT = "";
const GENDER_DEFAULT = "";

const DEFAULT_OBJ = (): Student => ({
  firstName: FIRST_NAME_DEFAULT,
  lastName: LAST_NAME_DEFAULT,
  gender: GENDER_DEFAULT,
  isEditable: true,
});

const styles = ["grid", "grid-cols-4", "gap-4"];

const AddStudentButton = ({ push }: { push: any }) => {
  return (
    <div className={clsx(styles)}>
      <div
        onClick={(e) => {
          push(...produceDefaults(1));
        }}
      >
        <div>+ Add Student</div>
      </div>
    </div>
  );
};

export default CreateClass;
