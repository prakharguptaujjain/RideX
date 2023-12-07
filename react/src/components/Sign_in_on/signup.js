import React from "react";
import axios from "axios";
import "./signin.css";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";

function SignUpForm() {
  const [tl, setTL] = React.useState(false);
  const [notify, setNotify] = React.useState({
    open: false,
    message: "",
    severity: "success",
    handleClose: () => {
      setNotify((prev) => ({ ...prev, open: false }));
    },
  });
  const [state, setState] = React.useState({
    first_name:"",
    last_name:"",
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { first_name,last_name,username, email, password,confirm_password } = state;
    if (password !== confirm_password) {
      setNotify({
        ...notify,
        message: "Passwords do not match",
        error: true,
      });
      setTL(true);
      return;
    }
    axios.post("http://localhost:8000/user/register/",
        {
            "first_name": first_name,
            "last_name":last_name,
            "username": username,
            "email": email,
            "password": password,
            "confirm_password": confirm_password
        }
        )
        .then((res) => {
            console.log(res);
            console.log(res.data);
            const message = res.data.message;
            if (res.data.status===200 || res.data.status===201)
            {
            setNotify({
                ...notify,
                message: message,
                error: false,
            });
            setTL(true);
          }
            else{
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
    
      setState({
        ...state,
        password: "",
        confirm_password: ""
      });
  };

  return (
    <div>
      <div className="Signinoncss">
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1 >Create</h1>
        <input
          type="text"
          name="first_name"
          value={state.name}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          type="text"
          name="last_name"
          value={state.name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          type="text"
          name="username"
          value={state.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="password"
          name="confirm_password"
          value={state.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <button>Sign Up</button>
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
}

export default SignUpForm;
