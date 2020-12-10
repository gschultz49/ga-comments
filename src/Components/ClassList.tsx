import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Link, useRouteMatch } from "react-router-dom";
import { CLASSES_COLLECTION } from "../utils";
import CardWrapper from "./CardWrapper";
import Grid from "./Grid";

export interface ClassCard {
  name: string;
  teacherId: string;
  id: string;
}

const ClassListProvider = ({
  teacherId,
}: {
  teacherId: string | undefined;
}) => {
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
    <React.Fragment>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      <ClassListGrid classes={classes} />
    </React.Fragment>
  );
};

const ClassCardProvider = ({ name, teacherId, id }: ClassCard) => {
  let { url } = useRouteMatch();
  let toPath = `${url}class/${id}`;
  return (
    <ClassCardDisplay
      name={name}
      teacherId={teacherId}
      id={id}
      toPath={toPath}
    />
  );
};

const CreateClassProvider = () => {
  let { url } = useRouteMatch();
  return <CreateClassDisplay toPath={`${url}class/createClass`} />;
};

const ClassListGrid = ({
  classes,
  newClass = true,
}: {
  classes: ClassCard[] | undefined;
  newClass?: boolean;
}) => {
  return (
    <Grid>
      {newClass ? <CreateClassProvider /> : null}
      {classes?.map((c) => (
        <ClassCardProvider name={c.name} teacherId={c.teacherId} id={c.id} />
      ))}
    </Grid>
  );
};

const CreateClassDisplay = ({ toPath }: { toPath: string }) => {
  return (
    <Link to={toPath}>
      <CardWrapper>
        <p>Create class</p>
      </CardWrapper>
    </Link>
  );
};

const ClassCardDisplay = ({
  name,
  teacherId,
  id,
  toPath,
}: ClassCard & { toPath: string }) => {
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

export default ClassListProvider;
