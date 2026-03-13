const router = require("express").Router();
const { Blog } = require("../models");
const { fn, col, literal } = require("sequelize");
const errorHandler = require("../util/errorHandler");

router.get("/", async (_req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("id")), "blogs"],
        [fn("COALESCE", fn("SUM", col("likes")), 0), "likes"],
      ],
      group: ["author"],
      order: [[literal("likes"), "DESC"]],
    });

    const formattedAuthors = authors.map((author) => ({
      author: author.author,
      blogs: Number(author.get("blogs")),
      likes: Number(author.get("likes")),
    }));

    return res.json(formattedAuthors);
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
