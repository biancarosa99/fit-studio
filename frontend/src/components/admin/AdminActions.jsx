import { CircularProgress, Fab } from "@mui/material";
import { Box } from "@mui/system";
import {
  GridCheckIcon,
  GridSaveAltIcon,
  GridCloseIcon,
} from "@mui/x-data-grid";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";

const AdminActions = ({
  params,
  activeRowId,
  setActiveRowId,
  handleEditUserError,
}) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleEditUser = async () => {
    setIsLoading(true);
    const userTk = user.token;
    const { id, isAdmin, isTrainer } = params.row;

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
      setTimeout(() => {
        if (res.status === 200) {
          setSuccess(true);
        }
        setActiveRowId(null);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.log(err.response.data);

      setTimeout(() => {
        setError(true);
        handleEditUserError(err.response.data);
        setActiveRowId(null);
        setIsLoading(false);
      }, 1000);
    }
  };

  useEffect(() => {
    if (activeRowId === params.id && success) {
      setSuccess(false);
    }
    if (activeRowId === params.id && error) {
      setError(false);
    }

    // eslint-disable-next-line
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
      ) : error ? (
        <Fab
          sx={{
            width: 40,
            height: 40,
            bgcolor: "red",
            color: "white",
          }}
        >
          <GridCloseIcon />
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
