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
    students.forEach(async (student) => {
      var studentRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
      var classDocRef = await firestore
        .collection(CLASSES_COLLECTION)
        .doc(classID); //automatically generate unique id
      studentRef.set(DEFAULT_STUDENT(student, classID));
      classDocRef.set(
        {
          studentID: (await classDocRef.get()).data()?.studentID,
        },
        { merge: true }
      );
    });
  } catch (err) {
    console.error("Error inserting students", err);
  }
};

export default addStudentToExistingClass;
