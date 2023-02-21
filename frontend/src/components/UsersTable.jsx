import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { bool } from "yup";
import AuthContext from "../context/AuthContext";
import AdminActions from "./AdminActions";

const UsersTable = () => {
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [pageSize, setPageSize] = useState(null);
  const [activeRowId, setActiveRowId] = useState(null);

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
  }, []);

  const columns = useMemo(
    () => [
      { field: "lastname", headerName: "Last Name", width: 180 },
      { field: "firstname", headerName: "First Name", width: 180 },
      { field: "email", headerName: "Email", width: 200 },
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
          return <AdminActions {...{ params, activeRowId, setActiveRowId }} />;
        },
      },
    ],
    [activeRowId]
  );
  return (
    <div style={{ padding: "100px" }}>
      <Box sx={{ height: 400, width: "100%" }}>
        <Typography
          variant="h3"
          component="h3"
          sx={{ textAlign: "center", mt: 3, mb: 3 }}
        >
          Users
        </Typography>
        <DataGrid
          columns={columns}
          rows={users}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20, 100]}
          sx={{
            "& .css-gl260s-MuiDataGrid-columnHeadersInner": {
              color: "#f45b69",
            },
          }}
          onCellEditCommit={(params) => setActiveRowId(params.id)}
        />
      </Box>
    </div>
  );
};

export default UsersTable;
