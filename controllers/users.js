const bcrypt = require("bcrypt");
const router = require("express").Router();
const { User, Blog } = require("../models");
const errorHandler = require("../util/errorHandler");

router.get("/", async (_req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const { username, name, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      name,
      password: passwordHash,
    });

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.username = req.body.username;
    await user.save();
    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
