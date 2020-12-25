import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getClassByClassIDs } from "../Components/Utils/getClass";
import getStudent from "../Components/Utils/getStudent";

const ViewStudent = () => {
  let { studentID }: any = useParams();
  const [student, setStudent] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  // eslint-disable-next-line
  const [classes, setClasses] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);
  // eslint-disable-next-line
  const [reports, setReports] = useState<
    firebase.firestore.DocumentData | undefined
  >(undefined);

  useEffect(() => {
    getStudent({ studentID }).then((studentDocumentSnap) => {
      const studentDocumentData = {
        id: studentDocumentSnap.id,
        ...studentDocumentSnap.data(),
      };
      setStudent(studentDocumentData);
      getClassByClassIDs({
        classIDs: studentDocumentSnap.data()?.classID,
      }).then((classesQuerySnapshot) => {
        const classesData: any = classesQuerySnapshot.docs.map((e) => {
          return {
            ...e.data(),
            id: e.id,
          };
        });

        setClasses(classesData);
        console.log(
          classesData.map((e: any) => e.id),
          classesData.map((e: any) => e.reportTypes),
          studentDocumentData.id
        );
        // Apparently you can't chain 'in' commands in firetore :/
        // Will probably just need to call it twice

        // firebase
        //   .firestore()
        //   .collection(REPORTS_COLLECTION)
        //   .where(
        //     "classID",
        //     "in",
        //     classesData.map((e: { id: any }) => e.id)
        //   )
        //   .where("studentID", "==", studentDocumentData.id)
        //   .where(
        //     "reportTypeID",
        //     "in",
        //     classesData.map((e: any) => e.reportTypes)
        //   )
        //   .get()
        //   .then((reportSnapshot) => {
        //     setReports(
        //       reportSnapshot.docs.map((e) => ({ id: e.id, ...e.data() }))
        //     );
        //   });
      });
    });
  }, [studentID]);
  return (
    <div>
      {student ? (
        <React.Fragment>
          <div>
            <h1>
              {student.firstName} {student.lastName}
            </h1>
            <h1>{student.gender}</h1>
          </div>

          <div>
            <h1>Report History</h1>
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default ViewStudent;
