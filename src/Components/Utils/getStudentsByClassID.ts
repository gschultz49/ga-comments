import firebase from "firebase";
import { STUDENT_COLLECTION } from "./utils";

const getStudentsByClassID = ({ classID }: { classID: string }) =>
  firebase
    .firestore()
    .collection(STUDENT_COLLECTION)
    .where("classID", "array-contains", classID)
    .where("isActive", "==", true);

export default getStudentsByClassID;
