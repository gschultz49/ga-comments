import { firestore } from "../../App";
import {
  modifyAndCreateTimestamp,
  REPORT_TYPES_COLLECTION,
  CLASSES_COLLECTION,
  STUDENT_COLLECTION,
} from "./utils";

export interface Student {
  firstName: string;
  lastName: string;
  gender: string;
  classID: string[];
  isEditable?: boolean;
  id?: string;
  isActive?: boolean;
}

export const FIRST_NAME_DEFAULT = "";
export const LAST_NAME_DEFAULT = "";
export const GENDER_DEFAULT = "";

export const DEFAULT_STUDENT = (student?: any, classID?: any): Student => ({
  firstName: student?.firstName || FIRST_NAME_DEFAULT,
  lastName: student?.lastName || LAST_NAME_DEFAULT,
  gender: student?.gender || GENDER_DEFAULT,
  classID: classID ? [classID] : [],
  isActive: true,
  ...modifyAndCreateTimestamp(),
});

export const createStudentAndClass = async ({
  students,
  className,
  teacherId,
  classStartDate,
  classEndDate,
}: {
  students: Student[];
  className: string;
  teacherId: string | undefined;
  classStartDate: number;
  classEndDate: number;
}) => {
  try {
    await firestore
      .collection(REPORT_TYPES_COLLECTION)
      .where("groupType", "==", "CLASS")
      .get()
      .then(async function (snapshot) {
        const reportIds = snapshot.docs.map(function (documentSnapshot) {
          return documentSnapshot.id;
        });
        const studentRefs: string[] = [];
        const classIDRef = firestore.collection(CLASSES_COLLECTION).doc();
        // const classIDRef = await firestore.collection(CLASSES_COLLECTION).add({
        //   name: className,
        //   teacherId: teacherId,
        //   isActive: true,
        //   classStartDate,
        //   classEndDate,
        //   reportTypes: reportIds,
        //   groupType: "CLASS", // for future ideas
        //   ...modifyAndCreateTimestamp(),
        // });
        const batch = firestore.batch();
        students.forEach((student) => {
          var docRef = firestore.collection(STUDENT_COLLECTION).doc(); //automatically generate unique id
          studentRefs.push(docRef.id);
          batch.set(docRef, DEFAULT_STUDENT(student, classIDRef.id));
        });
        await batch.commit();

        classIDRef.set({
          name: className,
          teacherId: teacherId,
          isActive: true,
          classStartDate,
          classEndDate,
          reportTypes: reportIds,
          groupType: "CLASS", // for future ideas
          studentID: studentRefs,
          ...modifyAndCreateTimestamp(),
        });
      });
  } catch (err) {
    console.error("Error inserting class", err);
  }
};
