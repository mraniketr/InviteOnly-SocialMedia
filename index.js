require("dotenv").config();

const express = require("express");
var cors = require("cors");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: Number(process.env.mpPpSize),
    files: Number(process.env.mpFileLimit),
    parts: Number(process.env.mpPartsLimit),
  },
});
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
// To test production build on localhost uncomment next line
// app.use(express.static(path.join(__dirname, "frontend/build")));

if (process.env.NODE_ENV === "production") {
  //server static content
  app.use(express.static(path.join(__dirname, "frontend/build")));
}
var cookieParser = require("cookie-parser");
const jwt = require("./Security/jwt");
// const setCache = require("./Security/setCache");
var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
};

// app.use(express.json(), cors(corsOptions), setCache, cookieParser());
app.use(express.json(), cors(corsOptions), cookieParser());
const logger = require("./Logger/Logger");

const db = require("./DB/appService");
const auth = require("./Security/authentication");
// const token = require('./token')

app.listen(port, () => {
  logger.info(`App running on port ${port}.`);
});

// Authentication Endpoints
app.post("/api/loginStage1", auth.loginStage1);
app.post("/api/loginStage2", auth.loginStage2);
app.get("/api/loginJWT", jwt.authorization, auth.loginJWT);
app.post("/api/logout", jwt.authorization, auth.logout);

// User Endpoints
app.post("/api/family/", jwt.authorization, db.getAllFamily);
app.get("/api/family/:id", jwt.authorization, db.getFamily);
app.put("/api/family/", jwt.authorization, db.updateFamily);
// d=device
app.put("/api/family/d", jwt.authorization, db.updateMobile);

// pp=profile picture - not used
// app.put("/api/family/pp", jwt.authorization, upload.single("pp"), db.updatePP);
// app.delete("/api/family/pp", jwt.authorization, db.deletePP);
// app.post("/api/family/", jwt.authorization, db.updateFamily);
// m=members
app.get("/api/family/m/:id", jwt.authorization, db.getFamilyMembers);
app.delete("/api/family/m", jwt.authorization, db.deleteFamilyMember);
app.post(
  "/api/family/m",
  jwt.authorization,
  upload.single("pp"),
  db.createFamilyMember
);

// Admin Endpoints
app.delete("/api/family/:id", db.deleteUser);

// app.get("/api/common/pincode/:pincode", jwt.authorization, db.getPincodeData);
app.get("/api/common/filter/:filterName", jwt.authorization, db.getFilterData);
// Blog Endpoints
app.delete("/api/blog/b/:blogId", jwt.authorization, db.deleteSingleBlog);
app.post(
  "/api/admin/blog",
  jwt.authorization,
  upload.single("blogCover"),
  db.createBlog
);
app.post("/api/blog", jwt.authorization, db.getAllBlog);
// app.get("/api/blog/b/:blogId", jwt.authorization, db.getSingleBlog);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build/index.html"));
});
