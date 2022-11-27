import React, { useMemo, useState } from "react";
import classes from "../styles/Login.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useForm } from "react-hook-form";
import {
  userLoginValidationSchema,
  useYupValidationResolver,
} from "../validations/UserRegisterValidation";
import axios from "axios";

const Login = (props) => {
  const resolver = useYupValidationResolver(userLoginValidationSchema);
  const {
    register: login,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver,
  });

  const handleUserLogin = async (data) => {
    // console.log(data);

    try {
      const res = await axios.post("auth/login", data);

      if (res.status === 200) {
        console.log("User logged in succesfully!");
        console.log(res.data);
      }
    } catch (err) {
      console.log(err.response.data);
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
            </div>
            <div className={classes["signup-section"]}>
              <span>Not yet registered? </span>
              <span>
                <a className={classes.anchor}>Sign up Here</a>
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
