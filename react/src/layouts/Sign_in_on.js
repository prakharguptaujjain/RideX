import React, { useState } from "react";
import "components/Sign_in_on/signin.css";
import SignInForm from "../components/Sign_in_on/signin";
import SignUpForm from "components/Sign_in_on/signup.js";
import { useEffect } from "react";
import axios from "axios";
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";

/* The commented code is a React functional component that renders a sign-in/sign-up form. */
export default function Signinon() {
  const [type, setType] = useState("signIn");
  const handleOnClick = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };
  const containerClass =
    "container " + (type === "signUp" ? "right-panel-active" : "");
  return (
    <div className="Signinoncss">
      <div className={containerClass} id="container">
      <SignInForm />
      <SignUpForm />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome To!</h1>
              <p>
                <h1 id="uniqueHeading">RideX</h1>
              </p>
              <button
                className="ghost"
                id="signIn"
                onClick={() => handleOnClick("signIn")}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1  id="uniqueHeading">RideX</h1>
              <h2>Your one in all ride sharing app</h2>
              <button
                className="ghost "
                id="signUp"
                onClick={() => handleOnClick("signUp")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
