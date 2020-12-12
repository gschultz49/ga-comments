import React from "react";
import { Link } from "react-router-dom";
import { Student } from "../../Pages/CreateClassForm";
import CardWrapper from "../Utils/CardWrapper";

const StudentCard = ({ firstName, lastName, gender, id }: Student) => {
  return (
    <Link to={`/student/${id}`}>
      <CardWrapper>
        <h1>
          {firstName} {lastName}
        </h1>
        <p>{gender}</p>
      </CardWrapper>
    </Link>
  );
};

export default StudentCard;
