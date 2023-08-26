import express from "express";

//user Router도 만들어 주구.
const userRouter = express.Router();

const handleEdiUser = (req, res) => res.send("Edit User");


userRouter.get("/edit", handleEdiUser);
//edit이 주요작업이니까 get("", ); >> ""요기에 edit이 들어가면 되겠지?

export default userRouter;