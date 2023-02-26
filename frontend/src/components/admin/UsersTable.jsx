import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../context/AuthContext";
import SnackBar from "../../UI/SnackBar";
import AdminActions from "./AdminActions";

const UsersTable = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [activeRowId, setActiveRowId] = useState(null);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const userTk = user.token;
        const res = await axios.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUsers();
  }, [user.token]);

  const handleEditUserError = (errorMessage) => {
    setSnackbarErrorMessage(errorMessage);
    openErrorSnackbarHandler();
  };

  const openErrorSnackbarHandler = () => {
    setOpenErrorSnackbar(true);
    setTimeout(() => setOpenErrorSnackbar(false), 6000);
  };

  const closeSnackbarHandler = () => {
    setOpenErrorSnackbar(false);
  };

  const columns = useMemo(
    () => [
      {
        field: "lastname",
        headerName: "Last Name",
        width: 180,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "firstname",
        headerName: "First Name",
        width: 180,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "email",
        headerName: "Email",
        width: 200,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "isAdmin",
        headerName: "isAdmin",
        width: 180,
        type: "boolean",
        editable: true,
      },
      {
        field: "isTrainer",
        headerName: "isTrainer",
        width: 180,
        type: "boolean",
        editable: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        type: "actions",
        renderCell: (params) => {
          // console.log(params.row.id);
          return (
            <AdminActions
              {...{ params, activeRowId, setActiveRowId, handleEditUserError }}
            />
          );
        },
      },
    ],
    [activeRowId]
  );
  return (
    <div style={{ width: "100%", marginTop: "50px" }}>
      <Box sx={{ height: 400, width: "100%" }}>
        {/* <Typography
          variant="h4"
          component="h4"
          sx={{ textAlign: "center", mt: 3, mb: 3 }}
        >
          Users
        </Typography> */}
        <DataGrid
          columns={columns}
          rows={users}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 30]}
          sx={{
            "& .css-gl260s-MuiDataGrid-columnHeadersInner": {
              color: "#f45b69",
            },
          }}
          onCellEditCommit={(params) => setActiveRowId(params.id)}
        />
      </Box>
      <SnackBar
        open={openErrorSnackbar}
        message={snackbarErrorMessage}
        closeSnackbarHandler={closeSnackbarHandler}
        severity="error"
      />
    </div>
  );
};

export default UsersTable;
