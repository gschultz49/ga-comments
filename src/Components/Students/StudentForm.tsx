import clsx from "clsx";
import { FieldArray, Field, ErrorMessage } from "formik";
import React from "react";
import {
  AddStudentButton,
  InlineError,
  RemoveButton,
  Student,
} from "../../Pages/CreateClassForm";
import Grid from "../Utils/Grid";

const StudentForm = ({ students }: { students: Student[] }) => (
  <Grid styles={["grid-cols-1", "sm:grid-cols-4"]}>
    <FieldArray name="students">
      {({ remove, push }) => (
        <React.Fragment>
          {students.map((student: Student, index) => {
            if (student.isEditable && student.isEditable === true) {
              return (
                <React.Fragment>
                  <div className={clsx(["flex", "flex-col"])}>
                    <Field
                      component={FloatingLabelInput}
                      name={`students[${index}].firstName`}
                    >
                      First Name
                    </Field>
                    <ErrorMessage
                      name={`students[${index}].firstName`}
                      render={(msg) => <InlineError text={msg} />}
                    />
                  </div>
                  <div className={clsx(["flex", "flex-col"])}>
                    <Field
                      component={FloatingLabelInput}
                      name={`students[${index}].lastName`}
                    >
                      Last Name
                    </Field>
                    <ErrorMessage
                      name={`students[${index}].lastName`}
                      render={(msg) => <InlineError text={msg} />}
                    />
                  </div>

                  <div className={clsx(["flex", "flex-col"])}>
                    <label htmlFor={`students[${index}].gender`}></label>
                    <Field
                      as="select"
                      name={`students[${index}].gender`}
                      className={
                        "relative border rounded bg-gray-600 text-white text-opacity-50 mb-2 border-white border-opacity-25"
                      }
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
                  <RemoveButton remove={remove} index={index} />
                </React.Fragment>
              );
            } else {
              return (
                <Grid>
                  <div>{student.firstName}</div>
                  <div>{student.lastName}</div>
                  <div>{student.gender}</div>
                  <RemoveButton remove={remove} index={index} />
                </Grid>
              );
            }
          })}
          <AddStudentButton push={push} />
          {students.length > 0 && (
            <div>
              <button type="submit">Submit</button>
            </div>
          )}
        </React.Fragment>
      )}
    </FieldArray>
  </Grid>
);

// https://codepen.io/chrsgrrtt/pen/MWypegr
export function FloatingLabelInput({
  field,
  form,
  type = "text",
  name,
  children,
}: any) {
  const [active, setActive] = React.useState(false);

  function updateFormAndUI(e: any) {
    const { name } = field;
    const { setFieldValue } = form;
    setFieldValue(name, e.target.value);
    setActive(!!e.target.value);
  }
  return (
    <div className="relative border rounded bg-gray-600 text-white mb-2 border-white border-opacity-25">
      <input
        className={clsx([
          "outline-none w-full rounded bg-transparent text-sm transition-all duration-200 ease-in-out p-2",
          active ? "pt-6" : "",
        ])}
        id={name}
        name={name}
        type={type}
        {...field}
        onChange={updateFormAndUI}
      />
      <label
        className={clsx([
          "absolute top-0 left-0 flex items-center text-white text-opacity-50 p-2 transition-all duration-200 ease-in-out",
          active ? "text-xs" : "text-sm",
        ])}
        htmlFor={name}
      >
        {children}
      </label>
    </div>
  );
}

export default StudentForm;
