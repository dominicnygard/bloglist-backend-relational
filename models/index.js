const Blog = require("./blog");
const User = require("./user");
const ReadingList = require("./reading_list");
const Session = require("./session");

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readings",
  foreignKey: "user_id",
  otherKey: "blog_id",
});
Blog.belongsToMany(User, {
  through: ReadingList,
  foreignKey: "blog_id",
  otherKey: "user_id",
});

User.hasMany(Session, {
  foreignKey: "user_id",
});
Session.belongsTo(User, {
  foreignKey: "user_id",
});

module.exports = { Blog, User, ReadingList, Session };
