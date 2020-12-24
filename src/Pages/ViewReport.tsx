import clsx from "clsx";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Linker } from "../Components/Utils/CardWrapper";
import Grid from "../Components/Utils/Grid";
import linkIconComplete from "../img/linkIcon-complete.svg";
import linkIconIncomplete from "../img/linkIcon-incomplete.svg";
import {
  CLASSES_COLLECTION,
  REPORTS_COLLECTION,
  REPORT_TYPES_COLLECTION,
  STUDENT_COLLECTION,
} from "../utils";
import { Student } from "./CreateClassForm";

const goToStudentFormById = (classID: string, reportID: string) => (
  studentID: string
) => `/class/${classID}/report/${reportID}/student/${studentID}`;

const ViewReport = () => {
  let { classID, reportID }: any = useParams();
  const [students, setStudents] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  const [reports, setReports] = useState<Map<string, boolean> | undefined>(
    undefined
  );
  const [className, setClassName] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  const [reportTypeName, setReportTypeName] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);

  useEffect(() => {
    firebase
      .firestore()
      .doc(`${REPORT_TYPES_COLLECTION}/${reportID}`)
      .get()
      .then((reportTypeSnapshot) => {
        setReportTypeName(reportTypeSnapshot?.data()?.name);
      });
    firebase
      .firestore()
      .doc(`${CLASSES_COLLECTION}/${classID}`)
      .get()
      .then((classDocumentSnapshot) => {
        const classData = classDocumentSnapshot.data();
        firebase
          .firestore()
          .collection(STUDENT_COLLECTION)
          .where("classID", "array-contains", classID)
          .where("isActive", "==", true)
          .onSnapshot((studentSnapshot) => {
            const reportData: firebase.firestore.DocumentData[] = [];
            studentSnapshot.forEach(async (student) => {
              // console.log(classID, student.id, classData?.reportTypes);
              const reportsSnapshots = await firebase
                .firestore()
                .collection(REPORTS_COLLECTION)
                .where("classID", "==", classID)
                .where("studentID", "==", student.id)
                .where("reportTypeID", "==", reportID)
                .get();
              reportsSnapshots.forEach((report) => {
                reportData.push(report.data());
              });

              setReports(
                new Map(reportData.map((e) => [e.studentID, e.isComplete]))
              );
            });
            setStudents(
              studentSnapshot.docs.map((e) => ({ ...e.data(), id: e.id }))
            );
            setClassName(classData?.name);
          });
      });
  }, [classID, reportID]);

  return (
    <div>
      {className && reportTypeName ? (
        <h1 className={"text-2xl mt-4"}>
          {className} - {reportTypeName}
        </h1>
      ) : null}

      {/* <ViewStudentGrid
        students={students?.filter((s: Student) => reports?.has(s.id))}
        cardNav={goToStudentFormById(classID, reportID)}
      /> */}

      <DisplayReportCards
        students={students}
        reports={reports}
        cardNav={goToStudentFormById(classID, reportID)}
      />
    </div>
  );
};

const DisplayReportCards = ({
  students,
  reports,
  cardNav = goToStudentFormById,
}: {
  students: firebase.firestore.DocumentData | undefined;
  reports: Map<string, boolean> | undefined;
  cardNav?: Function;
}) => {
  return (
    <Grid styles={["mt-8", "sm:grid-cols-5", "gap-2"]}>
      {reports &&
        students?.map(({ firstName, lastName, id, ...rest }: Student) => {
          return (
            <Linker to={cardNav(id)}>
              <ViewReportStudentCard
                firstName={firstName}
                lastName={lastName}
                id={id}
                isComplete={reports?.get(id as string)}
                {...rest}
              />
            </Linker>
          );
        })}
    </Grid>
  );
};

const getThemeClasses = (isComplete: boolean | undefined): string[] => {
  if (isComplete === true) {
    return ["theme-bg-complete", "theme-text-complete"];
  } else {
    return ["theme-bg-incomplete", "theme-text-incomplete"];
  }
};

const ViewReportStudentCard = ({
  firstName,
  lastName,
  isComplete,
}: Student & { isComplete: boolean | undefined }) => {
  const theme = getThemeClasses(isComplete);
  return (
    <div
      className={clsx([
        "flex",
        "flex-col",
        "shadow-lg",
        "rounded-2xl",
        "cursor-pointer",
        "transform",
        "transition",
        "hover:scale-110",
        "motion-reduce:transform-none",
        "h-48",
        "w-48",
        "card-rect",
      ])}
    >
      <div
        className={
          "flex py-3 justify-center items-center rounded-t-2xl h-1/2 w-full"
        }
      >
        <div className={"flex py-3"}>
          <p>
            {firstName} {lastName}
          </p>
        </div>
      </div>
      <div
        className={clsx(
          "flex py-3 justify-center items-center bg-blue-600 rounded-b-2xl h-1/2 w-full",
          theme
        )}
      >
        <h1 className={"pr-2"}>Report</h1>
        <img
          src={isComplete ? linkIconComplete : linkIconIncomplete}
          alt={"Link Icon"}
        ></img>
      </div>
      {/* {withRemoveIcon ? (
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
    ) : null} */}

      {/* <div className={"flex py-3"}>
      <h1 className={"pr-2"}>View</h1>
      <img src={linkIcon} alt={"Link Icon"}></img>
    </div> */}
    </div>
  );
};

export default ViewReport;
