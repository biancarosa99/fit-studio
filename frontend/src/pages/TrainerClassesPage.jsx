import React, { useEffect, useRef, useState } from "react";
import ScheduleFitnessClass from "../components/ScheduleFitnessClass";
import TrainerClasses from "../components/TrainerClasses";
import SnackBar from "../UI/SnackBar";

const TrainerClassesPage = () => {
  const [isAddClassVisible, setIsAddClassVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const addClassRef = useRef("");
  const classesTableRef = useRef("");
  const refreshClassesRef = useRef("");

  useEffect(() => {
    if (addClassRef.current) {
      addClassRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAddClassVisible]);

  const handleToggleAddClass = () => {
    setIsAddClassVisible((prev) => !prev);
    if (classesTableRef.current) {
      classesTableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const closeSnackbarHandler = () => {
    setOpenSnackbar(false);
  };

  const successfulScheduleNewClassHandler = () => {
    handleToggleAddClass();
    setSnackbarMessage("New class scheduled successfully!");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 6000);
    refreshClassesRef.current.getClasses();
  };

  const unsuccessfulScheduleNewClassHandler = (errorMessage) => {
    console.log("open error snackbar: " + errorMessage);
    setSnackbarMessage(errorMessage);
    setSnackbarSeverity("error");
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 6000);
  };

  return (
    <React.Fragment>
      <TrainerClasses
        ref={{ classesTableRef, refreshClassesRef }}
        toggleAddClass={handleToggleAddClass}
      />
      {isAddClassVisible && (
        <ScheduleFitnessClass
          ref={addClassRef}
          successfulScheduleNewClassHandler={successfulScheduleNewClassHandler}
          unsuccessfulScheduleNewClassHandler={
            unsuccessfulScheduleNewClassHandler
          }
        />
      )}

      <SnackBar
        open={openSnackbar}
        closeSnackbarHandler={closeSnackbarHandler}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </React.Fragment>
  );
};

export default TrainerClassesPage;
