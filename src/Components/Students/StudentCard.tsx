import React from "react";
import CardWrapper from "../Utils/Components/CardWrapper";
import { Student } from "../Utils/createStudentAndClass";

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
