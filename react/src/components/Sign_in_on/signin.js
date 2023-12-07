import React from "react";
import axios from "axios";
import "./signin.css";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";

const SignInForm = () => {
  const [state, setState] = React.useState({
    username: "",
    password: ""
  });
  const [tl, setTL] = React.useState(false);
  const [notify, setNotify] = React.useState({
    message: "",
    error: false,
  });
  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = (evt) => {
    evt.preventDefault();
    const { username, password } = state;

    axios
      .post("http://localhost:8000/user/login/", {
        username: username,
        password: password
      })
      .then((res) => {
        console.log(res.data);
        const message = res.data.message;

        if (res.data.status === 200 || res.data.status === 201) {
          setNotify({
            ...notify,
            message: message,
            error: false,
          });
          setTL(true);
          const access_token = res.data.access_token;
          const is_admin = res.data.is_admin;
          // save the access token in the localStorage
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("is_admin", is_admin);
          // Redirect to home page
          if (is_admin) window.location.href = "/admin/SuperAdmin";
          else
          window.location.href = "/";
        } else {
          setNotify({
            ...notify,
            message: message,
            error: true,
          });
          setTL(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setNotify({
          ...notify,
          message: "Server is down",
          error: true,
        });
        setTL(true);
      });

    for (const key in state) {
      setState({
        ...state,
        [key]: ""
      });
    }
  };

  return (
    <div>
      <div className="Signinoncss">
        <div className="form-container sign-in-container">
          <form onSubmit={handleOnSubmit}>
            <h1>Sign in</h1>
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={state.username}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
            <button>Sign In</button>
          </form>
        </div>
      </div>
      {tl && (
        <Snackbar
          place="tl"
          color={notify.error ? "danger" : "success"}
          message={notify.message}
          icon={AddAlert}
          open={tl}
          closeNotification={() => setTL(false)}
          close
        />
      )}
    </div>
  );
};

export default SignInForm;
