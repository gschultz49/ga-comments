import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { REPORTS_COLLECTION } from "../utils";

export const createReport = ({ classID, reportID, studentID }: any) => ({
  classID,
  reportTypeID: reportID,
  studentID,
  isComplete: false,
  text: "N/A",
});

const ViewStudentReport = () => {
  let { classID, reportID, studentID }: any = useParams();

  // const [student, setStudent] = useState();
  // const [student, setStudent] = useState();
  const [reportInfo, setReportInfo] = useState<
    firebase.firestore.DocumentData | undefined
  >();
  useEffect(() => {
    console.log(classID, reportID, studentID);
    firebase
      .firestore()
      .collection(REPORTS_COLLECTION)
      .where("classID", "==", classID)
      .where("studentID", "==", studentID)
      .where("reportTypeID", "==", reportID)
      .onSnapshot(async (reportSnap) => {
        const reportData = reportSnap.docs;

        console.log(reportData);

        if (reportData.length === 0) {
          const defaultReport = createReport({ classID, reportID, studentID });
          firebase
            .firestore()
            .collection(REPORTS_COLLECTION)
            .add(defaultReport)
            .then((ref) => {
              setReportInfo({
                id: ref.id,
                ...defaultReport,
              });
              // firebase
              //   .firestore()
              //   .collection(REPORTS_COLLECTION)
              //   .where("classID", "==", classID)
              //   .where("studentID", "==", studentID)
              //   .where("reportTypeID", "==", reportID)
              //   .onSnapshot((snapshot) => {
              //     const snapshotData = snapshot.docs.map((e) => ({
              //       id: e.id,
              //       ...e.data(),
              //     }));
              //     console.log(snapshotData);
              //     setReportInfo(snapshotData.shift());
              //   });
            });
        } else {
          setReportInfo(
            reportSnap.docs.map((e) => ({ id: e.id, ...e.data() })).shift()
          );
        }
      });
  }, [classID, studentID, reportID]);
  console.log(reportInfo?.isComplete);
  return (
    <React.Fragment>
      <h1>Viewing Class: {classID}</h1>
      <h1>Interim: {reportID}</h1>
      <h1>Student: {studentID}</h1>

      <h1
        onClick={(e) => {
          console.log(e);
          firebase
            .firestore()
            .collection(REPORTS_COLLECTION)
            .doc(reportInfo?.id)
            .set(
              {
                isComplete: !reportInfo?.isComplete,
              },
              { merge: true }
            );
        }}
      >
        Report Is Complete?: {reportInfo?.isComplete ? "True" : "False"}
      </h1>
      {/* <select
        value={reportInfo?.isComplete}
        onChange={(e) => {
          firebase
            .firestore()
            .collection(REPORTS_COLLECTION)
            .doc(reportInfo?.id)
            .set(
              {
                isComplete: !reportInfo?.isComplete,
              },
              { merge: true }
            );
        }}
      >
        <option value={"true"}> isComplete:true</option>
        <option value={"false"}> isComplete:false</option>
      </select> */}
    </React.Fragment>
  );
};
export default ViewStudentReport;
