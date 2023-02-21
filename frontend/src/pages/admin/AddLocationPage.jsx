import React from "react";
import AddLocation from "../../components/AddLocation";
import AddLocationMui from "../../components/AddLocationMui";
import UsersTable from "../../components/UsersTable";

const AddLocationPage = () => {
  return (
    <React.Fragment>
      <AddLocationMui />
      <UsersTable />
    </React.Fragment>
  );
};

export default AddLocationPage;
