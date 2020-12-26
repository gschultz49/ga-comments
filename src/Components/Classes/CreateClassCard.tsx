import React from "react";
import { useRouteMatch } from "react-router-dom";
import CardWrapper from "../Utils/Components/CardWrapper";
import cross from "../../img/Cross.svg";

export const CreateClassCard = ({ toPath }: { toPath: string }) => {
  return (
    <CardWrapper to={toPath} styles={["newCardBorder", "shadow-none"]}>
      <img src={cross} alt={"Add button"}></img>
    </CardWrapper>
  );
};

const CreateClassCardProvider = () => {
  let { url } = useRouteMatch();
  return <CreateClassCard toPath={`${url}class/createClass`} />;
};

export default CreateClassCardProvider;
