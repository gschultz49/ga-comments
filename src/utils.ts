import firebase from "firebase";

export const CLASSES_COLLECTION = "classes";
export const STUDENT_COLLECTION = "students";

export const getTimestamp = () => firebase.firestore.Timestamp.now();
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
