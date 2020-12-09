import clsx from "clsx";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import * as Yup from "yup";
import { auth } from "../App";

const CreateClass = () => {
  const [user] = useAuthState(auth);
  const [className, setClassName] = useState("");
  const studentsData: Student[] = [
    {
      firstName: "John",
      lastName: "Doe",
      gender: "Male",
      id: "1",
    },
    {
      firstName: "Emmy",
      lastName: "Chen",
      gender: "Female",
      id: "2",
    },
    {
      firstName: "",
      lastName: "",
      gender: "",
      id: "3",
      isNew: true,
    },
  ];
  const [students] = useState<Student[]>(studentsData); // come from some network request
  const [submission, setSubmission] = useState<Student[]>([]);
  return (
    <section>
      <section>
        <label htmlFor="className">Class Name </label>
        <input
          id="className"
          type="text"
          value={className}
          placeholder={`${user?.displayName}'s class`}
          onChange={(e) => setClassName(e.currentTarget.value)}
        ></input>
        <p>Teacher: {user?.displayName}</p>
      </section>
      <section>
        <h1>
          Students in <b>{className ? className : "<Class Name>"}</b>
        </h1>
        <div className="grid grid-flow-row gap-4">
          <Formik
            initialValues={{ students: students }}
            onSubmit={async (values) => {
              setSubmission([...values.students]);
              console.log(values);
              //   await new Promise((r) => setTimeout(r, 500));
              //   alert(JSON.stringify(values, null, 2));
            }}
            validationSchema={NestedStudentSchema}
          >
            {({ values }) => (
              <Form>
                <FieldArray name="students">
                  {({ insert, remove, push }) => (
                    <div>
                      {values.students.map((student: Student, index) => {
                        if (student.isNew && student.isNew === true) {
                          return (
                            <div className={clsx(styles)} key={student.id}>
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
                                <button>remove button</button>
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
                                <button>remove button</button>
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
      <h1>results:</h1>
      <pre>{JSON.stringify(submission, undefined, 2)}</pre>
    </section>
  );
};
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  isNew?: boolean;
}

export const InlineError = ({ text }: { text: string }) => (
  <i className="text-red-700">{text}</i>
);

const NestedStudentSchema = Yup.object().shape({
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
});
const FIRST_NAME_DEFAULT = "";
const LAST_NAME_DEFAULT = "";
const GENDER_DEFAULT = "";

const styles = ["grid", "grid-cols-4", "gap-4"];

const AddStudentButton = ({ push }: { push: any }) => {
  return (
    <div className={clsx(styles)}>
      <div
        onClick={(e) => {
          push({
            firstName: FIRST_NAME_DEFAULT,
            lastName: LAST_NAME_DEFAULT,
            gender: GENDER_DEFAULT,
            id: `${Math.random()}`,
            isNew: true,
          });
        }}
      >
        <div>+ Add Student</div>
      </div>
    </div>
  );
};

export default CreateClass;
