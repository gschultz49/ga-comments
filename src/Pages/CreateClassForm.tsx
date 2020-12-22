import clsx from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { auth, firestore } from "../App";
import StudentForm, {
  FloatingLabelInput,
} from "../Components/Students/StudentForm";
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

const getClassDates = (
  todaysDate = new Date()
): { classStartDate: number; classEndDate: number } => {
  const year = todaysDate.getFullYear();
  if (todaysDate.getDate() > 6) {
    return { classStartDate: year, classEndDate: year + 1 };
  } else {
    return { classStartDate: year - 1, classEndDate: year };
  }
};

const CreateClassForm = () => {
  const [user] = useAuthState(auth);
  const history = useHistory();

  const studentsData = produceDefaults(3);
  const { classStartDate, classEndDate } = getClassDates();
  const [students] = useState<Student[]>(studentsData); // come from some network request
  return (
    <section>
      <Formik
        initialValues={{
          students: students,
          className: "",
          classStartDate,
          classEndDate,
        }}
        onSubmit={async (values) => {
          createStudentAndClass({
            students: values.students,
            className: values.className,
            classStartDate: values.classStartDate,
            classEndDate: values.classEndDate,
            teacherId: user?.uid,
            history: history,
          });
        }}
        validationSchema={FormSchema}
      >
        {({ values }) => (
          <Form>
            <div className="w-32">
              <Field component={FloatingLabelInput} name="className">
                Class Name
              </Field>
              <ErrorMessage
                name={`className`}
                render={(msg) => <InlineError text={msg} />}
              />
            </div>
            <div className={"flex justify-items-auto"}>
              <Field
                name="classStartDate"
                placeholder={classStartDate.toString()}
                className={"w-12 text-center"}
              ></Field>
              <ErrorMessage
                name={`classStartDate`}
                render={(msg) => <InlineError text={msg} />}
              />
              <h1>-</h1>
              <Field
                name="classEndDate"
                placeholder={classEndDate.toString()}
                className={"w-12 text-center"}
              ></Field>
              <ErrorMessage
                name={`classEndDate`}
                render={(msg) => <InlineError text={msg} />}
              />
            </div>

            <StudentForm students={values.students} />
          </Form>
        )}
      </Formik>
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
  classStartDate,
  classEndDate,
  history,
}: {
  students: Student[];
  className: string;
  teacherId: string | undefined;
  classStartDate: number;
  classEndDate: number;
  history: any; // react router type
}) => {
  try {
    const classIDRef = await firestore.collection(CLASSES_COLLECTION).add({
      name: className,
      teacherId: teacherId,
      isActive: true,
      classStartDate,
      classEndDate,
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
    .required("Class Name Required"),
  classStartDate: Yup.string()
    .min(4, "Too Short!")
    .max(4, "Too Long!")
    .required("End Year Required"),
  classEndDate: Yup.string()
    .min(4, "Too Short!")
    .max(4, "Too Long!")
    .required("Start Year Required")
    .test("is-greater", "End Year should be greater", function (value) {
      const { classStartDate } = this.parent;
      if (value !== undefined) {
        return classStartDate < value;
      } else {
        return false;
      }
      // return moment(value, "HH:mm").isSameOrAfter(moment(start, "HH:mm"));
    }),

  // classStartDate: Yup.string().required("Start year cannot be empty"),
  // classEndDate: Yup.string()
  //   .required("End year cannot be empty")
  //   .test("is-greater", "end year should be greater", function (value: any) {
  //     const { classStartDate } = this.parent;
  //     return classStartDate > value;
  //     // return moment(value, "HH:mm").isSameOrAfter(moment(start, "HH:mm"));
  //   }),
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
