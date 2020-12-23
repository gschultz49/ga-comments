import { useParams } from "react-router-dom";

const ViewReport = () => {
  let { classID, reportID }: any = useParams();
  return (
    <h1>
      Viewing Report: {reportID} for class: {classID}
    </h1>
  );
};

export default ViewReport;
