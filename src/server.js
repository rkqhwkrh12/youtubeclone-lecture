//server.js >> configuration에 관련된 코드만 처리하기 위해 만들어짐.

import express from "express";
import morgan from "morgan"; 
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter
 from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";



const app = express();
const logger = morgan("dev"); 

//express를 위한 middleware = morgan
//morgan이 조금더 정교함 >> 다양한 정보를 얻을 수 있다. (path, status code, GET 등등)
//router는 url이 어떻게 시작하는 지에 따라 나누는 방법.

//console.log(process.cwd()); //현재 작업중인 환경을 보고 싶을 때 쓰면 됨.
//현재 작업 디렉토리는 노드를 시작하는 디렉토리이다.

//pug를 사용하는 이유 >> html을 매번 보낼 수가 없다. 그래서 pug로 보냄.
//1. pug 설치
//2. pug를 view 엔진으로 설정한다.
//3. pug 파일을 생성한다.


app.set("view engine", "pug"); //export나 import를 해줄 필요가 없다.
                               //이코드를 통해서 express가 views 디렉토리에서 pug파일을 찾도록 설정되어 있기 때문에.

app.set("views", process.cwd() + "/src/views");
app.use(logger);

app.use(express.urlencoded({extended: true}));
//github 로그인할 때 필요
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false, //log됐을 때만 세션이 생성되게
        store: MongoStore.create({ mongoUrl: process.env.DB_URL }),

    })
);


app.use(localsMiddleware); //무조건 session밑에 있어야 함.
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "credentialless");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
export default app







