const router = require("express").Router();

const { Session } = require("../models");
const tokenExtractor = require("../util/middleware");

router.delete("/", tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      user_id: req.decodedToken.id,
    },
  });

  return res.status(204).end();
});

module.exports = router;
