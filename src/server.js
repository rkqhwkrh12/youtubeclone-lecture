import express from "express";
import morgan from "morgan"; 
import globalRouter from "./routers/globalRouter";
import userRouter
 from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;
const app = express();
const logger = morgan("dev"); 
app.use(logger);
//express를 위한 middleware = morgan
//morgan이 조금더 정교함 >> 다양한 정보를 얻을 수 있다. (path, status code, GET 등등)






app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);








const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);


app.listen(PORT, handleListening); 




