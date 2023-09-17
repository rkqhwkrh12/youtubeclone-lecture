import "dotenv/config"; //이게 젤 처음에 와야 됨.
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";
const PORT = 4000;






const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening);  // >> callback 함수의 전형적인 예시.
