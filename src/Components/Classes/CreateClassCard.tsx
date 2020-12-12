import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import CardWrapper from "../Utils/CardWrapper";

export const CreateClassCard = ({ toPath }: { toPath: string }) => {
  return (
    <Link to={toPath}>
      <CardWrapper>
        <p>Create class</p>
      </CardWrapper>
    </Link>
  );
};

const CreateClassCardProvider = () => {
  let { url } = useRouteMatch();
  return <CreateClassCard toPath={`${url}class/createClass`} />;
};

export default CreateClassCardProvider;
