import firebase from "firebase";
import { firestore } from "../../App";
import { DEFAULT_STUDENT, Student } from "./createStudentAndClass";
import { CLASSES_COLLECTION, STUDENT_COLLECTION } from "./utils";

const addStudentToExistingClass = async ({
  students,
  classID,
}: {
  students: Student[];
  classID: string | undefined;
}) => {
  try {
    console.log("begin loop");
    const classDocRef = await firebase
      .firestore()
      .collection(CLASSES_COLLECTION)
      .doc(classID);
    const newStudentIds: string[] = [];
    students.forEach(async (student) => {
      console.log("in loop");
      var studentRef = firebase
        .firestore()
        .collection(STUDENT_COLLECTION)
        .doc();
      newStudentIds.push(studentRef.id);
      studentRef.set(DEFAULT_STUDENT(student, classID));
    });

    console.log("out loop");

    classDocRef.set(
      {
        studentID: newStudentIds,
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error inserting students", err);
  }
};

export default addStudentToExistingClass;
