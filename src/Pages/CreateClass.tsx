import clsx from "clsx";
import React from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../App";
// import * as Yup from "yup";
import { useFormik } from "formik";

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
  ];
  const [students, setStudents] = useState<Student[]>(studentsData);
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
          <StudentRows students={students} setStudents={setStudents} />
          <AddStudent setStudents={setStudents} />
        </div>
      </section>
    </section>
  );
};
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
}
// https://stackoverflow.com/questions/55075740/property-does-not-exist-on-type-intrinsicattributes
const StudentRows = ({
  students,
  setStudents,
}: {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  return (
    <React.Fragment>
      {students.map((student: Student) => (
        <StudentRow
          key={`${student.firstName}-${student.lastName}`}
          student={student}
          setStudents={setStudents}
        />
      ))}
    </React.Fragment>
  );
};
const StudentRow = ({
  student,
  setStudents,
}: {
  student: Student;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  const { firstName, lastName, gender, id } = student;
  return (
    <div className="grid grid-cols-4 gap-4">
      <div>{firstName}</div>
      <div>{lastName}</div>
      <div>{gender}</div>
      <div
        onClick={(e) => {
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student.id !== id)
          );
        }}
      >
        <button>remove button</button>
      </div>
    </div>
  );
};

const FIRST_NAME_DEFAULT = "";
const LAST_NAME_DEFAULT = "";
const GENDER_DEFAULT = "-1";

const validate = (values: any) => {
  const errors: any = {};
  if (!values.firstName) {
    errors.firstName = "Required";
  } else if (values.firstName.length < 2) {
    errors.firstName = "Must be 2 characters or greater";
  }
  if (!values.lastName) {
    errors.lastName = "Required";
  } else if (values.lastName.length < 2) {
    errors.lastName = "Must be 2 characters or greater";
  }

  if (values.gender == GENDER_DEFAULT) {
    errors.gender = "Select Gender";
  }

  return errors;
};

export const InlineError = ({ text }: { text: string }) => (
  <i className="text-red-700">{text}</i>
);

const AddStudent = ({
  setStudents,
}: {
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}) => {
  //   const [firstName, setFirstName] = useState(FIRST_NAME_DEFAULT);
  //   const [lastName, setLastName] = useState(LAST_NAME_DEFAULT);
  //   const [gender, setGender] = useState(GENDER_DEFAULT);
  const formik = useFormik({
    initialValues: {
      firstName: FIRST_NAME_DEFAULT,
      lastName: LAST_NAME_DEFAULT,
      gender: GENDER_DEFAULT,
    },
    validate,
    onSubmit: (values, { resetForm }) => {
      alert(JSON.stringify(values, null, 2));

      setStudents((prevStudents) => [
        ...prevStudents,
        {
          firstName: values.firstName,
          lastName: values.lastName,
          gender: values.gender,
          id: `${Math.random()}`,
        },
      ]);
      resetForm();

      //   setFirstName(FIRST_NAME_DEFAULT);
      //   setLastName(LAST_NAME_DEFAULT);
      //   setGender(GENDER_DEFAULT);
    },
  });
  const [isEditable, setIsEditable] = useState(false);
  const styles = ["grid", "grid-cols-4", "gap-4"];
  if (isEditable) {
    return (
      <form onSubmit={formik.handleSubmit} className={clsx(styles)}>
        <div>
          {/* <label htmlFor="firstName">First Name</label> */}
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstName}
          />
          {formik.touched.firstName && formik.errors.firstName ? (
            <div>
              <InlineError text={formik.errors.firstName} />
            </div>
          ) : null}
        </div>
        <div>
          {/* <label htmlFor="lastName">Last Name</label> */}
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastName}
          />
          {formik.touched.lastName && formik.errors.lastName ? (
            <div>
              {" "}
              <InlineError text={formik.errors.lastName} />
            </div>
          ) : null}
        </div>
        <div>
          <div>
            <select
              id={"gender"}
              name={"gender"}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="-1">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender ? (
              <div>
                <InlineError text={formik.errors.gender} />
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>

      //   <div className={clsx(styles)}>
      //     <div>
      //       <input
      //         type="text"
      //         onChange={(e) => setFirstName(e.currentTarget.value)}
      //         value={firstName}
      //         placeholder="First Name"
      //       ></input>
      //     </div>
      //     <div>
      //       <input
      //         type="text"
      //         onChange={(e) => setLastName(e.currentTarget.value)}
      //         value={lastName}
      //         placeholder="Last Name"
      //       ></input>
      //     </div>
      //     <div>
      //       <select
      //         value={gender}
      //         onChange={(e) => setGender(e.currentTarget.value)}
      //       >
      //         <option value="-1">Select...</option>
      //         <option value="Male">Male</option>
      //         <option value="Female">Female</option>
      //         <option value="Other">Other</option>
      //       </select>
      //     </div>

      //     <div
      //       onClick={(e) => {
      //         setStudents((prevStudents) => [
      //           ...prevStudents,
      //           {
      //             firstName,
      //             lastName,
      //             gender,
      //             id: `${Math.random()}`,
      //           },
      //         ]);

      //         setFirstName(FIRST_NAME_DEFAULT);
      //         setLastName(LAST_NAME_DEFAULT);
      //         setGender(GENDER_DEFAULT);
      //         // setIsEditable(false);
      //       }}
      //     >
      //       <button>Add button</button>
      //     </div>
      //   </div>
    );
  } else {
    return (
      <div className={clsx(styles)}>
        <div
          onClick={(e) => {
            setIsEditable(true);
          }}
        >
          <button>+ Add Student</button>
        </div>
      </div>
    );
  }
};

export default CreateClass;
