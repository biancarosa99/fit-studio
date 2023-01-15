import React, { useContext } from "react";
import "../styles/Navbar.css";
import LogoIMG from "../assets/fithublogo2.png";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SnackBar from "../UI/SnackBar";

const Navbar = () => {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [loginModalIsOpen, setLoginModalIsOpen] = useState(false);
  const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const { user, setUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const openMobileMenuHandler = () => {
    setMobileMenuIsOpen(true);
  };

  const closeMobileMenuHandler = () => {
    setMobileMenuIsOpen(false);
  };

  const openLoginModalHandler = () => {
    setLoginModalIsOpen(true);
    mobileMenuIsOpen && setMobileMenuIsOpen(false);
  };

  const closeLoginModalHandler = () => {
    setLoginModalIsOpen(false);
  };

  const openRegisterModalHandler = () => {
    setRegisterModalIsOpen(true);
    mobileMenuIsOpen && setMobileMenuIsOpen(false);
  };

  const closeRegisterModalHandler = () => {
    setRegisterModalIsOpen(false);
  };

  const logoutHandler = () => {
    setUser(null);
    setMobileMenuIsOpen(false);
    navigate("/");
  };

  const sucssesfullLoginHandler = () => {
    setOpenSnackbar(true);
    setSnackbarMessage("User Logged In succesfully!");
    closeLoginModalHandler();

    setTimeout(() => setOpenSnackbar(false), 6000);
  };

  const sucssesfullRegisterHandler = () => {
    setOpenSnackbar(true);
    setSnackbarMessage("User registered succesfully!");
    closeRegisterModalHandler();
    openLoginModalHandler();

    setTimeout(() => setOpenSnackbar(false), 6000);
  };

  const navigateToSignUpHandler = () => {
    closeLoginModalHandler();
    openRegisterModalHandler();
  };

  const navigateToLoginHandler = () => {
    closeRegisterModalHandler();
    openLoginModalHandler();
  };

  const closeSnackbarHandler = () => {
    setOpenSnackbar(false);
  };

  const userLoggedOutClasses = user ? "menu-item hide-menu-item" : "menu-item";

  const userLoggedInClasses = user ? "menu-item" : "menu-item hide-menu-item";

  const trainerLoggedInClasses = user?.user?.isTrainer
    ? "menu-item"
    : "menu-item hide-menu-item";

  const normalUserLoggedInClasses = user
    ? user?.user?.isTrainer
      ? "menu-item hide-menu-item"
      : "menu-item "
    : "menu-item hide-menu-item";
  return (
    <React.Fragment>
      <nav className="navbar">
        <div className="brand-logo">
          <a href="/">
            <img className="logo" alt="logo" src={LogoIMG} />
          </a>
        </div>

        <div className="menu-items-desktop">
          <li className="menu-item">
            <a className="anchor" href="/">
              HOME
            </a>
          </li>
          <li className="menu-item">
            <a className="anchor" href="/classesTimetable">
              PLANS
            </a>
          </li>
          <li className={userLoggedOutClasses} onClick={openLoginModalHandler}>
            LOGIN
          </li>
          <li
            className={userLoggedOutClasses}
            onClick={openRegisterModalHandler}
          >
            REGISTER
          </li>
          <li className={trainerLoggedInClasses}>
            <a className="anchor" href="/trainerclasses/future">
              MY CLASSES
            </a>
          </li>
          <li className={normalUserLoggedInClasses}>
            <a className="anchor" href="/myplans/future">
              MY PLANS
            </a>
          </li>
          <li className={userLoggedInClasses} onClick={logoutHandler}>
            LOGOUT
          </li>
        </div>

        {!mobileMenuIsOpen ? (
          <li onClick={openMobileMenuHandler} className="mobile-menu-button">
            <MenuRoundedIcon />
          </li>
        ) : (
          <li onClick={closeMobileMenuHandler} className="mobile-menu-button">
            <CloseRoundedIcon />
          </li>
        )}

        {mobileMenuIsOpen && (
          <div className="menu-items-mobile">
            <li className="menu-item">
              <a className="anchor-mobile" href="/">
                HOME
              </a>
            </li>
            <li className="menu-item">
              <a className="anchor-mobile" href="/classesTimetable">
                PLANS
              </a>
            </li>
            <li
              className={userLoggedOutClasses}
              onClick={openLoginModalHandler}
            >
              LOGIN
            </li>
            <li
              className={userLoggedOutClasses}
              onClick={openRegisterModalHandler}
            >
              REGISTER
            </li>
            <li className={trainerLoggedInClasses}>
              <a className="mobile-anchor" href="/trainerclasses/future">
                MY CLASSES
              </a>
            </li>
            <li className={normalUserLoggedInClasses}>
              <a className="mobile-anchor" href="/myplans/future">
                MY PLANS
              </a>
            </li>
            <li className={userLoggedInClasses} onClick={logoutHandler}>
              LOGOUT
            </li>
          </div>
        )}
      </nav>
      {loginModalIsOpen && (
        <Login
          closeLogin={closeLoginModalHandler}
          handleSucessfullLogin={sucssesfullLoginHandler}
          navigateToSignUp={navigateToSignUpHandler}
        />
      )}
      {registerModalIsOpen && (
        <Register
          closeRegister={closeRegisterModalHandler}
          handleSucessfullRegister={sucssesfullRegisterHandler}
          navigateToLogin={navigateToLoginHandler}
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

export default Navbar;
