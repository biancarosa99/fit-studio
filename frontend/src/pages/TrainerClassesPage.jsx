import React, { useEffect, useRef, useState } from "react";
import AddFitnessClass from "../components/AddFitnessClass";
import TrainerClasses from "../components/TrainerClasses";
import SnackBar from "../UI/SnackBar";

const TrainerClassesPage = () => {
  const [isAddClassVisible, setIsAddClassVisible] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const ref = useRef("");

  const snackbarMessage = "New class scheduled successfully!";

  useEffect(() => {
    const div = ref.current;
    if (div) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isAddClassVisible]);

  const handleToggleAddClass = () => {
    setIsAddClassVisible((prev) => !prev);
  };

  const closeSnackbarHandler = () => {
    setOpenSnackbar(false);
  };

  const handleSucsessfullScheduleNewClass = () => {
    handleToggleAddClass();
    setOpenSnackbar(true);
    setTimeout(() => setOpenSnackbar(false), 6000);
  };

  return (
    <React.Fragment>
      <TrainerClasses toggleAddClass={handleToggleAddClass} />
      {isAddClassVisible && (
        <AddFitnessClass
          ref={ref}
          sucsessfullScheduleNewClass={handleSucsessfullScheduleNewClass}
        />
      )}

      <SnackBar
        open={openSnackbar}
        closeSnackbarHandler={closeSnackbarHandler}
        message={snackbarMessage}
        severity="success"
      />
    </React.Fragment>
  );
};

export default TrainerClassesPage;
