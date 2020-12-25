import firebase from "firebase";
import { REPORTS_COLLECTION } from "./utils";

interface Report {
  classID: string;
  reportTypeID: string;
  studentID: string;
  isComplete: boolean;
  text: string;
}

export const DEFAULT_REPORT = ({
  classID,
  reportTypeID,
  studentID,
}: Pick<Report, "classID" | "reportTypeID" | "studentID">): Report => ({
  classID,
  reportTypeID,
  studentID,
  isComplete: false,
  text: "N/A",
});

export const createReport = ({
  classID,
  reportTypeID,
  studentID,
}: Pick<Report, "classID" | "reportTypeID" | "studentID">) =>
  firebase.firestore().collection(REPORTS_COLLECTION).add(
    DEFAULT_REPORT({
      classID,
      reportTypeID,
      studentID,
    })
  );

export default createReport;
