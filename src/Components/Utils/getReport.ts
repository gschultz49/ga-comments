import firebase from "firebase";
import { REPORTS_COLLECTION } from "./utils";

export const getReportByIDs = ({
  classID,
  studentID,
  reportTypeID,
}: {
  classID: string;
  reportTypeID: string;
  studentID: string;
}) =>
  firebase
    .firestore()
    .collection(REPORTS_COLLECTION)
    .where("classID", "==", classID)
    .where("studentID", "==", studentID)
    .where("reportTypeID", "==", reportTypeID);

export default getReportByIDs;
