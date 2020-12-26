import firebase from "firebase";
import { getReportTypesByIds } from "./getReportType";
import { CLASSES_COLLECTION } from "./utils";

const getClassAndReports = ({
  classID,
  setTargetClass,
  setReportTypes,
}: {
  classID: string;
  setTargetClass: React.Dispatch<
    React.SetStateAction<firebase.firestore.DocumentData | undefined>
  >;
  setReportTypes: React.Dispatch<
    React.SetStateAction<firebase.firestore.DocumentData | undefined>
  >;
}) =>
  firebase
    .firestore()
    .doc(`${CLASSES_COLLECTION}/${classID}`)
    // here we listen for any realtime changes to this Class
    .onSnapshot(async (targetClassDocumentSnapshot) => {
      // we need to get the report type ID array for this class, then look those up
      // inside the report types collection
      const targetClassReportTypeRows = targetClassDocumentSnapshot.get(
        "reportTypes"
      );
      const reportTypesQuerySnapshot = await getReportTypesByIds({
        reportTypes: targetClassReportTypeRows,
      });
      // once we have all the data we need, add it to the state
      setTargetClass(targetClassDocumentSnapshot.data());
      setReportTypes(
        reportTypesQuerySnapshot.docs.map((e) => {
          return {
            id: e.id,
            ...e.data(),
          };
        })
      );
    });

export default getClassAndReports;
