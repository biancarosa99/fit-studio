import React, { useState } from "react";
import classes from "../styles/Register.module.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import axios from "axios";
import { useForm } from "react-hook-form";
import { userRegisterValidationSchema } from "../validations/UserRegisterValidation";
import { useYupValidationResolver } from "../validations/YupResolver";

const Register = (props) => {
  const [dbErrors, setDbErrors] = useState([]);

  const resolver = useYupValidationResolver(userRegisterValidationSchema);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver,
  });

  const handleUserRegister = async (data) => {
    try {
      const res = await axios.post("auth/register", data);

      if (res.status === 200) {
        console.log("User registered succesfully!");
        props.handleSucessfullRegister();
      }
    } catch (err) {
      console.log(err.response.data);
      setDbErrors(Object.values(err.response.data));
    }
  };

  return (
    <React.Fragment>
      <div className={classes.backdrop}>
        <div className={classes.modal}>
          <div className={classes["register-title-section"]}>
            <div className={classes["register-title"]}>Register</div>
            <button
              className={classes["close-button"]}
              onClick={props.closeRegister}
            >
              <CloseRoundedIcon />
            </button>
          </div>
          <form
            className={classes["form-section"]}
            onSubmit={handleSubmit(handleUserRegister)}
          >
            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}>Firstname</div>
              <input
                type="text"
                className={classes.input}
                {...register("firstName")}
              />
              <div className={classes["error-message"]}>
                {errors?.firstName?.message}
              </div>
            </div>

            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}>Lastname</div>
              <input
                type="text"
                className={classes.input}
                {...register("lastName")}
              />
              <div className={classes["error-message"]}>
                {errors?.lastName?.message}
              </div>
            </div>
            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}>Email</div>
              <input
                type="email"
                className={classes.input}
                {...register("email")}
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
                {...register("password")}
              />
              <div className={classes["error-message"]}>
                {errors?.password?.message}
              </div>
            </div>
            <div className={classes["input-section"]}>
              <div className={classes["input-label"]}> Confirm Password</div>
              <input
                type="password"
                className={classes.input}
                {...register("confirmPassword")}
              />
              <div className={classes["error-message"]}>
                {errors?.confirmPassword?.message}
              </div>
              <div className={classes["error-message"]}>{dbErrors}</div>
            </div>
            <div className={classes["signup-section"]}>
              <span>Already have an account? </span>
              <span className={classes.anchor} onClick={props.navigateToLogin}>
                Sign in Here
              </span>
            </div>
            <button className={classes["register-button"]}>Register</button>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Register;
