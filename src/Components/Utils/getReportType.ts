import firebase from "firebase";
import { REPORT_TYPES_COLLECTION } from "./utils";

const getReportType = ({ reportTypeID }: { reportTypeID: string }) =>
  firebase.firestore().doc(`${REPORT_TYPES_COLLECTION}/${reportTypeID}`).get();

export const getReportTypesByIds = ({
  reportTypes,
}: {
  reportTypes: string[];
}) =>
  firebase
    .firestore()
    .collection(REPORT_TYPES_COLLECTION)
    .where(firebase.firestore.FieldPath.documentId(), "in", reportTypes)
    .get();

export default getReportType;
