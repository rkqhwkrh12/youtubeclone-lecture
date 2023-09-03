import express from "express";
import { see,logout,startGithubLogin,finishGithubLogin, getEdit, postEdit, getChangePassword, postChangePassword} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
// ../의 의미 >> 지금 현재 있는 라우터 파일에서 나가겠다.
//user Router도 만들어 주구.
const userRouter = express.Router();

/*
const handleEdiUser = (req, res) => res.send("Edit User");
const handleDelete = (req, res) => res.send("Delete User");
//라우터랑 콘트롤러를 구분해서 쓰는게 낫다. >> 콘트롤러에 내용이 많아지니까.
//라우터는 콘트롤러를 사용하는 입장임.
*/



userRouter.get("/logout",protectorMiddleware ,logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start",publicOnlyMiddleware , startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware,finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword)
userRouter.get("/:id", see);

/*
anotherRouter.get("/sexy", aaaa); >> 요런식으로 쓴다는 말은
/users/sexy/another  >> 이런식으로 라우터 안에 또다른 라우터를 넣을 수 있다.

>> Router는 공통 시작부분을 기반으로 url을 정리해주는 방법임.

*/



export default userRouter;