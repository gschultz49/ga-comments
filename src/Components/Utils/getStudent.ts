import firebase from "firebase";
import { STUDENT_COLLECTION } from "./utils";

const getStudent = ({ studentID }: { studentID: string }) =>
  firebase.firestore().collection(STUDENT_COLLECTION).doc(studentID).get();

export default getStudent;
