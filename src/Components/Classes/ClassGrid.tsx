import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CLASSES_COLLECTION } from "../../utils";
import Grid from "../Utils/Grid";
import ClassCardProvider, { IClassCard } from "./ClassCard";
import CreateClassCardProvider from "./CreateClassCard";

const ClassGridProvider = ({
  teacherId,
}: {
  teacherId: string | undefined;
}) => {
  const [classes, loading, error] = useCollectionData<IClassCard>(
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
      <ClassGrid classes={classes?.filter((e) => e.isActive === true)} />
    </React.Fragment>
  );
};

const ClassGrid = ({
  classes,
  newClass = true,
}: {
  classes: IClassCard[] | undefined;
  newClass?: boolean;
}) => {
  return (
    <Grid>
      {newClass ? <CreateClassCardProvider /> : null}
      {classes?.map((c) => (
        <ClassCardProvider name={c.name} teacherId={c.teacherId} id={c.id} />
      ))}
    </Grid>
  );
};

export default ClassGridProvider;