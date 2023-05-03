import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    /* cookie: { 
       maxAge: 10000, //브라우저의 쿠키를 얼마동안 유지할지 시간 설정
    }, */
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(localsMiddleware);
/* 서버에 있는 모든 페이지로 이동하기 전에 (=모든 컨트롤러 사용 이전)
 localsMiddleware를 거친 후에 감 */
app.use("/uploads", express.static("uploads"));
app.use("/ast", express.static("assets"));
/* static(=정적폴더)를 사람들에게 공개 하도록 express에게 요청
=> 서버가 공개할 폴더 지정 */
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
