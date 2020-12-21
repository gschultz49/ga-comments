import React from "react";
import { Student } from "../../Pages/CreateClassForm";
import CardWrapper from "../Utils/CardWrapper";

const StudentCard = ({ firstName, lastName, gender, id }: Student) => {
  return (
    <CardWrapper to={`/student/${id}`}>
      <h1>
        {firstName} {lastName}
      </h1>
      <p>{gender}</p>
    </CardWrapper>
  );
};

export default StudentCard;
