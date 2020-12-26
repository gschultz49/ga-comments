import clsx from "clsx";
import firebase from "firebase";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useHistory, useParams } from "react-router-dom";
import * as Yup from "yup";
import StudentForm from "../Components/Students/StudentForm";
import addStudentToExistingClass from "../Components/Utils/addStudentToExistingClass";
import CardWrapper, {
  RectangularCard,
} from "../Components/Utils/Components/CardWrapper";
import { Student } from "../Components/Utils/createStudentAndClass";
import getClassAndReports from "../Components/Utils/getClassAndReports";
import getStudentsByClassID from "../Components/Utils/getStudentsByClassID";
import Grid from "../Components/Utils/Components/Grid";
import updateClassName from "../Components/Utils/updateClassName";
import {
  redirectTo,
  removeClass,
  removeStudentFromClass,
} from "../Components/Utils/utils";
import checkmarkIcon from "../img/checkmarkIcon-black.svg";
import linkIcon from "../img/linkIcon-dark.svg";
import pencilIcon from "../img/pencilIcon.svg";
import removeIcon from "../img/removeIcon.svg";
import { studentsValidation } from "./CreateClassForm";

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
    const classAndReports = getClassAndReports({
      classID,
      setTargetClass,
      setReportTypes,
    });
    return () => classAndReports();
  }, [classID]);

  // eslint-disable-next-line
  const [students, loading, error] = useCollectionData<Student>(
    getStudentsByClassID({ classID }),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  return (
    <ViewClassForm
      classID={classID}
      className={targetClass?.name}
      classIsActive={targetClass?.isActive}
      students={students}
      reportTypes={reportTypes}
    />
  );
};

const StudentsSchema = Yup.object().shape(studentsValidation);

const goToStudentById = (studentID: string) => `/student/${studentID}`;

export const ViewStudentGrid = ({
  students,
  withRemoveIcon = false,
  cardNav = goToStudentById,
  classID,
}: {
  students: firebase.firestore.DocumentData | undefined;
  withRemoveIcon?: boolean;
  cardNav?: Function;
  classID: string | undefined;
}) => {
  return (
    <Grid styles={["mt-8", "sm:grid-cols-5", "gap-2"]}>
      {students?.map(({ firstName, lastName, id }: Student) => (
        <CardWrapper to={cardNav(id)}>
          <React.Fragment>
            <div className={"flex flex-col justify-center items-center "}>
              {withRemoveIcon ? (
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
                      removeStudentFromClass(id, classID);
                    }
                  }}
                ></img>
              ) : null}
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
  );
};

export const ViewClassForm = ({
  className,
  students,
  reportTypes,
  classIsActive,
  classID,
}: {
  className: string | undefined;
  students: firebase.firestore.DocumentData | undefined;
  reportTypes: firebase.firestore.DocumentData | undefined;
  classIsActive: boolean;
  classID: string | undefined;
}) => {
  const history = useHistory();
  const [editingClassName, setEditingClassName] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  if (classIsActive === false) {
    return (
      <div>
        <h1>This class has been deleted</h1>
      </div>
    );
  }
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
                onClick={async (e) => {
                  setIsEditable((prev) => !prev);
                  await updateClassName({
                    classID,
                    editingClassName,
                  });
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
        {reportTypes?.map((e: ReportType, idx: number) => {
          return (
            <CardWrapper
              key={idx}
              to={`/class/${classID}/reportType/${e.id}`}
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
        <ViewStudentGrid
          students={students}
          withRemoveIcon={true}
          classID={classID}
        />
      </section>
      <section className={"my-12"}>
        <Formik
          initialValues={{ students: [] }}
          onSubmit={async (values, { resetForm }) => {
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
