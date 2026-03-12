import "dotenv/config";
import {
  Sequelize,
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import express, { Request } from "express";

const app = express();

app.use(express.json());

const sequelize = new Sequelize(String(process.env.DATABASE_URL), {});

class Blog extends Model<InferAttributes<Blog>, InferCreationAttributes<Blog>> {
  declare id: CreationOptional<number>;
  declare author: CreationOptional<string>;
  declare url: string;
  declare title: string;
  declare likes: number;
}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "blog",
  },
);

void Blog.sync();

type BlogCreationAttributes = InferCreationAttributes<Blog>;

app.get("/api/blogs", async (_req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

app.post(
  "/api/blogs",
  async (req: Request<unknown, unknown, BlogCreationAttributes>, res) => {
    try {
      const blog = await Blog.create(req.body);
      return res.json(blog);
    } catch (error) {
      let errorMessage = "Something went wrong.";
      if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
      }
      return res.status(400).send(errorMessage);
    }
  },
);

app.delete(
  "/api/blogs/:id",
  async (req: Request<{ id: string }, unknown, unknown>, res) => {
    const blog = await Blog.findByPk(req.params.id);
    if (blog) {
      await blog.destroy();
      return res.status(204).end();
    } else {
      return res.status(404).end();
    }
  },
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
