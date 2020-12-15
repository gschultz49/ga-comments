import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import CardWrapper from "../Utils/CardWrapper";

export interface IClassCard {
  name: string;
  teacherId: string;
  id: string;
  isActive?: boolean;
}

export const ClassCard = ({
  name,
  teacherId,
  id,
  toPath,
}: IClassCard & { toPath: string }) => {
  return (
    <Link to={toPath}>
      <CardWrapper>
        <h1>{name}</h1>
      </CardWrapper>
    </Link>
  );
};

const ClassCardProvider = ({ name, teacherId, id }: IClassCard) => {
  let { url } = useRouteMatch();
  let toPath = `${url}class/${id}`;
  return (
    <ClassCard name={name} teacherId={teacherId} id={id} toPath={toPath} />
  );
};

export default ClassCardProvider;
