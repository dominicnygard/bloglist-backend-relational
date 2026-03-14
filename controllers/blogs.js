const express = require("express");

const { Blog } = require("../models");
const { User } = require("../models");
const errorHandler = require("../util/errorHandler");
const tokenExtractor = require("../util/middleware");

const { Op } = require("sequelize");

const router = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }

  return next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    const search = String(req.query.search).trim();

    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${search}%`,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  try {
    if (!req.decodedToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }

    const user = await User.findByPk(req.decodedToken.id);

    if (!user) {
      return res.status(401).json({ error: "user not found for token" });
    }

    const blog = await Blog.create({ ...req.body, userId: user.id });
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog.userId !== req.decodedToken.id) {
    return res.status(403).json({ error: "forbidden" });
  }

  await req.blog.destroy();
  res.status(204).end();
});

router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    if (req.body.likes !== undefined) {
      req.blog.likes = req.body.likes;
    }
    await req.blog.save();
    return res.json(req.blog);
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
