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
  <Grid styles={["grid-cols-4"]}>
    <FieldArray name="students">
      {({ remove, push }) => (
        <React.Fragment>
          {students.map((student: Student, index) => {
            if (student.isEditable && student.isEditable === true) {
              return (
                <React.Fragment>
                  <div>
                    <Field name={`students[${index}].firstName`}></Field>
                    <ErrorMessage
                      name={`students[${index}].firstName`}
                      render={(msg) => <InlineError text={msg} />}
                    />
                  </div>
                  <div>
                    <Field name={`students[${index}].lastName`}></Field>
                    <ErrorMessage
                      name={`students[${index}].lastName`}
                      render={(msg) => <InlineError text={msg} />}
                    />
                  </div>

                  <div>
                    <Field as="select" name={`students[${index}].gender`}>
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
          <div>
            <button type="submit">Submit</button>
          </div>
        </React.Fragment>
      )}
    </FieldArray>
  </Grid>
);

export default StudentForm;
