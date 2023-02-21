import { CircularProgress, Fab } from "@mui/material";
import { Box } from "@mui/system";
import {
  GridCheckCircleIcon,
  GridCheckIcon,
  GridSaveAltIcon,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

const AdminActions = ({ params, activeRowId, setActiveRowId }) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEditUser = async () => {
    setIsLoading(true);
    const userTk = user.token;
    const { id, isAdmin, isTrainer } = params.row;
    console.log(isAdmin, isTrainer);
    try {
      const res = await axios.put(
        "/admin/user",
        {
          userId: id,
          isAdmin,
          isTrainer,
        },
        {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        }
      );
      setIsLoading(false);
      if (res.status === 200) {
        setSuccess(true);
        setActiveRowId(null);
      }
      console.log(res.data);
    } catch (err) {
      console.log(err.data);
    }
  };

  useEffect(() => {
    if (activeRowId === params.id && success) {
      setSuccess(false);
    }
  }, [activeRowId]);
  return (
    <Box sx={{ position: "relative" }}>
      {success ? (
        <Fab
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#f45b69",
            color: "white",
          }}
        >
          <GridCheckIcon />
        </Fab>
      ) : (
        <Fab
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#f45b69",
            color: "white",
          }}
          disabled={params.id !== activeRowId || isLoading}
          onClick={handleEditUser}
        >
          <GridSaveAltIcon />
        </Fab>
      )}
      {isLoading && (
        <CircularProgress
          size={52}
          sx={{
            color: "#f45b69",
            position: "absolute",
            top: -6,
            left: -6,
            index: 1,
          }}
        />
      )}
    </Box>
  );
};

export default AdminActions;
