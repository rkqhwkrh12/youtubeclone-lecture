import mongoose from "mongoose";

//mongoose로 테이터 베이스를 연결함.
mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
db.on("error", (error) => console.log("DB Error", error));//error는 여러번 일어날 수 있음.
db.once("open", handleOpen); //오로지 한 번만 일어남

