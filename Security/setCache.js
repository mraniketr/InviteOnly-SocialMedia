let setCache = function (req, res, next) {
  // Seconds
  const period = 60;

  if (req.method == "GET") {
    console.log(req.path);
    res.set("Cache-control", `public, max-age=${period}`);
  } else {
    res.set("Cache-control", `no-store`);
  }

  next();
};

module.exports = setCache;
