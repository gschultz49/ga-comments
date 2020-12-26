import firebase from "firebase";
import { CLASSES_COLLECTION } from "./utils";

export const getClassByClassIDs = ({
  classIDs,
}: {
  classIDs: string[] | undefined;
}) =>
  firebase
    .firestore()
    .collection(CLASSES_COLLECTION)
    .where(firebase.firestore.FieldPath.documentId(), "in", classIDs)
    .get();

export const getClassByID = ({ classID }: { classID: string }) =>
  firebase.firestore().doc(`${CLASSES_COLLECTION}/${classID}`).get();

export default getClassByClassIDs;
