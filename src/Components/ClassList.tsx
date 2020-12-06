import firebase from "firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
import clsx from "clsx";

export interface ClassCard {
  name: string;
  uid: string;
}

const ClassList = ({ teacherId }: { teacherId: string | undefined }) => {
  console.log(teacherId);
  const [classes, loading, error] = useCollectionData<ClassCard>(
    firebase.firestore().collection("classes").where("uid", "==", teacherId),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  console.log(classes);
  return (
    <div className="grid grid-cols-3 gap-6">
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <CreateClassCard teacherId={teacherId} />
      {classes?.map((c) => (
        <ClassCardComponent name={c.name} uid={c.uid} />
      ))}
    </div>
  );
};

const CardWrapper = ({ children, onClick, styles = [] }: any) => {
  return (
    <div
      className={clsx([
        "shadow-lg",
        "rounded-md",
        "bg-purple-200",
        "cursor-pointer",
        "transform",
        "transition",
        "hover:scale-110",
        "motion-reduce:transform-none",
        ...styles,
      ])}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const ClassCardComponent = ({ name, uid }: ClassCard) => {
  return (
    <CardWrapper>
      <h1>{name}</h1>
      <h1>{uid}</h1>
    </CardWrapper>
  );
};

const CreateClassCard = ({ teacherId }: { teacherId: string | undefined }) => {
  return (
    <CardWrapper
      onClick={(e: Event) => console.log("clicked add card", teacherId, e)}
      styles={[]}
    >
      <html>create class button</html>
    </CardWrapper>
  );
};

export default ClassList;
