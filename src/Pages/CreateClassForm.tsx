import clsx from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { auth, firestore } from "../App";
import StudentForm from "../Components/Students/StudentForm";
import RemoveButtonIcon from "../Components/Utils/RemoveButtonIcon";
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
  isActive?: boolean;
}

const FIRST_NAME_DEFAULT = "";
const LAST_NAME_DEFAULT = "";
const GENDER_DEFAULT = "";

const DEFAULT_STUDENT = (): Student => ({
  firstName: FIRST_NAME_DEFAULT,
  lastName: LAST_NAME_DEFAULT,
  gender: GENDER_DEFAULT,
  isEditable: true,
});

const produceDefaults = (n = 1, defaultObj = DEFAULT_STUDENT): Student[] => {
  const defaults: Student[] = [];
  for (let i = 0; i < n; i++) {
    defaults.push(defaultObj());
  }
  return defaults;
};

const CreateClassForm = () => {
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
        <Formik
          initialValues={{ students: students, className: "" }}
          onSubmit={async (values) => {
            createStudentAndClass({
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
              <StudentForm students={values.students} />
            </Form>
          )}
        </Formik>
      </section>
      {/* <h1>results:</h1>
      <pre>{JSON.stringify(submission, undefined, 2)}</pre> */}
    </section>
  );
};

export const RemoveButton = ({
  remove,
  index,
}: {
  remove: Function;
  index: number;
}) => {
  return (
    <div
      onClick={(e) => {
        remove(index);
      }}
      className={clsx(["flex", "justify-center items-center"])}
    >
      <div>
        <RemoveButtonIcon />
      </div>
    </div>
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
const createStudentAndClass = async ({
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
      isActive: true,
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
  } catch (err) {
    console.error("Error inserting class", err);
  }
  console.log("Insertion Successful!");
  redirectTo(history, "/");
};

export const InlineError = ({ text }: { text: string }) => (
  <i className="text-red-700">{text}</i>
);

export const NewStudentSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  lastName: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
  gender: Yup.string().ensure().required("Required"),
});

export const studentsValidation = {
  students: Yup.array().of(NewStudentSchema),
};

const FormSchema = Yup.object().shape({
  ...studentsValidation,
  className: Yup.string()
    .min(2, "Too Short!")
    .max(70, "Too Long!")
    .required("Required"),
});

export const AddStudentButton = ({ push }: { push: any }) => {
  return (
    <div
      onClick={(e) => {
        push(...produceDefaults(1));
      }}
      className={clsx(["cursor-pointer"])}
    >
      <div>+ Add Student</div>
    </div>
  );
};

export default CreateClassForm;
