import clsx from "clsx";
import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useRouteMatch } from "react-router-dom";

export interface ClassCard {
  name: string;
  uid: string;
  classID: string;
}

const ClassList = ({ teacherId }: { teacherId: string | undefined }) => {
  const [classes, loading, error] = useCollectionData<ClassCard>(
    firebase.firestore().collection("classes").where("uid", "==", teacherId),
    {
      idField: "classID",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div className="grid grid-cols-3 gap-10">
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <CreateNewClassCard />

      {classes?.map((c) => (
        <ClassCardComponent name={c.name} uid={c.uid} classID={c.classID} />
      ))}
    </div>
  );
};

const cardClasses = [
  "shadow-lg",
  "rounded-md",
  "bg-purple-200",
  "cursor-pointer",
  "transform",
  "transition",
  "hover:scale-110",
  "motion-reduce:transform-none",
];

const CardWrapper = ({ children, onClick, styles = [] }: any) => {
  return (
    <div className={clsx([cardClasses, ...styles])} onClick={onClick}>
      {children}
    </div>
  );
};

const CreateNewClassCard = () => {
  let { url } = useRouteMatch();
  return (
    <Link to={`${url}class/createClass`}>
      <CardWrapper>
        <p>Create class</p>
      </CardWrapper>
    </Link>
  );
};

const ClassCardComponent = ({ name, uid, classID }: ClassCard) => {
  let { url } = useRouteMatch();
  let toPath = `${url}class/${uid}`;
  console.log(toPath);
  return (
    <Link to={toPath}>
      <CardWrapper>
        <h1>{name}</h1>
        <h1>uid:{uid}</h1>
        <h1>classID:{classID}</h1>
      </CardWrapper>
    </Link>
  );
};

export default ClassList;
