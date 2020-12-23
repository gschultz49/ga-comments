import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import firebase from "firebase";
import {
  CLASSES_COLLECTION,
  REPORTS_COLLECTION,
  STUDENT_COLLECTION,
} from "../utils";

const ViewReport = () => {
  let { classID, reportID }: any = useParams();
  //   get all studentIDs in this class
  //   for each studentID, check all reports where studentID=studentID, classID=classID, reportID=reportID
  const [students, setStudents] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  const [reports, setReports] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  useEffect(() => {
    firebase
      .firestore()
      .doc(`${CLASSES_COLLECTION}/${classID}`)
      .get()
      .then((classDocumentSnapshot) => {
        const classData = classDocumentSnapshot.data();
        const students = firebase
          .firestore()
          .collection(STUDENT_COLLECTION)
          .where("classID", "array-contains", classID)
          .where("isActive", "==", true)
          .get()
          .then((studentSnapshot) => {
            const reportData: firebase.firestore.DocumentData[] = [];
            studentSnapshot.forEach(async (student) => {
              //   console.log(classID, student.id, classData?.reportTypes);
              const reportsSnapshots = await firebase
                .firestore()
                .collection(REPORTS_COLLECTION)
                .where("classID", "==", classID)
                .where("studentID", "==", student.id)
                .where("reportTypeID", "in", classData?.reportTypes)
                .get();
              reportsSnapshots.forEach((report) => {
                reportData.push(report.data());
              });

              setReports(reportData);
            });
            setStudents(studentSnapshot.docs.map((e) => e.data()));
          });
      });
  }, []);

  return (
    <h1>
      Viewing Report: {reportID} for class: {classID}
    </h1>
  );
};

export default ViewReport;
