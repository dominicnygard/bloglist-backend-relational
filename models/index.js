const Blog = require("./blog");
const User = require("./user");

User.hasMany(Blog, { foreignKey: "userId" });
Blog.belongsTo(User, { foreignKey: "userId" });

Blog.sync({ alter: true });
User.sync({ alter: true });

module.exports = { Blog, User };
