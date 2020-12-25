import firebase from "firebase";
import { REPORTS_COLLECTION } from "./utils";

const updateReportCompletion = ({
  reportID,
  newCompletionStatus,
}: {
  reportID: string | undefined;
  newCompletionStatus: boolean;
}) =>
  firebase.firestore().collection(REPORTS_COLLECTION).doc(reportID).set(
    {
      isComplete: newCompletionStatus,
    },
    { merge: true }
  );

export default updateReportCompletion;
