import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();
const loggerMid = morgan("dev");

app.use(loggerMid);

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("Home");

globalRouter.get("/", handleHome);

const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit User");

userRouter.get("/edit", handleEditUser);

const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

const home = (req, res) => {
  console.log(`Response complete`);
  return res.send(
    "Welcome my home <a href=http://localhost:4000/login>go to Log-in</a>"
  );
};

const login = (req, res) => {
  console.log(`Response complete`);
  return res.send(
    "It's Log-in page <a href=http://localhost:4000/>back to home</a>"
  );
};

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
