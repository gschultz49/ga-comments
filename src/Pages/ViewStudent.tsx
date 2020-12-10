import { useParams } from "react-router-dom";

const ViewStudent = () => {
  let { studentID }: any = useParams();
  return <h1>viewing student: {studentID}</h1>;
};

export default ViewStudent;
