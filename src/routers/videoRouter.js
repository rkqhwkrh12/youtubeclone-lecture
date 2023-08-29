import express from "express";
import {watch, getEdit,deleteVideo, postEdit, getupload, postupload} from "../controllers/videoController";


//video Router도 만들어 주구.
const videoRouter = express.Router();



videoRouter.get("/:id([0-9a-f]{24})", watch); //>> 변수명에 비디오는 필요없음. 이미 비디오 라우터에 안에 있다는 걸 알기때문에.
//videoRouter.route("/:id(\\d+)").get(watch); 위에 코드랑 동일
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);

//videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.route("/upload").get(getupload).post(postupload);

export default videoRouter;


