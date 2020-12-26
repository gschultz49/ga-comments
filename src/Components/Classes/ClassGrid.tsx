import firebase from "firebase";
import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CLASSES_COLLECTION } from "../Utils/utils";
import Grid from "../Utils/Components/Grid";
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
      .where("teacherId", "==", teacherId)
      .orderBy("createdAt", "desc"),
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
    <div className={"flex justify-center sm:justify-between "}>
      <Grid styles={[["sm:grid-cols-4", "gap-32"]]}>
        {newClass ? <CreateClassCardProvider /> : null}
        {classes?.map((c) => (
          <ClassCardProvider name={c.name} teacherId={c.teacherId} id={c.id} />
        ))}
      </Grid>
    </div>
  );
};

export default ClassGridProvider;
