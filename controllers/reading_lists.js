const router = require("express").Router();
const { ReadingList, Blog, User } = require("../models");
const errorHandler = require("../util/errorHandler");
const tokenExtractor = require("../util/middleware");

router.post("/", async (req, res, next) => {
  try {
    const blogId = req.body.blogId;
    const userId = req.body.userId;

    if (!blogId || !userId) {
      return res
        .status(400)
        .json({ error: ["blogId and userId are required"] });
    }

    const [blog, user] = await Promise.all([
      Blog.findByPk(blogId),
      User.findByPk(userId),
    ]);

    if (!blog) {
      return res.status(404).json({ error: ["blog not found"] });
    }

    if (!user) {
      return res.status(404).json({ error: ["user not found"] });
    }

    const existingEntry = await ReadingList.findOne({
      where: {
        blog_id: blogId,
        user_id: userId,
      },
    });

    if (existingEntry) {
      return res
        .status(400)
        .json({ error: ["blog already in user's reading list"] });
    }

    const readingListEntry = await ReadingList.create({
      blog_id: blogId,
      user_id: userId,
      read: false,
    });

    return res.status(201).json({
      id: readingListEntry.id,
      blog_id: readingListEntry.blog_id,
      user_id: readingListEntry.user_id,
      read: readingListEntry.read,
    });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", tokenExtractor, async (req, res, next) => {
  try {
    if (!req.decodedToken.id) {
      return res.status(401).json({ error: ["token invalid"] });
    }

    if (typeof req.body.read !== "boolean") {
      return res
        .status(400)
        .json({ error: ["read must be provided as boolean"] });
    }

    const readingListEntry = await ReadingList.findByPk(req.params.id);

    if (!readingListEntry) {
      return res.status(404).json({ error: ["reading list entry not found"] });
    }

    if (readingListEntry.user_id !== req.decodedToken.id) {
      return res.status(401).json({ error: ["forbidden"] });
    }

    readingListEntry.read = req.body.read;
    await readingListEntry.save();

    return res.json({
      id: readingListEntry.id,
      blog_id: readingListEntry.blog_id,
      user_id: readingListEntry.user_id,
      read: readingListEntry.read,
    });
  } catch (error) {
    return next(error);
  }
});

router.use(errorHandler);

module.exports = router;
