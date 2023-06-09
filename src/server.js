import express from "express";
import flash from "express-flash";

import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import rootRouter from "./routers/rootRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

import {
  localsMiddleware,
  smallVideoPlayer,
  lastPage,
  nowUrl,
} from "./middlewares";
import apiRouter from "./routers/apiRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);
app.use(express.urlencoded({ extended: true }));
// form에 입력된 데이터를 서버가 이해하도록 해줌
app.use(express.json());
/* request로 들어오는 json string 형태의 object(text)를
서버가 이해하고 object로 바꿔주도록 해줌*/

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

app.use(flash()); // 플래시메시지를 남기기위한 모듈
app.use(localsMiddleware);
app.use(lastPage);
app.use(smallVideoPlayer);

/* 서버에 있는 모든 페이지에 요청이 가기 전 공통적으로 사용하는 미들웨어*/
app.use("/uploads", express.static("uploads"));
app.use("/ast", express.static("assets"));
/* static(=정적폴더)를 사람들에게 공개 하도록 express에게 요청
=> 서버가 공개할 폴더 지정 = 접근권한 부여*/

app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");

  next();
}); //동영상 촬영시 에러 나는부분 해결

app.use(nowUrl);

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

app.use("/api", apiRouter);

export default app;
