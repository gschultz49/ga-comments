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

export const getReportsByClassAndStudent = ({
  classIDs,
  studentID,
}: {
  classIDs: string[];
  studentID: string;
}) =>
  firebase
    .firestore()
    .collection(REPORTS_COLLECTION)
    .where("classID", "in", classIDs)
    .where("studentID", "==", studentID);

export const getReportsByReportType = ({
  reportTypes,
}: {
  reportTypes: string[];
}) =>
  firebase
    .firestore()
    .collection(REPORTS_COLLECTION)
    .where("reportTypeID", "in", reportTypes);
export default getReportByIDs;
