import React, { useContext, useState } from "react";
import BuySubscriptionModal from "../components/BuySubscriptionModal";
import ConfirmAppointmentModal from "../components/ConfirmAppointmentModal";
import FitnessScheduler from "../components/FitnessScheduler";
import SubscriptionPricing from "../components/SubscriptionPricing";
import AuthContext from "../context/AuthContext";
import SnackBar from "../UI/SnackBar";

const SchedulerPage = () => {
  const { user } = useContext(AuthContext);

  const [isAppoinmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isBuySubscriptionModalOpen, setIsBuySubscriptionModalOpen] =
    useState(false);

  const [openUserNotLoggedInSnackbar, setOpenUserNotLoggedInSnackbar] =
    useState(false);

  const [
    opensSuccessfulAppointmentSnackbar,
    setOpenSuccessfulAppointmentSnackbar,
  ] = useState(false);

  const [
    opensSuccessfulBuySubscriptionSnackbar,
    setOpenSuccessfulBuySubscriptionSnackbar,
  ] = useState(false);

  const [appointmentDetails, setAppointmentDetails] = useState({});

  const [subscriptionTypeDetails, setSubscriptionTypeDetails] = useState({});

  const openConfirmAppointmentModalHandler = (
    className,
    classLocation,
    classDate,
    classId,
    classMaxSpots,
    classLevel,
    trainerName
  ) => {
    if (user) {
      setIsAppointmentModalOpen(true);
      const details = {
        name: className,
        location: classLocation,
        date: classDate,
        id: classId,
        maxSpots: classMaxSpots,
        level: classLevel,
        trainerName,
      };
      setAppointmentDetails(details);
    } else {
      userNotLoggedInHandler();
    }
  };

  const closeConfirmAppointmentModalHandler = () => {
    setIsAppointmentModalOpen(false);
  };

  const openBuySubscriptionModalHandler = (
    subscriptionTypeId,
    subscriptionTypeName,
    subscriptionTypePricing,
    subscriptionTypeDuration
  ) => {
    if (user) {
      setIsBuySubscriptionModalOpen(true);
      const details = {
        id: subscriptionTypeId,
        name: subscriptionTypeName,
        pricing: subscriptionTypePricing,
        duration: subscriptionTypeDuration,
      };
      setSubscriptionTypeDetails(details);
    } else {
      userNotLoggedInHandler();
    }
  };

  const closeBuySubscriptionModalModalHandler = () => {
    setIsBuySubscriptionModalOpen(false);
  };

  const userNotLoggedInHandler = () => {
    setOpenUserNotLoggedInSnackbar(true);
    setTimeout(() => setOpenUserNotLoggedInSnackbar(false), 6000);
  };

  const succsessfulApointmentHandler = () => {
    closeConfirmAppointmentModalHandler();
    setOpenSuccessfulAppointmentSnackbar(true);
    setTimeout(() => setOpenSuccessfulAppointmentSnackbar(false), 6000);
  };

  const succsessfulBuySubscriptionHandler = () => {
    closeBuySubscriptionModalModalHandler();
    setOpenSuccessfulBuySubscriptionSnackbar(true);
    setTimeout(() => setOpenSuccessfulBuySubscriptionSnackbar(false), 6000);
  };

  return (
    <React.Fragment>
      <FitnessScheduler
        openConfirmAppointment={openConfirmAppointmentModalHandler}
      />
      <SubscriptionPricing
        openBuySubscriptionModal={openBuySubscriptionModalHandler}
      />
      {isAppoinmentModalOpen && (
        <ConfirmAppointmentModal
          closeConfirmAppointment={closeConfirmAppointmentModalHandler}
          succsessfulApointment={succsessfulApointmentHandler}
          className={appointmentDetails.name}
          classLocation={appointmentDetails.location}
          classDate={appointmentDetails.date}
          classId={appointmentDetails.id}
          classMaxSpots={appointmentDetails.maxSpots}
          classDifficulty={appointmentDetails.level}
          trainerName={appointmentDetails.trainerName}
        />
      )}

      {isBuySubscriptionModalOpen && (
        <BuySubscriptionModal
          closeBuySubscription={closeBuySubscriptionModalModalHandler}
          succsessfulBuySubscription={succsessfulBuySubscriptionHandler}
          subscriptionId={subscriptionTypeDetails.id}
          subscriptionName={subscriptionTypeDetails.name}
          subscriptionPricing={subscriptionTypeDetails.pricing}
          subscriptionDuration={subscriptionTypeDetails.duration}
        />
      )}
      <SnackBar
        open={openUserNotLoggedInSnackbar}
        closeSnackbarHandler={() => setOpenUserNotLoggedInSnackbar(false)}
        message="You can't perform this action if not logged in"
        severity="error"
      />

      <SnackBar
        open={opensSuccessfulAppointmentSnackbar}
        closeSnackbarHandler={() => setOpenSuccessfulAppointmentSnackbar(false)}
        message="Appointment created successfully!"
        severity="success"
      />

      <SnackBar
        open={opensSuccessfulBuySubscriptionSnackbar}
        closeSnackbarHandler={() =>
          setOpenSuccessfulBuySubscriptionSnackbar(false)
        }
        message="Action completed successfully!"
        severity="success"
      />
    </React.Fragment>
  );
};

export default SchedulerPage;
