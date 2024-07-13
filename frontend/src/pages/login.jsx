import React from "react";
import { signInWithGoogle, signInWithGithub } from "../firebase";

import IconGoogle from "../assets/images/google.png";
import IconGithub from "../assets/images/github.png";

const login = () => {

  return (
    <div className="loginPage">
      <div className="wrapper styleBox hvr-pulse-grow">
        <h1>Masuk Dengan </h1>
        <div className="parents">
          <div className="child">
            <img className="hvr-wobble-horizontal"
              style={{ width: "30px" }}
              src={IconGoogle}
              alt="Login with Google"
              onClick={signInWithGoogle}
            />
          </div>
          <div className="child">
            <img className="hvr-wobble-horizontal"
              style={{ width: "40px" }}
              src={IconGithub}
              alt="Login with Github"
              onClick={signInWithGithub}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
