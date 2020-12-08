import { useParams } from "react-router-dom";

const ViewClass = () => {
  let { classID }: any = useParams();
  return <h1>viewing class {classID}</h1>;
};

export default ViewClass;
