import React from "react";
import { useParams } from "react-router-dom";

const ViewStudentReport = () => {
  let { classID, reportID, studentID }: any = useParams();
  return (
    <React.Fragment>
      <h1>Viewing Class: {classID}</h1>
      <h1>Interim: {reportID}</h1>
      <h1>Student: {studentID}</h1>
    </React.Fragment>
  );
};
export default ViewStudentReport;
