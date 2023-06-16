import React, { useContext, useState } from "react";
import classes from "../styles/Login.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useForm } from "react-hook-form";
import axios from "axios";
import { userLoginValidationSchema } from "../validations/UserLoginValidation";
import { useYupValidationResolver } from "../validations/YupResolver";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const [dbErrors, setDbErrors] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const resolver = useYupValidationResolver(userLoginValidationSchema);

  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver,
  });

  const handleUserLogin = async (data) => {
    try {
      const res = await axios.post("auth/login", data);

      if (res.status === 200) {
        setDbErrors("");
        setUser(res.data);
        props.handleSucessfullLogin();
        navigate("/");
      }
    } catch (err) {
      setDbErrors(err.response.data);
    }
  };

  return (
    <React.Fragment>
      <div className={classes.backdrop}>
        <div className={classes.modal}>
          <div className={classes["login-title-section"]}>
            <div className={classes["login-title"]}>Login</div>
            <button
              className={classes["close-button"]}
              onClick={props.closeLogin}
            >
              <CloseRoundedIcon />
            </button>
          </div>
          <form
            className={classes["form-section"]}
            onSubmit={handleSubmit(handleUserLogin)}
          >
            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}>Email</div>
              <input
                type="email"
                className={classes.input}
                {...login("email")}
              />
              <div className={classes["error-message"]}>
                {errors?.email?.message}
              </div>
            </div>
            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}>Password</div>
              <input
                type="password"
                className={classes.input}
                {...login("password")}
              />
              <div className={classes["error-message"]}>
                {errors?.password?.message}
              </div>
              <div className={classes["error-message"]}>{dbErrors}</div>
            </div>
            <div className={classes["signup-section"]}>
              <span>Not yet registered? </span>
              <span className={classes.anchor} onClick={props.navigateToSignUp}>
                Sign up Here
              </span>
            </div>
            <button className={classes["login-button"]}>Login</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Login;
