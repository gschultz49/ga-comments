import firebase from "firebase";
import React from "react";
import {
  useCollection,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import { auth, firestore } from "../App";

const ClassPage = () => {
  //   const classesRef = firestore.collection("classes");
  //   const query = classesRef.orderBy("createdAt").limit(25);

  //   const [messages, loading, error] = useCollection(
  //     firebase.firestore().collection("classes"),
  //     {
  //       snapshotListenOptions: { includeMetadataChanges: true },
  //     }
  //   );

  const [messages, loading, error] = useCollectionData(
    firebase
      .firestore()
      .collection("classes")
      .where("uid", "==", auth.currentUser?.uid),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  console.log(auth.currentUser?.uid);

  return (
    <div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Collection: Loading...</span>}

      {messages &&
        messages.map((doc: any) => (
          <React.Fragment key={doc.id}>{JSON.stringify(doc)},</React.Fragment>
        ))}
      {/* {messages &&
        messages.docs.map((doc) => (
          <React.Fragment key={doc.id}>
            {JSON.stringify(doc.data())},{" "}
          </React.Fragment>
        ))} */}
    </div>
  );
};

export default ClassPage;
