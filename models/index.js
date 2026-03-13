const Blog = require("./blog");
const User = require("./user");

User.hasMany(Blog, { foreignKey: "userId" });
Blog.belongsTo(User, { foreignKey: "userId" });

module.exports = { Blog, User };
