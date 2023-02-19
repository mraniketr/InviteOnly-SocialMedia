const got = require("got");
const dotenv = require("dotenv").config();

const db = require("../DB/appService");
const logger = require("../Logger/Logger");
const jwt = require("./jwt");

// User Enters Mobile Number
const loginStage1 = async (request, response) => {
  const { mobile } = request.body;
  logger.info(`Login Stage 1 Started - ${mobile}`);
  const loginResult = await db.getUserByMobile(mobile);
  if (loginResult != false) {
    try {
      response_API = await got(
        `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/+91${mobile}/AUTOGEN/GJLoginOTPTemplate`
      );
      // response_API = `{
      //   "login": 1,
      //   "message": "OTP Sent Successfully",
      //   "otp_session_ID": "0e55649f-27f5-4b20-8382-1f9d64ad5d0e"
      // }`;

      response.status(200).send(
        JSON.stringify({
          login: 1,
          message: "OTP Sent Successfully",
          family_id: loginResult.familyid,
          otp_session_ID: JSON.parse(response_API.body).Details,
          // otp_session_ID: JSON.parse(response_API).otp_session_ID,
        })
      );
      logger.info(`Login Stage 1 Success - ${mobile} OTP Sent`);
    } catch (error) {
      logger.error(`OTP API ERROR `);
      response.status(500).send(
        JSON.stringify({
          login: 0,
          message: "OTP API SERVICE DOWN",
        })
      );
    }
  } else {
    response.status(401).send(
      JSON.stringify({
        login: 0,
        message: "User Not Found",
      })
    );
    logger.warn(`Login Stage 1 Failed - ${mobile} Not Found`);
  }
};

//   User Enter OTP
const loginStage2 = async (request, response) => {
  const { otp_session_ID, otp, mobile } = request.body;

  const res = await db.getUserByMobile(mobile);
  logger.info(`Login Stage 2 Started Family- ${res.familyid}`);
  try {
    response_API = await got(
      `https://2factor.in/API/V1/${process.env.OTP_API_KEY}/SMS/VERIFY/${otp_session_ID}/${otp}`
    );

    if (JSON.parse(response_API.body).Details == "OTP Matched") {
      // if (true) {
      response
        .status(200)
        .cookie(
          process.env.TOKEN_NAME,
          await jwt.generateAccessToken(res.familyid, res.role),
          {
            // secure: true,
            httpOnly: true,
            maxAge: process.env.JWT_VALIDITY,
            sameSite: "strict",
            path: "/",
          }
        )
        .send(
          JSON.stringify({
            login: 2,
            message: "OTP Matched",
          })
        );
      logger.info(
        `Login Stage 2 Success Family- ${res.familyid} - OTP matched`
      );
    } else {
      logger.warn(`OTP Mismatch `);
      response.status(400).send(
        JSON.stringify({
          login: 1,
          message: "OTP Mismatch",
        })
      );
    }
  } catch (error) {
    logger.error(`Server Down `);
  }
};

const logout = async (request, response) => {
  response
    .status(202)
    .clearCookie(process.env.TOKEN_NAME)
    .send(
      JSON.stringify({
        login: 0,
        message: "Logout Success",
      })
    );
  logger.info(`Logout Success`);
};

const loginJWT = async (request, response) => {
  logger.info(`LoginJWT Success`);
  response.status(200).send(
    JSON.stringify({
      login: 2,
      message: "JWT Verified",
    })
  );
};

module.exports = {
  loginStage1,
  loginStage2,
  loginJWT,
  logout,
};
