import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

export interface ClassCard {
  name: string;
  uid: string;
}

const ClassList = ({ teacherId }: { teacherId: string | undefined }) => {
  const [classes, loading, error] = useCollectionData<ClassCard>(
    firebase.firestore().collection("classes").where("uid", "==", teacherId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}

      {classes?.map((c) => (
        <ClassCardComponent name={c.name} uid={c.uid} />
      ))}
    </div>
  );
};

const ClassCardComponent = ({ name, uid }: ClassCard) => {
  return (
    <div>
      <h1>{name}</h1>
      <h1>{uid}</h1>
    </div>
  );
};

export default ClassList;
