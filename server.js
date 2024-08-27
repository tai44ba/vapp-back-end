import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./routers/users.router.js";
import { connectToDB } from "./utils/db.js";
import postRouter from "./routers/posts.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// connect to DB
connectToDB();

//middlewere
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

//router
app.use("/users", userRouter);
app.use("/posts", postRouter);

// error handler
app.use((req, res, next) => {
  const error = new Error("Route Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({ msg: err.message });
  }
});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
