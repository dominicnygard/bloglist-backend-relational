const express = require("express");

const { Blog } = require("../models");

const router = express.Router();

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }

  return next();
};

const errorHandler = (err, _req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" });
  }

  if (err.name === "SequelizeValidationError") {
    return res.status(400).send({ error: err.message });
  }

  if (err.name === "SequelizeDatabaseError") {
    return res
      .status(400)
      .send({ error: err.original?.message ?? err.message });
  }

  return next(err);
};

router.get("/", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res, next) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
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
