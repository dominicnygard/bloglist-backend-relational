const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const { User, Session } = require("../models");

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.username || !body.password) {
    return res.status(400).json({
      error: ["username and password are required"],
    });
  }

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(body.password, user.password);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "Invalid username or password",
    });
  }

  if (user.disabled) {
    return res.status(401).json({
      error: "user account disabled",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);

  await Session.create({
    token,
    user_id: user.id,
  });

  return res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = router;
