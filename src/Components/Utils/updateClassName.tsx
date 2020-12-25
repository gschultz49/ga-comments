import firebase from "firebase";
import { CLASSES_COLLECTION } from "./utils";

const updateClassName = ({
  classID,
  editingClassName,
}: {
  classID: string | undefined;
  editingClassName: string;
}) =>
  firebase.firestore().doc(`${CLASSES_COLLECTION}/${classID}`).set(
    {
      name: editingClassName,
    },
    { merge: true }
  );

export default updateClassName;
