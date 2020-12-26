import clsx from "clsx";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Linker } from "../Components/Utils/Components/CardWrapper";
import Grid from "../Components/Utils/Components/Grid";
import { Student } from "../Components/Utils/createStudentAndClass";
import { getClassByID } from "../Components/Utils/getClass";
import { getReportByIDs } from "../Components/Utils/getReport";
import getReportType from "../Components/Utils/getReportType";
import getStudentsByClassID from "../Components/Utils/getStudentsByClassID";
import linkIconComplete from "../img/linkIcon-complete.svg";
import linkIconIncomplete from "../img/linkIcon-incomplete.svg";

export const goToStudentFormById = (classID: string, reportTypeID: string) => (
  studentID: string
) => `/class/${classID}/reportType/${reportTypeID}/student/${studentID}`;

const ViewReport = () => {
  let { classID, reportTypeID }: any = useParams();
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
    getReportType({ reportTypeID }).then((reportTypeSnapshot) => {
      setReportTypeName(reportTypeSnapshot?.data()?.name);
    });
    getClassByID({ classID }).then((classDocumentSnapshot) => {
      const classData = classDocumentSnapshot.data();
      getStudentsByClassID({ classID }).onSnapshot((studentSnapshot) => {
        const reportData: firebase.firestore.DocumentData[] = [];
        studentSnapshot.forEach(async (student) => {
          const reportsSnapshots = await getReportByIDs({
            classID,
            studentID: student.id,
            reportTypeID,
          }).get();
          reportsSnapshots.forEach((report) => {
            reportData.push(report.data());
          });
          // this is inefficient, need to find a way to reliably run the update after the student iteration
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
  }, [classID, reportTypeID]);

  return (
    <div>
      {className && reportTypeName ? (
        <h1 className={"text-2xl mt-4"}>
          {className} - {reportTypeName}
        </h1>
      ) : null}

      {/* <ViewStudentGrid
        students={students?.filter((s: Student) => reports?.has(s.id))}
        cardNav={goToStudentFormById(classID, reportTypeID)}
      /> */}

      <DisplayReportCards
        students={students}
        reports={reports}
        cardNav={goToStudentFormById(classID, reportTypeID)}
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
            <Linker to={cardNav(id)} key={id}>
              <ViewReportStudentCard
                firstName={firstName}
                lastName={lastName}
                id={id}
                isComplete={reports.get(id as string) === true}
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
