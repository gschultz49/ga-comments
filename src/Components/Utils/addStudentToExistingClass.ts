import { firestore } from "../../App";
import { DEFAULT_STUDENT, Student } from "./createStudentAndClass";
import { STUDENT_COLLECTION } from "./utils";

const addStudentToExistingClass = async ({
  students,
  classID,
}: {
  students: Student[];
  classID: string | undefined;
}) => {
  try {
    const batch = firestore.batch();
    students.forEach((student) => {
      var studentRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
      batch.set(studentRef, DEFAULT_STUDENT(student, classID));
    });
    await batch.commit();
  } catch (err) {
    console.error("Error inserting students", err);
  }
};

export default addStudentToExistingClass;
