import express from "express";

//globalRouter에서 쓸 컨트롤러를 불러옴.
import { getJoin, getLogin, logout, postJoin, postLogin } from "../controllers/userController";
import { home , search } from "../controllers/videoController";
//README에서 만든 라우터를 만드는 방법.
//import { trending } from "../controllers/videoController";
// >> 콘트롤러의 이름과 무조건 동일 해야 한다.
//default export는 변수자체를 그냥 받아오기 때문에 import할 때의 이름은 내가 정할 수 있음.
//global Router를 만들어 주구.
const rootRouter = express.Router();



//router에 함수를 불러오는 방식은 app에서 get을 통해 불러오던 방식과 동일하다.
// >> app.get("/" , handleHome);

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
//login을 하는 건 user니까 user controller에 함수를 작성해야 겠지?
rootRouter.get("/logout", logout);
rootRouter.get("/search", search);
//search하는 건 video니까 video controller에 함수를 작성해야 겠지?
//export를 해줘야 server.js에서 handleHome함수를 사용할 수 있다.
// default export를 해주면

export default rootRouter;