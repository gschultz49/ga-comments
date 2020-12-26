import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClassByClassIDs } from "../Components/Utils/getClass";
import { getReportsByClassAndStudent } from "../Components/Utils/getReport";
import { getReportTypesByIds } from "../Components/Utils/getReportType";
import getStudent from "../Components/Utils/getStudent";

const ViewStudent = () => {
  let { studentID }: any = useParams();
  const [student, setStudent] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  const [reportInformation, setReportInformation] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  // // eslint-disable-next-line
  // const [classes, setClasses] = useState<
  //   firebase.firestore.DocumentData | undefined
  // >(undefined);
  // // eslint-disable-next-line
  // const [reports, setReports] = useState<
  //   firebase.firestore.DocumentData | undefined
  // >(undefined);

  useEffect(() => {
    getStudent({ studentID }).then((studentDocumentSnap) => {
      const studentDocumentData = {
        id: studentDocumentSnap.id,
        ...studentDocumentSnap.data(),
      };
      setStudent(studentDocumentData);
      getClassByClassIDs({
        classIDs: studentDocumentSnap.data()?.classID,
      }).then(async (allClassesForStudent) => {
        const classesData: any = allClassesForStudent.docs.map((e) => {
          return {
            ...e.data(),
            id: e.id,
          };
        });
        console.log("Classes for student", classesData);

        // all of the classeses this student is a part of
        // [
        //   {
        //     groupType: "CLASS",
        //     modifiedAt: 1608869838109,
        //     isActive: true,
        //     classStartDate: 2020,
        //     studentID: [o2s3KxZVPSBR7XSpwPSw],
        //     reportTypes: [
        //       "Ao070IguVGw5WrOFiINF",
        //       "QNb2giqVN8svkyQYe2iJ",
        //       "eMpc2zMvlu5E808H36f0",
        //       "gsKYsqrSiAbZ9Mq4g70H",
        //     ],
        //     createdAt: 1608869838109,
        //     teacherId: "BdX9JOH4UxdNPbUG5vVpC6nrIrN2",
        //     name: "uuu",
        //     classEndDate: 2021,
        //     id: "o2s3KxZVPSBR7XSpwPSw",
        //   },
        // ];

        // setClasses(classesData);
        // console.log(
        //   classesData.map((e: any) => e.id),
        //   classesData.map((e: any) => e.reportTypes),
        //   studentDocumentData.id
        // );

        const allReportsForStudentForClass = await getReportsByClassAndStudent({
          classIDs: classesData.map((e: { id: any }) => e.id),
          studentID: studentDocumentData.id,
        }).get();
        console.log(
          "All reports: ",
          allReportsForStudentForClass.docs.map((e) => e.data())
        );
        // console.log(classesData);

        console.log(allReportsForStudentForClass.docs);

        if (allReportsForStudentForClass.docs.length == 0) {
          return;
        }

        const allReportTypeNames = await getReportTypesByIds({
          reportTypes: allReportsForStudentForClass.docs.map(
            (e) => e.data().reportTypeID
          ),
        });
        console.log(
          "ReportTypes: ",
          allReportTypeNames.docs.map((e) => e.data())
        );

        setReportInformation(
          classesData.map((classs: any) => {
            return allReportsForStudentForClass.docs.map((reportRef, idx) => {
              const report = reportRef.data();
              const reportType = allReportTypeNames.docs
                .find((e) => e.id === report.reportTypeID)
                ?.data();
              return {
                className: classs.name,
                reportTypeName: reportType?.name,
                reportText: report.text,
                reportIsComplete: report.isComplete,
              };
            });
          })
        );
        console.log("done");

        // all of the reports this student has
        // [
        //   {
        //     "studentID": "nctYyBjGRqUZRO6Uw2n6",
        //     "classID": "o2s3KxZVPSBR7XSpwPSw",
        //     "reportTypeID": "eMpc2zMvlu5E808H36f0",
        //     "text": "N/A",
        //     "isComplete": false
        //   },
        //   {
        //     "studentID": "nctYyBjGRqUZRO6Uw2n6",
        //     "classID": "o2s3KxZVPSBR7XSpwPSw",
        //     "reportTypeID": "Ao070IguVGw5WrOFiINF",
        //     "text": "N/A",
        //     "isComplete": false
        //   },
        //   {
        //     "studentID": "nctYyBjGRqUZRO6Uw2n6",
        //     "classID": "o2s3KxZVPSBR7XSpwPSw",
        //     "reportTypeID": "QNb2giqVN8svkyQYe2iJ",
        //     "text": "N/A",
        //     "isComplete": true
        //   }
        // ]

        // const allReportData = await getReportsByReportType({
        //   reportTypes: classesData.map((e: any) => e.reportTypes),
        // }).get();
        // setReports(reportSnapshot.docs.map((e) => ({ id: e.id, ...e.data() })));

        // firebase
        //   .firestore()
        //   .collection(REPORTS_COLLECTION)
        //   .where(
        //     "classID",
        //     "in",
        //     classesData.map((e: { id: any }) => e.id)
        //   )
        //   .where("studentID", "==", studentDocumentData.id)
        //   .where(
        //     "reportTypeID",
        //     "in",
        //     classesData.map((e: any) => e.reportTypes)
        //   )
        //   .get()
        //   .then((reportSnapshot) => {
        //     setReports(
        //       reportSnapshot.docs.map((e) => ({ id: e.id, ...e.data() }))
        //     );
        //   });
      });
    });
  }, [studentID]);
  return (
    <div>
      {student ? (
        <React.Fragment>
          <div>
            <h1>
              {student.firstName} {student.lastName}
            </h1>
            <h1>{student.gender}</h1>
          </div>

          <div>
            <h1>Report History</h1>
            <div className={"flex mt-4 mr-4"}>
              {reportInformation?.map((classs: any) => {
                return classs.map((i: any) => {
                  return (
                    <div className={"pr-8"}>
                      <h1>
                        {i.className} - {i.reportTypeName} :{" "}
                        {i.reportIsComplete ? "Complete" : "Incomplete"}
                      </h1>

                      <p>{i.reportText}</p>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default ViewStudent;
