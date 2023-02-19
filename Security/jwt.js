const jwt = require("jsonwebtoken");

const dotenv = require("dotenv").config();

async function generateAccessToken(family_id, userRole) {
  return jwt.sign(
    { family_id: family_id, role: userRole },
    process.env.JWT_TOKEN_SECRET,
    { expiresIn: process.env.JWT_VALIDITY }
  );
}

const authorization = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.family_id = data.family_id;
    req.userRole = data.role;

    return next();
  } catch {
    return res.sendStatus(403);
  }
};

module.exports = {
  generateAccessToken,
  authorization,
};
