import express from "express";

const PORT = 4000;

const app = express();

const loggerMid = (req, res, next) => {
  console.log(`${req.method} ${req.url} `);
  next();
};

const handleHome = (req, res) => {
  return res.send("I love middlewares");
};

app.get("/", loggerMid, handleHome);

const handleListening = () =>
  console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
