
import mongoose from "mongoose";

//mongoose로 테이터 베이스를 연결함.
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log("DB Error", error);
db.on("error", handleError);//error는 여러번 일어날 수 있음.
db.once("open", handleOpen); //오로지 한 번만 일어남

