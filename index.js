const express = require("express");

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogRouter = require("./controllers/blogs");
const userRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorRouter = require("./controllers/authors");
const { Blog, User } = require("./models");

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).send("ok");
});

app.post("/api/reset", async (_req, res) => {
  await Blog.destroy({ where: {} });
  await User.destroy({ where: {} });
  res.status(204).end();
});

app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorRouter);

const start = async () => {
  await connectToDatabase();

  await User.sync({ alter: true });
  await Blog.sync({ alter: true });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});
