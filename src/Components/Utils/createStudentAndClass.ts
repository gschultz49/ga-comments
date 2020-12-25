import { firestore } from "../../App";
import addStudentToExistingClass from "./addStudentToExistingClass";
import {
  CLASSES_COLLECTION,
  modifyAndCreateTimestamp,
  REPORT_TYPES_COLLECTION,
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
  isEditable: true,
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
        const classDocRef = firestore.collection(CLASSES_COLLECTION).doc();

        addStudentToExistingClass({
          students,
          classID: classDocRef.id,
        });

        classDocRef.set({
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
