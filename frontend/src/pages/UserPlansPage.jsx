import React, { useState } from "react";
import CancelAppointmentModal from "../components/CancelAppointmentModal";
import UserClasses from "../components/UserClasses";
import UserSubscription from "../components/UserSubscription";
import SnackBar from "../UI/SnackBar";

const UserPlansPage = () => {
  const [isCanceClassModalOpen, setIsCancelClassModalOpen] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState({});
  const [
    openSuccessfulCancelAppointmentSnackbar,
    setOpenSuccessfulCancelAppointmentSnackbar,
  ] = useState(false);

  const openCancelClassModalHandler = (
    scheduledClassName,
    scheduledClassLocation,
    appointmentDate,
    appointmentId
  ) => {
    setIsCancelClassModalOpen(true);
    setAppointmentDetails({
      scheduledClassName,
      scheduledClassLocation,
      appointmentDate,
      appointmentId,
    });
  };

  const closeCancelClassModalHandler = () => {
    setIsCancelClassModalOpen(false);
  };

  const succsessfulCancelApointmentHandler = () => {
    closeCancelClassModalHandler();
    setOpenSuccessfulCancelAppointmentSnackbar(true);
    setTimeout(() => setOpenSuccessfulCancelAppointmentSnackbar(false), 6000);
  };

  return (
    <React.Fragment>
      <UserSubscription />
      <UserClasses openCancelClassModal={openCancelClassModalHandler} />
      {isCanceClassModalOpen && (
        <CancelAppointmentModal
          closeCancelClassModal={closeCancelClassModalHandler}
          succsessfulCancelApointment={succsessfulCancelApointmentHandler}
          appointmentId={appointmentDetails.appointmentId}
          appointmentDate={appointmentDetails.appointmentDate}
          scheduledClassName={appointmentDetails.scheduledClassName}
          scheduledClassLocation={appointmentDetails.scheduledClassLocation}
        />
      )}

      <SnackBar
        open={openSuccessfulCancelAppointmentSnackbar}
        closeSnackbarHandler={() =>
          setOpenSuccessfulCancelAppointmentSnackbar(false)
        }
        message="Appointment canceled!"
        severity="success"
      />
    </React.Fragment>
  );
};

export default UserPlansPage;
