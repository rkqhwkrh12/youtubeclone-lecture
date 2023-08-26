import express from "express";
//video Router도 만들어 주구.
const videoRouter = express.Router();

const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

export default videoRouter;
