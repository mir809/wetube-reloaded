import express from "express";
import morgan from "morgan";

const PORT = 4000;

const app = express();

const loggerMid = morgan("dev");

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

app.use(loggerMid);
app.get("/", home);
app.get("/login", login);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
