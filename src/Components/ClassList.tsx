import clsx from "clsx";
import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useRouteMatch } from "react-router-dom";
import { CLASSES_COLLECTION } from "../utils";

export interface ClassCard {
  name: string;
  teacherId: string;
  id: string;
}

const ClassList = ({ teacherId }: { teacherId: string | undefined }) => {
  const [classes, loading, error] = useCollectionData<ClassCard>(
    firebase
      .firestore()
      .collection(CLASSES_COLLECTION)
      .where("teacherId", "==", teacherId),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div className="grid grid-cols-3 gap-10">
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <CreateNewClassCard />
      {classes?.map((c) => (
        <ClassCardComponent name={c.name} teacherId={c.teacherId} id={c.id} />
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

export const CardWrapper = ({ children, onClick, styles = [] }: any) => {
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

const ClassCardComponent = ({ name, teacherId, id }: ClassCard) => {
  let { url } = useRouteMatch();
  let toPath = `${url}class/${id}`;
  return (
    <Link to={toPath}>
      <CardWrapper>
        <h1>{name}</h1>
        <h1>teacherId:{teacherId}</h1>
        <h1>id:{id}</h1>
      </CardWrapper>
    </Link>
  );
};

export default ClassList;
