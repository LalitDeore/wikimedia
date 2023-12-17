import React, { useState, useEffect } from "react";
import emailIcon from "./img/email.svg";
import passwordIcon from "./img/password.svg";
import styles from "./Login.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validate } from "./validate";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setErrors(validate(data, "login"));
  }, [data, touched]);

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!data.email || !data.password) {
      if (!data.email) {
        toast("Email is required", { type: "warning" });
      }
      if (!data.password) {
        toast("Password is required", { type: "warning" });
      }
      return;
    }

    try {
      const response = await axios
        .post("http://localhost:3001/admin-login", {
          email: data.email,
          password: data.password,
        })
        .then((res) => {
          console.log(res.data.token);
          if (res.status === 200) {
            const token = res.data.token;
            localStorage.setItem("authToken", token);
            navigate("/adminPage");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error(error);
      toast("Something went wrong!", {
        type: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <div className={styles.container}>
        <form
          className={styles.formLogin}
          onSubmit={submitHandler}
          autoComplete="off"
        >
          <h2>Admin Log In</h2>
          <div className="input-container">
            <div style={{ textAlign: "left", margin: "5px" }}>
              <input
                type="text"
                name="email"
                value={data.email}
                placeholder="E-mail"
                onChange={changeHandler}
                onFocus={focusHandler}
                autoComplete="off"
              />
              <img src={emailIcon} alt="" style={{ marginBottom: "10px" }} />
              {errors.email && touched.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={data.password}
                placeholder="Password"
                onChange={changeHandler}
                onFocus={focusHandler}
                autoComplete="off"
              />
              <div style={{ textAlign: "left" }} className="image">
                <img
                  src={passwordIcon}
                  alt=""
                  style={{ marginBottom: "5px" }}
                />
                {errors.password && touched.password && (
                  <span className={styles.error}>{errors.password}</span>
                )}
              </div>
            </div>
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </React.Fragment>
  );
};

export default Login;
