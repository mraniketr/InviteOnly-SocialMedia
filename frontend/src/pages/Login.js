import React, { useState } from "react";
import Countdown from "react-countdown";

import requestsURL from "../APIComponents/requests";
import * as backendAPI from "../APIComponents/apiCalls";
import cookies from "../APIComponents/cookieMaker";

import config from "../config.json";
// const dotenv = require('dotenv').config();

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [otp, setOTP] = useState("");

  const [disable, setDisable] = useState(true);
  const [disableTextBox, setdisableTextBox] = useState(true);
  const [buttonText, setButtonText] = useState("Send OTP");
  const [message, setMessage] = useState("");
  const [verifyStatus, setverifyStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (buttonText === "Send OTP") {
      // Stage1
      backendAPI
        .apiFetch(
          requestsURL.loginStage1,
          JSON.stringify({ mobile: mobile }),
          "POST"
        )
        .then((res) => {
          if (res.login === 1) {
            console.log("OTP Sent");
            setButtonText("Verify OTP");
            setMessage(`OTP sent to ${mobile}`);
            setDisable(true);
            setdisableTextBox(false);
            cookies.set("otp_session_ID", res.otp_session_ID, {
              maxAge: config.OTP_SessionValidity,
            });
            cookies.set("family_id", res.family_id, {
              maxAge: config.REACT_APP_loginValidity,
            });
          } else {
            setMessage(`User ${mobile} Not Found ,Contact ADMIN`);
            console.log("User Not Found");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("API SERVER DOWN");
        });
    } else {
      //Stage2
      backendAPI
        .apiFetch(
          requestsURL.loginStage2,
          JSON.stringify({
            mobile: mobile,
            otp_session_ID: cookies.get("otp_session_ID"),
            otp: otp,
            family_id: cookies.get("family_id"),
          }),
          "POST"
        )
        .then((res) => {
          if (res.login === 2) {
            console.log("OTP Verified");
            setMessage(`OTP Verified`);

            cookies.set("isLoggedIn", true, {
              maxAge: config.REACT_APP_loginValidity,
            });
            cookies.remove("otp_session_ID");
            window.location.pathname = "/Services";
          } else {
            setverifyStatus("OTP Not Verified");
            console.log("OTP Not Verified");
          }
        })
        .catch((err) => {
          console.log(err);
          console.log("API SERVER DOWN");
        });
    }
  };
  // function checkLoggedIn(){
  //   if(cookies.get("isLoggedIn")){
  //     window.location="/"
  //   }
  // }
  //   useEffect(()=>{
  //     checkLoggedIn();
  //   },[])

  const renderer = ({ seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return (
        <button
          className="btn btn-warning btn-sm"
          onClick={() => {
            setMobile(mobile);
            setOTP("");
            setDisable(true);
            setdisableTextBox(true);
            setButtonText("Send OTP");
            setMessage(mobile);
            setverifyStatus("");
          }}
        >
          Click here
        </button>
      );
    } else {
      // Render a countdown
      return <span>Wait {seconds} sec </span>;
    }
  };

  return (
    <main className="form-signin">
      <div className="splash-logo">
        <img
          className="rounded float-left"
          src="/logo.png"
          alt=""
          width="130"
          height="200"
        />
        <h1>Rinchher Darpan</h1>
      </div>
      <form onSubmit={handleSubmit}>
        {!disableTextBox ? (
          ""
        ) : (
          <div className="form-floating">
            <input
              type="tel"
              className="form-control"
              id="floatingInput"
              pattern="[1-9]{1}[0-9]{9}"
              placeholder="a"
              value={mobile}
              maxlength="10"
              onChange={(e) => {
                setMobile(e.target.value);
                setDisable(false);
              }}
            />
            <label htmlFor="floatingInput">
              Enter Registered Mobile Number
            </label>
            <p className="text-danger">{message}</p>
          </div>
        )}
        {disableTextBox ? (
          ""
        ) : (
          <div className="form-floating">
            <input
              type="tel"
              className="form-control"
              id="floatingPassword"
              pattern="[1-9]{5}[0-9]{1}"
              placeholder="a"
              maxlength="6"
              value={otp}
              onChange={(e) => {
                setOTP(e.target.value);
                setDisable(false);
              }}
            />
            <label htmlFor="floatingPassword">Enter OTP recieved</label>
            <p className="text-success">{message}</p>
            <p className="text-danger">{verifyStatus}</p>
            <p className="text-secondary">
              <b>
                <Countdown date={Date.now() + 59000} renderer={renderer} />
              </b>{" "}
              to Edit Number/Resend OTP
            </p>
          </div>
        )}

        <button
          disabled={disable}
          className="w-100 btn btn-lg btn-secondary"
          type="submit"
        >
          {buttonText}
        </button>
      </form>
      <p className="text-warning text-center">
        Contact ADMIN for Login Issues/Registration
      </p>
    </main>
  );
}
