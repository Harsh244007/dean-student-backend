const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const tokenBearer = req.header("Authorization");
  if (!tokenBearer) return res.sendStatus(401);
  const realToken = tokenBearer.split(" ")[1];

  jwt.verify(realToken, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
