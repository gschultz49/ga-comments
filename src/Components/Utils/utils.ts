import firebase from "firebase";
import { firestore } from "../../App";
import { DEFAULT_STUDENT, Student } from "./createStudentAndClass";

export const CLASSES_COLLECTION = "classes";
export const STUDENT_COLLECTION = "students";
export const REPORT_TYPES_COLLECTION = "reportTypes";
export const REPORTS_COLLECTION = "reports";

export const getTimestamp = () => new Date().getTime();
export const createWithTimestamp = () => ({ createdAt: getTimestamp() });
export const modifyTimestamp = () => ({ modifiedAt: getTimestamp() });
export const modifyAndCreateTimestamp = () => ({
  ...createWithTimestamp(),
  ...modifyTimestamp(),
});

// react router to redirect
// https://stackoverflow.com/questions/31079081/programmatically-navigate-using-react-router
export const redirectTo = (history: any, page: string): void => {
  history.push(page);
};

const setIsActive = (
  collection: string,
  id: string | undefined,
  isActive: boolean
) => {
  firestore
    .collection(collection)
    .doc(id)
    .set(
      {
        isActive: isActive,
        ...modifyTimestamp(),
      },
      { merge: true }
    );
};

// const removeStudent = (id: string | undefined) => {
//   setIsActive(STUDENT_COLLECTION, id, false);
// };

export const removeClass = (id: string | undefined) => {
  setIsActive(CLASSES_COLLECTION, id, false);
};

export const removeStudentFromClass = (
  id: string | undefined,
  classID: string | undefined
) => {
  setIsActive(STUDENT_COLLECTION, id, false);
  // firebase
  //   .firestore()
  //   .collection(STUDENT_COLLECTION)
  //   .doc(id)
  //   .set(
  //     {
  //       classID: [],
  //       ...modifyTimestamp(),
  //     },
  //     { merge: true }
  //   );
  // firebase
  //   .firestore()
  //   .collection(CLASSES_COLLECTION)
  //   .doc(classID)
  //   .set({
  //     studentID: firebase.firestore.FieldValue.arrayRemove(id),
  //   });
};

export const produceDefault = (
  n = 1,
  defaultObj = DEFAULT_STUDENT
): Student[] => {
  const defaults: Student[] = [];
  for (let i = 0; i < n; i++) {
    defaults.push(defaultObj());
  }
  return defaults;
};
