const jwt = require("jsonwebtoken");

const { SECRET } = require("../util/config");
const { Session, User } = require("../models");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  const token = authorization.substring(7);

  try {
    req.decodedToken = jwt.verify(token, SECRET);
  } catch {
    return res.status(401).json({ error: "token invalid" });
  }

  const session = await Session.findOne({
    where: {
      token,
    },
  });

  if (!session) {
    return res.status(401).json({ error: "session expired" });
  }

  const user = await User.findByPk(req.decodedToken.id);

  if (!user) {
    return res.status(401).json({ error: "user not found" });
  }

  if (user.disabled) {
    return res.status(401).json({ error: "user account disabled" });
  }

  req.user = user;

  return next();
};

module.exports = tokenExtractor;
