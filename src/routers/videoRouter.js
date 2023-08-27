import express from "express";
import {see, edit,upload,deleteVideo} from "../controllers/videoController";


//video Router도 만들어 주구.
const videoRouter = express.Router();



videoRouter.get("/:id(\\d+)", see); //>> 변수명에 비디오는 필요없음. 이미 비디오 라우터에 안에 있다는 걸 알기때문에.
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", upload);

export default videoRouter;
