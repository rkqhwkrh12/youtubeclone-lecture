import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{type: String, required:true, unique: true},
    socialOnly: {type: Boolean, default:false},
    avartarUrl: String,
    username:{type: String, required:true, unique: true},
    password:{type: String},
    name:{type: String, required:true},
    location: String,
    //video에 저장된 비디오를 유저로 가지고 오는데 배열 형태로 가지고 온다.
    videos:[{type : mongoose.Schema.Types.ObjectId, ref:"Video"}],
});


//form이 저장되기 전에 입력된 패스워드를 해싱해주기 위한 작업.
userSchema.pre('save', async function() {
    //this는 join버튼을 누르면 전달되는 객체를 가르킴. >> user와 같음. 
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5); //이 코드는 하나만 있으면 user가 비디오를 저장할 때마다 
                                                         //hash작업이 계속 일어나게 된다. 그래서 이를 해결해줘야함.
    }
    
}); 

const User = mongoose.model("User" , userSchema);
export default User;
