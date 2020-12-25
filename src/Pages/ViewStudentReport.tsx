import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createReport, DEFAULT_REPORT } from "../Components/Utils/createReport";
import getReportByIDs from "../Components/Utils/getReport";
import updateReportCompletion from "../Components/Utils/updateReportCompletion";

const ViewStudentReport = () => {
  let { classID, reportTypeID, studentID }: any = useParams();

  const [reportInfo, setReportInfo] = useState<
    firebase.firestore.DocumentData | undefined
  >();
  useEffect(() => {
    getReportByIDs({
      classID,
      studentID,
      reportTypeID,
    }).onSnapshot(async (reportSnap) => {
      const reportData = reportSnap.docs;
      if (reportData.length === 0) {
        createReport({ classID, reportTypeID, studentID }).then((ref) => {
          setReportInfo({
            id: ref.id,
            ...DEFAULT_REPORT({
              classID,
              reportTypeID,
              studentID,
            }),
          });
        });
      } else {
        setReportInfo(
          reportSnap.docs.map((e) => ({ id: e.id, ...e.data() })).shift()
        );
      }
    });
  }, [classID, studentID, reportTypeID]);

  return (
    <React.Fragment>
      <h1>Viewing Class: {classID}</h1>
      <h1>Interim: {reportTypeID}</h1>
      <h1>Student: {studentID}</h1>

      <h1
        onClick={async (e) => {
          await updateReportCompletion({
            reportID: reportInfo?.id,
            newCompletionStatus: !reportInfo?.isComplete,
          });
        }}
      >
        Report Is Complete?: {reportInfo?.isComplete ? "True" : "False"}
      </h1>
    </React.Fragment>
  );
};
export default ViewStudentReport;
