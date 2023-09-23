//조회수를 조회를 위한 라우터
import express from "express";
import { registerView, createComment, deletComment } from "../controllers/videoController";


const apiRouter = express.Router();

//요청을 보내더라도 url을 바꾸지 않고 템플릿을 렌더링하지 않기 위해서
//POST만 작성. >> 백엔드에서만 조회수를 업데이트해줌
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/videos/:id([0-9a-f]{24})/comment/delete", deletComment);
export default apiRouter;
