import express from "express";

//README에서 만든 라우터를 만드는 방법.

//global Router를 만들어 주구.
const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");

//router에 함수를 불러오는 방식은 app에서 get을 통해 불러오던 방식과 동일하다.
// >> app.get("/" , handleHome);

globalRouter.get("/", handleHome);

//export를 해줘야 server.js에서 handleHome함수를 사용할 수 있다.
// default export를 해주면

export default globalRouter;