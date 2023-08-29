import express from "express";

//globalRouter에서 쓸 컨트롤러를 불러옴.
import { join , login, logout } from "../controllers/userController";
import { home , search } from "../controllers/videoController";
//README에서 만든 라우터를 만드는 방법.
//import { trending } from "../controllers/videoController";
// >> 콘트롤러의 이름과 무조건 동일 해야 한다.
//default export는 변수자체를 그냥 받아오기 때문에 import할 때의 이름은 내가 정할 수 있음.
//global Router를 만들어 주구.
const globalRouter = express.Router();



//router에 함수를 불러오는 방식은 app에서 get을 통해 불러오던 방식과 동일하다.
// >> app.get("/" , handleHome);

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
//login을 하는 건 user니까 user controller에 함수를 작성해야 겠지?
globalRouter.get("/logout", logout);
globalRouter.get("/search", search);
//search하는 건 video니까 video controller에 함수를 작성해야 겠지?
//export를 해줘야 server.js에서 handleHome함수를 사용할 수 있다.
// default export를 해주면

export default globalRouter;