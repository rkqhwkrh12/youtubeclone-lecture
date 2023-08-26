import express from "express";
import morgan from "morgan"; 

const PORT = 4000;
const logger = morgan("dev"); 
//express를 위한 middleware = morgan
//morgan이 조금더 정교함 >> 다양한 정보를 얻을 수 있다. (path, status code, GET 등등)

const app = express();

const home = (req, res) => {
    console.log("Home");
    return res.send("This is Home page.");
}
const login = (req, res) => {
    return res.send("This is the Login page.");
}

app.use(logger);
app.get("/", home);
app.get("/login", login);
console.log("Hello");


const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);


app.listen(PORT, handleListening); 




